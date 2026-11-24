import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClassLevel, VoicePersona } from '../types';
import type {
  LiveConnectionState,
  LiveRole,
  LiveTranscriptItem,
} from './useLiveTeacher';
import {
  abortOfflineAiGeneration,
  extractTextFromImageOffline,
  generateOfflineLiveReply,
  isOfflineAiPackInstalled,
  isOfflineFeatureAllowed,
  transcribeOfflineAudio,
} from '../offline/offlineAiEngine';
import { answerOfflineQuestion } from '../offline/offlineKnowledge';

interface SpeechRecognitionAltLike {
  transcript: string;
}
interface SpeechRecognitionResLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAltLike;
}
interface SpeechRecognitionEvtLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResLike;
  };
}
interface SpeechRecognitionInstLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: SpeechRecognitionEvtLike) => void) | null;
  onerror: ((ev: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstLike;

function getBrowserSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function cleanSpokenText(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/[#`>_~]/g, '')
    .replace(/---[\s\S]*$/g, '')
    .replace(/\n{2,}/g, '। ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function downsampleTo16k(input: Float32Array, sampleRate: number): Float32Array {
  if (sampleRate === 16000) return new Float32Array(input);
  const ratio = sampleRate / 16000;
  const newLength = Math.max(1, Math.round(input.length / ratio));
  const out = new Float32Array(newLength);
  let outIdx = 0;
  let inIdx = 0;
  while (outIdx < newLength) {
    const nextIn = Math.min(input.length, Math.round((outIdx + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let i = inIdx; i < nextIn; i += 1) {
      sum += input[i];
      count += 1;
    }
    out[outIdx] = count > 0 ? sum / count : 0;
    outIdx += 1;
    inIdx = nextIn;
  }
  return out;
}

function concatFloat32Chunks(chunks: Float32Array[]): Float32Array {
  let totalLength = 0;
  for (const c of chunks) totalLength += c.length;
  const merged = new Float32Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return merged;
}

function getPersonaSpeechProfile(voice: VoicePersona): { rate: number; pitch: number } {
  switch (voice) {
    case 'Kore':
      return { rate: 0.96, pitch: 1.06 };
    case 'Puck':
      return { rate: 1.04, pitch: 1.12 };
    case 'Charon':
      return { rate: 0.92, pitch: 0.88 };
    case 'Zephyr':
    default:
      return { rate: 0.95, pitch: 1.0 };
  }
}

function isGreetingOrShortSmalltalk(text: string): boolean {
  const clean = text.trim().toLowerCase();
  return /^(hi|hello|hey|good morning|good evening|namaste|salam|assalamu|হ্যালো|হাই|স্যার|নমস্কার|কেমন আছেন|hello teacher|হ্যালো স্যার)[!.?\s]*$/i.test(
    clean,
  );
}

export function useOfflineLiveTeacher() {
  const [status, setStatus] = useState<LiveConnectionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [interimUserText, setInterimUserText] = useState('');
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);

  const sessionRunIdRef = useRef(0);
  const activeOptionsRef = useRef<{
    className: ClassLevel;
    voiceName: VoicePersona;
    liveRole: LiveRole;
    studentName?: string;
  }>({
    className: 'Class 10',
    voiceName: 'Zephyr',
    liveRole: 'bengali',
    studentName: '',
  });

  const transcriptsRef = useRef<LiveTranscriptItem[]>([]);
  transcriptsRef.current = transcripts;

  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;
  const isTeacherSpeakingRef = useRef(false);
  const isProcessingTurnRef = useRef(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const speechRecRef = useRef<SpeechRecognitionInstLike | null>(null);

  const utteranceChunksRef = useRef<Float32Array[]>([]);
  const speechStartedAtRef = useRef<number>(0);
  const lastVoiceAtRef = useRef<number>(0);
  const lastMicMeterAtRef = useRef<number>(0);

  const stopTeacherSpeaking = useCallback(() => {
    abortOfflineAiGeneration();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isTeacherSpeakingRef.current = false;
    setIsTeacherSpeaking(false);
  }, []);

  const speakOfflineReply = useCallback(
    (text: string, runId: number) => {
      const cleaned = cleanSpokenText(text);
      if (!cleaned) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const { voiceName, liveRole } = activeOptionsRef.current;
      const profile = getPersonaSpeechProfile(voiceName);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      const hasBengaliChars = /[\u0980-\u09FF]/.test(cleaned);
      const targetLang =
        liveRole === 'english' && !hasBengaliChars ? 'en-IN' : hasBengaliChars ? 'bn-IN' : 'en-IN';
      utterance.lang = targetLang;
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;

      const voices = window.speechSynthesis.getVoices?.() ?? [];
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.toLowerCase())) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(hasBengaliChars ? 'bn' : 'en')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(hasBengaliChars ? 'hi' : 'en'));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        if (sessionRunIdRef.current !== runId) return;
        isTeacherSpeakingRef.current = true;
        setIsTeacherSpeaking(true);
      };

      const finishSpeak = () => {
        if (sessionRunIdRef.current !== runId) return;
        isTeacherSpeakingRef.current = false;
        setIsTeacherSpeaking(false);
      };

      utterance.onend = finishSpeak;
      utterance.onerror = finishSpeak;

      isTeacherSpeakingRef.current = true;
      setIsTeacherSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const appendTranscript = useCallback(
    (role: 'user' | 'model', text: string, imageDataUrl?: string): string => {
      const id = `off-live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setTranscripts((prev) => [
        ...prev,
        {
          id,
          role,
          text: text.trim(),
          imageDataUrl,
        },
      ]);
      return id;
    },
    [],
  );

  const updateTranscriptById = useCallback((id: string, text: string) => {
    setTranscripts((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
  }, []);

  const respondToStudentInput = useCallback(
    async (studentText: string, runId: number, options?: { skipAppendUser?: boolean }) => {
      const cleanQuestion = studentText.trim();
      if (!cleanQuestion || sessionRunIdRef.current !== runId) return;

      stopTeacherSpeaking();
      isProcessingTurnRef.current = true;
      setIsThinking(true);
      setError(null);

      if (!options?.skipAppendUser) {
        appendTranscript('user', cleanQuestion);
      }

      const { className, liveRole, studentName } = activeOptionsRef.current;
      const cleanName = studentName?.trim() || '';

      try {
        // 1. Instant greeting handling
        if (isGreetingOrShortSmalltalk(cleanQuestion)) {
          const reply =
            liveRole === 'english'
              ? `Hello${cleanName ? ` ${cleanName}` : ''}! I am your Wbsec Offline Live Teacher for ${className}. Ask me any question by voice, text, or book photo!`
              : liveRole === 'bilingual'
                ? `Hello${cleanName ? ` ${cleanName}` : ''}! হ্যালো${cleanName ? ` ${cleanName}` : ''}! আমি তোমার ${className}-এর অফলাইন লাইভ টিচার। তুমি যেকোনো প্রশ্ন বলো বা বইয়ের ছবি দেখাও, আমি বুঝিয়ে দেব!`
                : `হ্যালো${cleanName ? ` ${cleanName}` : ''}! আমি তোমার ${className}-এর অফলাইন লাইভ টিচার। ইন্টারনেট ছাড়াই তুমি আমাকে যেকোনো প্রশ্ন মুখে বলো, লেখো বা বইয়ের ছবি দেখাও — আমি সহজ করে বুঝিয়ে দেব!`;
          appendTranscript('model', reply);
          setIsThinking(false);
          speakOfflineReply(reply, runId);
          return;
        }

        // 2. Check instant built-in WBBSE notes, cached online answers, and math solver
        const localHit = answerOfflineQuestion(cleanQuestion, className, false);
        const hasExactLocalHit = Boolean(localHit.matchedTopicTitle);

        // 3. If 250MB or 500MB Offline AI Pack is installed (and Live is allowed), generate true conversational AI answer
        if (isOfflineAiPackInstalled() && isOfflineFeatureAllowed('live')) {
          const modelMsgId = appendTranscript('model', '...');
          let streamed = '';

          const historyTurns = transcriptsRef.current
            .filter((t) => t.id !== modelMsgId && t.text && t.text !== '...')
            .slice(-6)
            .map((t) => ({ role: t.role, text: t.text }));

          try {
            const reply = await generateOfflineLiveReply({
              className,
              liveRole,
              studentName: cleanName || undefined,
              history: historyTurns,
              userText: cleanQuestion,
              contextHint: hasExactLocalHit ? localHit.answer : undefined,
              onChunk: (chunk) => {
                if (sessionRunIdRef.current !== runId) return;
                streamed += chunk;
                updateTranscriptById(modelMsgId, streamed.replace(/[*#`_]/g, '').trim() || '...');
              },
            });

            if (sessionRunIdRef.current !== runId) return;
            const finalReply = reply || cleanSpokenText(localHit.answer);
            updateTranscriptById(modelMsgId, finalReply);
            setIsThinking(false);
            speakOfflineReply(finalReply, runId);
            return;
          } catch {
            // Fall back cleanly to local WBBSE note/math answer if local LLM failed
            const fallbackReply = cleanSpokenText(localHit.answer).slice(0, 650);
            updateTranscriptById(modelMsgId, fallbackReply);
            setIsThinking(false);
            speakOfflineReply(fallbackReply, runId);
            return;
          }
        }

        // 4. Instant offline response (when 250MB / 500MB Offline AI Pack is not downloaded yet)
        const spokenVersion = hasExactLocalHit
          ? cleanSpokenText(localHit.answer).slice(0, 650)
          : liveRole === 'english'
            ? `I heard: "${cleanQuestion}". For full AI answers to any question offline, please download the Offline AI Pack (250MB Fast or 500MB Pro) once while online. Right now you can ask any math sum or WBBSE syllabus topic like Photosynthesis, Newton's Laws, or Battle of Plassey.`
            : `আমি শুনেছি: "${cleanQuestion}"। যেকোনো প্রশ্নে অনলাইনের মতো পূর্ণাঙ্গ অফলাইন লাইভ উত্তর পেতে একবার ইন্টারনেট অন করে "Offline AI (250 MB / 500 MB)" প্যাকটি ডাউনলোড করে নিন। এখনই আপনি যেকোনো অঙ্ক (যেমন ২৫ গুণ ১৪) বা পাঠ্যবইয়ের বিষয় যেমন সালোকসংশ্লেষ, নিউটনের সূত্র, পলাশীর যুদ্ধ বা ওহমের সূত্র জিজ্ঞেস করতে পারেন।`;

        appendTranscript('model', spokenVersion);
        setIsThinking(false);
        speakOfflineReply(spokenVersion, runId);
      } finally {
        isProcessingTurnRef.current = false;
        setIsThinking(false);
      }
    },
    [appendTranscript, speakOfflineReply, stopTeacherSpeaking, updateTranscriptById],
  );

  const flushRecordedUtterance = useCallback(
    async (runId: number) => {
      if (sessionRunIdRef.current !== runId) return;
      const chunks = utteranceChunksRef.current;
      utteranceChunksRef.current = [];
      speechStartedAtRef.current = 0;

      if (chunks.length === 0 || isProcessingTurnRef.current) return;

      const pcm16k = concatFloat32Chunks(chunks);
      // Require at least ~0.35s of audio
      if (pcm16k.length < 5600) return;

      if (!isOfflineAiPackInstalled() || !isOfflineFeatureAllowed('live')) return;

      isProcessingTurnRef.current = true;
      setInterimUserText(
        activeOptionsRef.current.liveRole === 'english'
          ? 'Understanding your voice offline...'
          : 'অফলাইনে আপনার কথা বোঝা হচ্ছে...',
      );

      try {
        const lang = activeOptionsRef.current.liveRole === 'english' ? 'english' : 'bengali';
        const recognized = await transcribeOfflineAudio(pcm16k, lang);
        if (sessionRunIdRef.current !== runId) return;
        setInterimUserText('');

        const cleaned = recognized
          .replace(/\[BLANK_AUDIO\]|\(music\)|\(silence\)/gi, '')
          .trim();

        if (cleaned.length >= 2) {
          isProcessingTurnRef.current = false;
          await respondToStudentInput(cleaned, runId);
        } else {
          isProcessingTurnRef.current = false;
        }
      } catch {
        if (sessionRunIdRef.current === runId) {
          setInterimUserText('');
        }
        isProcessingTurnRef.current = false;
      }
    },
    [respondToStudentInput],
  );

  const stopSession = useCallback(
    (preserveError = false) => {
      sessionRunIdRef.current += 1;
      stopTeacherSpeaking();
      isProcessingTurnRef.current = false;
      setIsThinking(false);
      utteranceChunksRef.current = [];
      speechStartedAtRef.current = 0;

      if (speechRecRef.current) {
        try {
          speechRecRef.current.abort();
        } catch {
          // Ignore
        }
        speechRecRef.current = null;
      }

      if (processorRef.current) {
        processorRef.current.onaudioprocess = null;
        try {
          processorRef.current.disconnect();
        } catch {
          // Ignore
        }
        processorRef.current = null;
      }

      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {
          // Ignore
        }
        sourceRef.current = null;
      }

      if (silentGainRef.current) {
        try {
          silentGainRef.current.disconnect();
        } catch {
          // Ignore
        }
        silentGainRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }

      if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
        audioCtxRef.current = null;
      }

      setMicLevel(0);
      setInterimUserText('');
      if (!preserveError) {
        setStatus('idle');
      }
    },
    [stopTeacherSpeaking],
  );

  const startBrowserOfflineSpeechLoop = useCallback(
    (runId: number) => {
      const Ctor = getBrowserSpeechRecognition();
      if (!Ctor) return;

      const launch = () => {
        if (sessionRunIdRef.current !== runId) return;
        if (isMutedRef.current || isTeacherSpeakingRef.current || isProcessingTurnRef.current) {
          window.setTimeout(launch, 450);
          return;
        }

        const rec = new Ctor();
        rec.lang = activeOptionsRef.current.liveRole === 'english' ? 'en-IN' : 'bn-IN';
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        let finalCaptured = '';

        rec.onresult = (ev) => {
          if (sessionRunIdRef.current !== runId) return;
          let interim = '';
          for (let i = ev.resultIndex; i < ev.results.length; i += 1) {
            const res = ev.results[i];
            const txt = res[0]?.transcript ?? '';
            if (res.isFinal) {
              finalCaptured += txt;
            } else {
              interim += txt;
            }
          }
          setInterimUserText(interim.trim());
        };

        rec.onerror = (ev) => {
          // If Chrome speech service requires network and user hasn't downloaded Whisper yet,
          // don't crash the session — they can still type, use camera, or download the Offline AI Pack
          if (ev.error === 'network') {
            speechRecRef.current = null;
            setInterimUserText('');
            return;
          }
        };

        rec.onend = () => {
          speechRecRef.current = null;
          setInterimUserText('');
          const spoken = finalCaptured.trim();
          if (spoken && sessionRunIdRef.current === runId) {
            void respondToStudentInput(spoken, runId).finally(() => {
              if (sessionRunIdRef.current === runId) {
                window.setTimeout(launch, 500);
              }
            });
          } else if (
            sessionRunIdRef.current === runId &&
            (!isOfflineAiPackInstalled() || !isOfflineFeatureAllowed('live'))
          ) {
            window.setTimeout(launch, 700);
          }
        };

        speechRecRef.current = rec;
        try {
          rec.start();
        } catch {
          speechRecRef.current = null;
        }
      };

      launch();
    },
    [respondToStudentInput],
  );

  const startSession = useCallback(
    async (options: {
      className: ClassLevel;
      voiceName: VoicePersona;
      liveRole: LiveRole;
      voiceOnly?: boolean;
      studentName?: string;
    }) => {
      stopSession();
      const runId = ++sessionRunIdRef.current;
      activeOptionsRef.current = options;
      setError(null);
      setTranscripts([]);
      setIsMuted(false);
      isMutedRef.current = false;
      setStatus('connecting');

      if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed('live')) {
        setStatus('idle');
        setError(
          'অনলি ক্লাস ৮ (১০০ MB) প্যাকে AI Live চালু নেই — এতে শুধু মেসেজ, ভয়েস ও PDF কাজ করে। লাইভ কথা বলতে ২৫০ MB বা ৫০০ MB প্যাক ডাউনলোড করো।',
        );
        return;
      }

      const hasAiPack = isOfflineAiPackInstalled() && isOfflineFeatureAllowed('live');

      try {
        if (navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1,
              },
            });

            if (sessionRunIdRef.current !== runId) {
              stream.getTracks().forEach((t) => t.stop());
              return;
            }

            mediaStreamRef.current = stream;
            const AudioCtx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            const ctx = new AudioCtx();
            audioCtxRef.current = ctx;
            if (ctx.state === 'suspended') {
              await ctx.resume().catch(() => {});
            }

            const source = ctx.createMediaStreamSource(stream);
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            const silentGain = ctx.createGain();
            silentGain.gain.value = 0;

            sourceRef.current = source;
            processorRef.current = processor;
            silentGainRef.current = silentGain;

            processor.onaudioprocess = (ev) => {
              if (sessionRunIdRef.current !== runId) return;
              const raw = ev.inputBuffer.getChannelData(0);

              if (isMutedRef.current || isTeacherSpeakingRef.current || isProcessingTurnRef.current) {
                setMicLevel(0);
                return;
              }

              let sumSq = 0;
              for (let i = 0; i < raw.length; i += 8) {
                sumSq += raw[i] * raw[i];
              }
              const rms = Math.sqrt(sumSq / Math.max(1, raw.length / 8));
              const nowMs = performance.now();

              if (nowMs - lastMicMeterAtRef.current >= 160) {
                lastMicMeterAtRef.current = nowMs;
                setMicLevel(Math.min(1, rms * 5.5));
              }

              // Automatic Voice Activity Detection (VAD) for Offline Whisper STT
              if (hasAiPack) {
                const VOICE_THRESHOLD = 0.018;
                const SILENCE_MS = 1350;
                const MAX_UTTERANCE_MS = 14000;

                if (rms >= VOICE_THRESHOLD) {
                  if (speechStartedAtRef.current === 0) {
                    speechStartedAtRef.current = nowMs;
                    setInterimUserText(
                      activeOptionsRef.current.liveRole === 'english'
                        ? 'Listening...'
                        : 'শুনছি...',
                    );
                  }
                  lastVoiceAtRef.current = nowMs;
                  utteranceChunksRef.current.push(downsampleTo16k(raw, ctx.sampleRate));
                } else if (speechStartedAtRef.current > 0) {
                  utteranceChunksRef.current.push(downsampleTo16k(raw, ctx.sampleRate));
                  const silentFor = nowMs - lastVoiceAtRef.current;
                  const totalDuration = nowMs - speechStartedAtRef.current;
                  if (silentFor >= SILENCE_MS || totalDuration >= MAX_UTTERANCE_MS) {
                    void flushRecordedUtterance(runId);
                  }
                }
              }
            };

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(ctx.destination);
          } catch {
            // Mic denied or unavailable — keep Offline Live Mode connected for text & camera!
            setError(
              options.liveRole === 'english'
                ? 'Microphone is unavailable. You can still type or snap a book photo in Offline Live Mode.'
                : 'মাইক্রোফোন পারমিশন পাওয়া যায়নি। তবে নিচে লিখে বা বইয়ের ছবি তুলে অফলাইন লাইভ টিচারের সাথে কথা বলতে পারবেন।',
            );
          }
        }

        if (sessionRunIdRef.current !== runId) return;
        setStatus('connected');

        if (!hasAiPack) {
          // Try device built-in offline speech recognition if available
          startBrowserOfflineSpeechLoop(runId);
        }

        const greetName = options.studentName?.trim() || '';
        const welcome =
          options.liveRole === 'english'
            ? hasAiPack
              ? `Hello${greetName ? ` ${greetName}` : ''}! Offline Live Teacher is ready for ${options.className}! Speak naturally or show a book photo — zero internet needed.`
              : `Hello${greetName ? ` ${greetName}` : ''}! Offline Live Teacher is connected for ${options.className}. Ask WBBSE notes, math sums, or download the 250 MB / 500 MB Offline AI Pack once for full AI voice conversations.`
            : hasAiPack
              ? `নমস্কার${greetName ? ` ${greetName}` : ''}! অফলাইন লাইভ টিচার তৈরি (${options.className})! ইন্টারনেট ছাড়াই সরাসরি কথা বলো বা বইয়ের ছবি দেখাও — আমি উত্তর দেব।`
              : `নমস্কার${greetName ? ` ${greetName}` : ''}! অফলাইন লাইভ টিচার চালু হয়েছে (${options.className})! এখনই অঙ্ক বা WBBSE নোটস জিজ্ঞেস করো, আর একদম অনলাইনের মতো অফলাইন লাইভ কথা বলার জন্য একবার Offline AI (250 MB / 500 MB) প্যাক ডাউনলোড করে নাও।`;

        appendTranscript('model', welcome);
        speakOfflineReply(welcome, runId);
      } catch (err) {
        if (sessionRunIdRef.current !== runId) return;
        setError(err instanceof Error ? err.message : 'Could not start Offline Live Mode.');
        setStatus('error');
      }
    },
    [
      appendTranscript,
      flushRecordedUtterance,
      speakOfflineReply,
      startBrowserOfflineSpeechLoop,
      stopSession,
    ],
  );

  const sendLiveText = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean || status !== 'connected') return;
      void respondToStudentInput(clean, sessionRunIdRef.current);
    },
    [respondToStudentInput, status],
  );

  const sendLiveImage = useCallback(
    (options: {
      base64: string;
      mimeType?: string;
      dataUrl: string;
      caption?: string;
    }) => {
      if (status !== 'connected') return;
      const runId = sessionRunIdRef.current;
      const caption = options.caption?.trim() || '';
      appendTranscript(
        'user',
        caption ||
          (activeOptionsRef.current.liveRole === 'english'
            ? 'Sent book photo (Offline OCR)'
            : 'বইয়ের ছবি পাঠানো হয়েছে (অফলাইন স্ক্যান)'),
        options.dataUrl,
      );

      setIsThinking(true);
      setInterimUserText(
        activeOptionsRef.current.liveRole === 'english'
          ? 'Reading book photo offline...'
          : 'অফলাইনে বইয়ের ছবি পড়া হচ্ছে...',
      );

      void extractTextFromImageOffline(options.dataUrl).then(async (extracted) => {
        if (sessionRunIdRef.current !== runId) return;
        setInterimUserText('');
        const combined = [caption, extracted].filter(Boolean).join('\n').trim();
        if (!combined) {
          const msg =
            activeOptionsRef.current.liveRole === 'english'
              ? 'Could not read clear text from that photo offline. Please try a brighter photo or type the question below.'
              : 'ছবি থেকে স্পষ্ট লেখা পড়া যায়নি। একটু পরিষ্কার আলোয় ছবি তুলুন অথবা প্রশ্নটি নিচে লিখে পাঠান।';
          appendTranscript('model', msg);
          setIsThinking(false);
          speakOfflineReply(msg, runId);
          return;
        }
        await respondToStudentInput(combined, runId, { skipAppendUser: true });
      });
    },
    [appendTranscript, respondToStudentInput, speakOfflineReply, status],
  );

  const sendLiveVideoFrame = useCallback(() => {
    // Live 1-FPS video stream is cloud-only; offline uses Snap & Send Book Photo OCR
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return {
    status,
    error,
    isMuted,
    isTeacherSpeaking,
    isThinking,
    micLevel,
    interimUserText,
    transcripts,
    startSession,
    stopSession,
    toggleMute,
    stopTeacherSpeaking,
    sendLiveText,
    sendLiveImage,
    sendLiveVideoFrame,
  };
}
