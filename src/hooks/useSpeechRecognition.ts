import { useCallback, useEffect, useRef, useState } from 'react';
import {
  decodeAudioBlobTo16kPcm,
  isOfflineAiPackInstalled,
  transcribeOfflineAudio,
} from '../offline/offlineAiEngine';

export type SpeechLang = 'bn-IN' | 'en-IN';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstanceLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstanceLike, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstanceLike, ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((this: SpeechRecognitionInstanceLike, ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: ((this: SpeechRecognitionInstanceLike, ev: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionInstanceLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructorLike | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

function canUseMediaRecorder(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

function pickSupportedAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return '';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read recorded audio.'));
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

function mapSpeechError(errorCode: string): string {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission was denied. Please enable microphone access in your browser settings.';
    case 'no-speech':
      return 'No speech was detected. Please try speaking again.';
    case 'audio-capture':
      return 'No microphone was found on this device.';
    case 'network':
      return 'Speech recognition requires an active internet connection.';
    case 'aborted':
      return '';
    default:
      return 'Voice input could not be completed. Please try again or type your text.';
  }
}

interface UseSpeechRecognitionOptions {
  defaultLang?: SpeechLang;
  continuous?: boolean;
  onFinalResult?: (transcript: string) => void;
}

export function useSpeechRecognition({
  defaultLang = 'bn-IN',
  continuous = false,
  onFinalResult,
}: UseSpeechRecognitionOptions = {}) {
  const [lang, setLang] = useState<SpeechLang>(defaultLang);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const maxDurationTimerRef = useRef<number | null>(null);
  const silenceMonitorCleanupRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);
  const transcribingRef = useRef(false);

  const recognitionRef = useRef<SpeechRecognitionInstanceLike | null>(null);
  const lastFallbackTextRef = useRef('');
  const onFinalResultRef = useRef(onFinalResult);
  onFinalResultRef.current = onFinalResult;

  const isSupported = canUseMediaRecorder() || Boolean(getSpeechRecognitionConstructor());

  const cleanupMediaResources = useCallback(() => {
    if (maxDurationTimerRef.current !== null) {
      window.clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
    if (silenceMonitorCleanupRef.current) {
      silenceMonitorCleanupRef.current();
      silenceMonitorCleanupRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        cleanupMediaResources();
        setIsListening(false);
      }
      return;
    }

    const instance = recognitionRef.current;
    if (instance) {
      try {
        instance.stop();
      } catch {
        // Ignore if already stopped
      }
    }
  }, [cleanupMediaResources]);

  const abortListening = useCallback(() => {
    cancelledRef.current = true;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        // Ignore
      }
    }
    cleanupMediaResources();

    const instance = recognitionRef.current;
    if (instance) {
      try {
        instance.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, [cleanupMediaResources]);

  const startWebSpeechFallback = useCallback(() => {
    const RecognitionCtor = getSpeechRecognitionConstructor();
    if (!RecognitionCtor) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setError(null);
    setInterimTranscript('');
    lastFallbackTextRef.current = '';

    const recognition = new RecognitionCtor();
    recognition.lang = lang;
    // Always false to prevent Android Chrome duplicate final-result bug
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalChunk += text;
        } else {
          interimChunk += text;
        }
      }

      setInterimTranscript(interimChunk.trim());

      const cleanedFinal = finalChunk.trim();
      if (cleanedFinal && cleanedFinal !== lastFallbackTextRef.current) {
        lastFallbackTextRef.current = cleanedFinal;
        setInterimTranscript('');
        onFinalResultRef.current?.(cleanedFinal);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      const friendly = mapSpeechError(event.error);
      if (friendly) {
        setError(friendly);
      }
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('Could not start microphone listening. Please try again.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [lang]);

  const startMediaRecorder = useCallback(async () => {
    if (transcribingRef.current) return;
    setError(null);
    setInterimTranscript('');
    cancelledRef.current = false;
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      if (cancelledRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      mediaStreamRef.current = stream;
      const mimeType = pickSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const recordedType = recorder.mimeType || mimeType || 'audio/webm';
        const chunks = [...audioChunksRef.current];
        audioChunksRef.current = [];
        cleanupMediaResources();
        setIsListening(false);

        if (cancelledRef.current) {
          setInterimTranscript('');
          return;
        }

        const blob = new Blob(chunks, { type: recordedType });
        if (blob.size < 400) {
          setInterimTranscript('');
          setError('No speech was detected. Please tap the mic and speak clearly.');
          return;
        }

        transcribingRef.current = true;
        setIsTranscribing(true);

        const tryOfflineWhisper = async (): Promise<boolean> => {
          if (!isOfflineAiPackInstalled()) return false;
          const pcm16k = await decodeAudioBlobTo16kPcm(blob);
          const whisperLang = lang === 'en-IN' ? 'english' : 'bengali';
          const offlineText = (await transcribeOfflineAudio(pcm16k, whisperLang))
            .replace(/\[BLANK_AUDIO\]|\(music\)|\(silence\)/gi, '')
            .trim();
          if (offlineText) {
            onFinalResultRef.current?.(offlineText);
            return true;
          }
          setError('কোনো কথা শোনা যায়নি। একটু জোরে ও স্পষ্ট করে আবার বলুন।');
          return true;
        };

        try {
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            const handled = await tryOfflineWhisper();
            if (!handled) {
              setError(
                'অফলাইনে ভয়েস টাইপিংয়ের জন্য একবার "Offline AI" প্যাক (100 MB / 250 MB / 500 MB) ডাউনলোড করুন, অথবা লিখে প্রশ্ন করুন।',
              );
            }
            return;
          }

          const audioBase64 = await blobToBase64(blob);
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64,
              mimeType: recordedType,
              lang,
            }),
          });

          const data = (await response.json()) as {
            transcript?: string;
            error?: string;
          };

          if (!response.ok) {
            throw new Error(data.error || 'Could not transcribe voice input.');
          }

          const cleanText = (data.transcript ?? '').trim();
          if (!cleanText) {
            setError('No speech was detected. Please speak a bit louder and try again.');
          } else {
            onFinalResultRef.current?.(cleanText);
          }
        } catch (err) {
          try {
            const handled = await tryOfflineWhisper();
            if (handled) return;
          } catch {
            // Fall through to error message
          }
          setError(
            err instanceof Error
              ? err.message
              : 'Voice transcription failed. Please try again.',
          );
        } finally {
          transcribingRef.current = false;
          setIsTranscribing(false);
          setInterimTranscript('');
        }
      };

      // In single-word Dictionary mode, auto-stop cleanly after 1.5s silence once speech starts
      if (!continuous && typeof AudioContext !== 'undefined') {
        try {
          const ctx = new AudioContext();
          const src = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 1024;
          src.connect(analyser);
          const dataArray = new Uint8Array(analyser.fftSize);
          let heardSpeech = false;
          let silentSince = performance.now();

          const intervalId = window.setInterval(() => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
              return;
            }
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i += 4) {
              const v = (dataArray[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / (dataArray.length / 4));
            if (rms > 0.025) {
              heardSpeech = true;
              silentSince = performance.now();
            } else if (heardSpeech && performance.now() - silentSince > 1500) {
              stopListening();
            }
          }, 150);

          silenceMonitorCleanupRef.current = () => {
            window.clearInterval(intervalId);
            try {
              src.disconnect();
            } catch {
              // Ignore
            }
            if (ctx.state !== 'closed') {
              ctx.close().catch(() => {});
            }
          };
        } catch {
          // Proceed without silence auto-stop
        }
      }

      recorder.start(250);
      setIsListening(true);

      maxDurationTimerRef.current = window.setTimeout(
        () => {
          stopListening();
        },
        continuous ? 45000 : 12000,
      );
    } catch (err) {
      cleanupMediaResources();
      setIsListening(false);
      setIsTranscribing(false);
      setInterimTranscript('');
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError(
          'Microphone permission was denied. Please enable microphone access in your browser settings.',
        );
      } else {
        startWebSpeechFallback();
      }
    }
  }, [cleanupMediaResources, continuous, lang, startWebSpeechFallback, stopListening]);

  const startListening = useCallback(() => {
    if (canUseMediaRecorder()) {
      startMediaRecorder();
    } else {
      startWebSpeechFallback();
    }
  }, [startMediaRecorder, startWebSpeechFallback]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      abortListening();
    };
  }, [abortListening]);

  return {
    isSupported,
    isListening,
    isTranscribing,
    interimTranscript,
    lang,
    setLang,
    error,
    clearError: () => setError(null),
    startListening,
    stopListening,
    toggleListening,
  };
}
