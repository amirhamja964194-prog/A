import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClassLevel, VoicePersona } from '../types';

export type LiveRole = 'english' | 'bengali' | 'bilingual';
export type LiveConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

export interface LiveTranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageDataUrl?: string;
}

function downsampleBuffer(
  buffer: Float32Array,
  inputSampleRate: number,
  targetSampleRate: number,
): Float32Array {
  if (inputSampleRate === targetSampleRate) {
    return buffer;
  }
  const ratio = inputSampleRate / targetSampleRate;
  const newLength = Math.max(1, Math.round(buffer.length / ratio));
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.min(
      buffer.length,
      Math.round((offsetResult + 1) * ratio),
    );
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer; i += 1) {
      accum += buffer[i];
      count += 1;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult += 1;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function floatTo16BitPcmBase64(samples: Float32Array): string {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    view.setInt16(i * 2, int16, true);
  }
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64PcmToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const sampleCount = Math.floor(bytes.byteLength / 2);
  const out = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i += 1) {
    out[i] = view.getInt16(i * 2, true) / 32768;
  }
  return out;
}

function createAudioContext(
  preferredSampleRate: number,
  latencyHint: AudioContextLatencyCategory,
): AudioContext {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  try {
    return new AudioCtx({ sampleRate: preferredSampleRate, latencyHint });
  } catch {
    try {
      return new AudioCtx({ latencyHint });
    } catch {
      return new AudioCtx();
    }
  }
}

export function useLiveTeacher() {
  const [status, setStatus] = useState<LiveConnectionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [interimUserText, setInterimUserText] = useState('');
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);

  const sessionRunIdRef = useRef(0);
  const manualStopRef = useRef(false);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;
  const hadErrorRef = useRef(false);
  const isTeacherSpeakingRef = useRef(false);
  const teacherSpeakEndTimeRef = useRef(0);
  const activeTurnRoleRef = useRef<'user' | 'model' | null>(null);
  const lastMicMeterTimeRef = useRef(0);
  const lastMicMeterValRef = useRef(0);
  const zeroPcmBase64Ref = useRef<string | null>(null);

  const nextPlayTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const clearAudioPlayback = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore already stopped source
      }
    }
    activeSourcesRef.current.clear();
    if (outputAudioCtxRef.current) {
      nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
    } else {
      nextPlayTimeRef.current = 0;
    }
    isTeacherSpeakingRef.current = false;
    setIsTeacherSpeaking(false);
  }, []);

  const stopSession = useCallback((preserveError = false) => {
    manualStopRef.current = true;
    sessionRunIdRef.current += 1;
    clearAudioPlayback();

    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
      try {
        processorRef.current.disconnect();
      } catch {
        // Ignore
      }
      processorRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // Ignore
      }
      sourceNodeRef.current = null;
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

    if (inputAudioCtxRef.current) {
      if (inputAudioCtxRef.current.state !== 'closed') {
        inputAudioCtxRef.current.close().catch(() => {});
      }
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      if (outputAudioCtxRef.current.state !== 'closed') {
        outputAudioCtxRef.current.close().catch(() => {});
      }
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        try {
          ws.close();
        } catch {
          // Ignore
        }
      }
    }

    setMicLevel(0);
    setInterimUserText('');
    setIsTeacherSpeaking(false);
    if (!preserveError) {
      setStatus('idle');
    }
  }, [clearAudioPlayback]);

  const schedulePcmAudio = useCallback((base64Data: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx || ctx.state === 'closed') return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const float32 = base64PcmToFloat32(base64Data);
      if (float32.length === 0) return;

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const src = ctx.createBufferSource();
      src.buffer = audioBuffer;
      src.connect(ctx.destination);

      const now = ctx.currentTime;
      const startTime =
        nextPlayTimeRef.current <= now + 0.005
          ? now + 0.09
          : nextPlayTimeRef.current;
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.add(src);
      if (!isTeacherSpeakingRef.current) {
        isTeacherSpeakingRef.current = true;
        setIsTeacherSpeaking(true);
      }

      src.onended = () => {
        activeSourcesRef.current.delete(src);
        if (activeSourcesRef.current.size === 0) {
          isTeacherSpeakingRef.current = false;
          teacherSpeakEndTimeRef.current = performance.now();
          setIsTeacherSpeaking(false);
        }
      };

      src.start(startTime);
    } catch {
      // Ignore malformed audio chunk or closing AudioContext
    }
  }, []);

  const appendTranscript = useCallback(
    (role: 'user' | 'model', text: string, imageDataUrl?: string) => {
      const cleaned = text.trim();
      if (!cleaned && !imageDataUrl) return;

      const sameActiveTurn = !imageDataUrl && activeTurnRoleRef.current === role;
      activeTurnRoleRef.current = imageDataUrl ? null : role;

      setTranscripts((prev) => {
        const last = prev[prev.length - 1];
        if (sameActiveTurn && last && last.role === role && !last.imageDataUrl) {
          if (last.text === cleaned || last.text.endsWith(cleaned)) {
            return prev;
          }
          if (cleaned.startsWith(last.text)) {
            return [...prev.slice(0, -1), { ...last, text: cleaned }];
          }
          const needsSpace =
            !/\s$/.test(last.text) && !/^[.,!?।]/.test(cleaned);
          const merged = `${last.text}${needsSpace ? ' ' : ''}${cleaned}`;
          return [...prev.slice(0, -1), { ...last, text: merged }];
        }
        return [
          ...prev,
          {
            id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            role,
            text: cleaned,
            imageDataUrl,
          },
        ];
      });
    },
    [],
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
      manualStopRef.current = false;
      hadErrorRef.current = false;
      setError(null);
      setTranscripts([]);
      setIsMuted(false);
      isMutedRef.current = false;
      setStatus('connecting');

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Microphone capture is unavailable in this browser.');
        }

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

        const inputCtx = createAudioContext(16000, 'interactive');
        const outputCtx = createAudioContext(24000, 'playback');
        inputAudioCtxRef.current = inputCtx;
        outputAudioCtxRef.current = outputCtx;
        nextPlayTimeRef.current = outputCtx.currentTime;

        await Promise.all([
          inputCtx.state === 'suspended' ? inputCtx.resume().catch(() => {}) : Promise.resolve(),
          outputCtx.state === 'suspended' ? outputCtx.resume().catch(() => {}) : Promise.resolve(),
        ]);

        if (sessionRunIdRef.current !== runId) {
          stream.getTracks().forEach((t) => t.stop());
          if (inputCtx.state !== 'closed') inputCtx.close().catch(() => {});
          if (outputCtx.state !== 'closed') outputCtx.close().catch(() => {});
          return;
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const query = new URLSearchParams({
          className: options.className,
          voiceName: options.voiceName,
          liveRole: options.liveRole,
          voiceOnly: options.voiceOnly ? '1' : '0',
          ...(options.studentName?.trim() ? { studentName: options.studentName.trim() } : {}),
        });
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/live?${query.toString()}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (sessionRunIdRef.current !== runId || wsRef.current !== ws) {
            try {
              ws.close();
            } catch {
              // Ignore
            }
            return;
          }

          try {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            const silentGain = inputCtx.createGain();
            silentGain.gain.value = 0;

            sourceNodeRef.current = source;
            processorRef.current = processor;
            silentGainRef.current = silentGain;

            processor.onaudioprocess = (event) => {
              if (
                sessionRunIdRef.current !== runId ||
                wsRef.current !== ws ||
                ws.readyState !== WebSocket.OPEN
              ) {
                return;
              }
              const rawChannel = event.inputBuffer.getChannelData(0);

              if (isMutedRef.current) {
                if (lastMicMeterValRef.current !== 0) {
                  lastMicMeterValRef.current = 0;
                  setMicLevel(0);
                }
                return;
              }

              let sumSq = 0;
              for (let i = 0; i < rawChannel.length; i += 8) {
                sumSq += rawChannel[i] * rawChannel[i];
              }
              const rms = Math.sqrt(sumSq / Math.max(1, rawChannel.length / 8));
              const nextLevel = Math.min(1, rms * 5);
              const nowMs = performance.now();
              if (
                nowMs - lastMicMeterTimeRef.current >= 90 &&
                Math.abs(nextLevel - lastMicMeterValRef.current) > 0.03
              ) {
                lastMicMeterTimeRef.current = nowMs;
                lastMicMeterValRef.current = nextLevel;
                setMicLevel(nextLevel);
              }

              // Skip sending mic audio if socket buffer is backed up on slow mobile network
              if (ws.bufferedAmount > 256000) {
                return;
              }

              const downsampled = downsampleBuffer(
                rawChannel,
                inputCtx.sampleRate,
                16000,
              );

              // Suppress speaker echo while teacher is speaking AND for 750ms tail afterward,
              // plus suppress silent ambient room noise (< 0.012 RMS) so server VAD never hallucinates foreign text.
              const inEchoWindow =
                isTeacherSpeakingRef.current ||
                nowMs - teacherSpeakEndTimeRef.current < 750;
              const shouldGate = inEchoWindow ? rms < 0.15 : rms < 0.012;

              let pcmBase64: string;
              if (shouldGate) {
                if (!zeroPcmBase64Ref.current || zeroPcmBase64Ref.current.length === 0) {
                  zeroPcmBase64Ref.current = floatTo16BitPcmBase64(new Float32Array(downsampled.length));
                }
                pcmBase64 =
                  zeroPcmBase64Ref.current.length === Math.ceil((downsampled.length * 2) / 3) * 4
                    ? zeroPcmBase64Ref.current
                    : floatTo16BitPcmBase64(new Float32Array(downsampled.length));
              } else {
                pcmBase64 = floatTo16BitPcmBase64(downsampled);
              }

              try {
                ws.send(JSON.stringify({ type: 'audio', data: pcmBase64 }));
              } catch {
                // Ignore send error if socket closed mid-frame
              }
            };

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(inputCtx.destination);
          } catch (audioErr) {
            hadErrorRef.current = true;
            setError(
              audioErr instanceof Error
                ? audioErr.message
                : 'Could not initialize microphone audio stream.',
            );
            setStatus('error');
          }
        };

        ws.onmessage = (event) => {
          if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
          let msg: {
            type?: string;
            data?: string;
            text?: string;
            error?: string;
          };
          try {
            msg = JSON.parse(event.data);
          } catch {
            return;
          }

          switch (msg.type) {
            case 'ready':
              activeTurnRoleRef.current = null;
              setStatus('connected');
              break;
            case 'audio':
              if (msg.data) {
                schedulePcmAudio(msg.data);
              }
              break;
            case 'interrupted':
              activeTurnRoleRef.current = null;
              clearAudioPlayback();
              break;
            case 'turnComplete':
              activeTurnRoleRef.current = null;
              break;
            case 'interimInput':
              setInterimUserText(msg.text ?? '');
              break;
            case 'inputTranscript':
              setInterimUserText('');
              if (msg.text) {
                appendTranscript('user', msg.text);
              }
              break;
            case 'outputTranscript':
              if (msg.text) {
                appendTranscript('model', msg.text);
              }
              break;
            case 'error':
              hadErrorRef.current = true;
              setError(msg.error || 'Live voice connection failed.');
              setStatus('error');
              break;
            case 'closed':
              if (!manualStopRef.current && !hadErrorRef.current) {
                hadErrorRef.current = true;
                setError('Live session disconnected. Tap Retry to reconnect.');
                setStatus('error');
              }
              stopSession(hadErrorRef.current);
              break;
            default:
              break;
          }
        };

        ws.onerror = () => {
          if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
          hadErrorRef.current = true;
          setError('Could not connect to Live Voice Mode. Please check your connection.');
          setStatus('error');
        };

        ws.onclose = () => {
          if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
          if (!manualStopRef.current && !hadErrorRef.current) {
            hadErrorRef.current = true;
            setError('Live connection was interrupted. Tap Retry to reconnect.');
            setStatus('error');
          }
          stopSession(hadErrorRef.current);
        };
      } catch (err) {
        if (sessionRunIdRef.current !== runId) return;
        const message =
          err instanceof Error && err.name === 'NotAllowedError'
            ? 'Microphone permission was denied. Please allow microphone access to use Live Mode.'
            : err instanceof Error
              ? err.message
              : 'Could not start Live Mode.';
        hadErrorRef.current = true;
        stopSession(true);
        setError(message);
        setStatus('error');
      }
    },
    [appendTranscript, clearAudioPlayback, schedulePcmAudio, stopSession],
  );

  const sendLiveText = useCallback(
    (text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      appendTranscript('user', cleaned);
      ws.send(JSON.stringify({ type: 'text', text: cleaned }));
    },
    [appendTranscript],
  );

  const sendLiveImage = useCallback(
    (options: {
      base64: string;
      mimeType?: string;
      dataUrl: string;
      caption?: string;
    }) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const caption = options.caption?.trim() || '';
      appendTranscript(
        'user',
        caption || 'Sent book photo',
        options.dataUrl,
      );
      ws.send(
        JSON.stringify({
          type: 'image',
          data: options.base64,
          mimeType: options.mimeType || 'image/jpeg',
          text: caption,
        }),
      );
    },
    [appendTranscript],
  );

  const sendLiveVideoFrame = useCallback(
    (base64: string, mimeType = 'image/jpeg') => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN || !base64) return;
      ws.send(
        JSON.stringify({
          type: 'video',
          data: base64,
          mimeType,
        }),
      );
    },
    [],
  );

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
    micLevel,
    interimUserText,
    transcripts,
    startSession,
    stopSession,
    toggleMute,
    stopTeacherSpeaking: clearAudioPlayback,
    sendLiveText,
    sendLiveImage,
    sendLiveVideoFrame,
  };
}
