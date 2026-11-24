import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Send,
  Volume2,
  X,
  AlertCircle,
  Loader2,
  Camera,
  RefreshCw,
  ImagePlus,
  Video,
  VideoOff,
  Square,
  Cpu,
  Download,
  MessageSquareText,
  AudioLines,
} from 'lucide-react';
import type { ClassLevel, LiveRole, VoicePersona } from '../types';
import {
  useLiveTeacher,
  type LiveTranscriptItem,
} from '../hooks/useLiveTeacher';
import { useOfflineLiveTeacher } from '../hooks/useOfflineLiveTeacher';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  getOfflineAiState,
  subscribeOfflineAiState,
} from '../offline/offlineAiEngine';

export type LiveInteractionMode = 'voice' | 'text';

interface LiveTeacherModalProps {
  isOpen: boolean;
  onClose: (transcripts: LiveTranscriptItem[]) => void;
  classNameLevel: ClassLevel;
  voice: VoicePersona;
  onVoiceChange: (voice: VoicePersona) => void;
  defaultLiveRole?: LiveRole;
  initialInteractionMode?: LiveInteractionMode;
  enableCamera?: boolean;
  studentName?: string;
  onOpenOfflineAiPack?: () => void;
}

const LIVE_VOICES: Array<{ value: VoicePersona; label: string }> = [
  { value: 'Zephyr', label: 'Zephyr (Calm)' },
  { value: 'Kore', label: 'Kore (Warm)' },
  { value: 'Puck', label: 'Puck (Bright)' },
  { value: 'Charon', label: 'Charon (Deep)' },
];

const WAVE_BAR_HEIGHTS = [24, 38, 52, 62, 52, 38, 24];

export function LiveTeacherModal({
  isOpen,
  onClose,
  classNameLevel,
  voice,
  onVoiceChange,
  defaultLiveRole = 'bengali',
  initialInteractionMode = 'voice',
  enableCamera = true,
  studentName = '',
  onOpenOfflineAiPack,
}: LiveTeacherModalProps) {
  const isOnline = useOnlineStatus();
  const [interactionMode, setInteractionMode] =
    useState<LiveInteractionMode>(initialInteractionMode);
  const [preferOfflineEngine, setPreferOfflineEngine] = useState(false);
  const [offlinePackSupportsLive, setOfflinePackSupportsLive] = useState(() => {
    const tier = getOfflineAiState().installedTier;
    return tier === 'standard' || tier === 'pro';
  });
  const [liveRole, setLiveRole] = useState<LiveRole>(defaultLiveRole);
  const [quickMessage, setQuickMessage] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLiveVideoOn, setIsLiveVideoOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraResolution, setCameraResolution] = useState<string | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return subscribeOfflineAiState((s) => {
      setOfflinePackSupportsLive(s.installedTier === 'standard' || s.installedTier === 'pro');
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setInteractionMode(initialInteractionMode);
    }
  }, [isOpen, initialInteractionMode]);

  const useOfflineMode = !isOnline || preferOfflineEngine;
  const isVoiceOnly = interactionMode === 'voice';

  const onlineLive = useLiveTeacher();
  const offlineLive = useOfflineLiveTeacher();

  const activeLive = useOfflineMode ? offlineLive : onlineLive;
  const {
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
    stopTeacherSpeaking,
    sendLiveText,
    sendLiveImage,
    sendLiveVideoFrame,
  } = activeLive;
  const isOfflineThinking = useOfflineMode ? offlineLive.isThinking : false;

  const stopCameraStream = useCallback(() => {
    setIsLiveVideoOn(false);
    setCameraResolution(null);
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setLiveRole(defaultLiveRole);
      setPreferOfflineEngine(false);
    }
  }, [defaultLiveRole, isOpen]);

  useEffect(() => {
    if (!enableCamera) {
      stopCameraStream();
      setIsCameraOpen(false);
    }
  }, [enableCamera, stopCameraStream]);

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setIsCameraOpen(false);
      onlineLive.stopSession();
      offlineLive.stopSession();
      return;
    }
    if (useOfflineMode) {
      onlineLive.stopSession();
      offlineLive.startSession({
        className: classNameLevel,
        voiceName: voice,
        liveRole,
        voiceOnly: isVoiceOnly,
        studentName: studentName.trim() || undefined,
      });
    } else {
      offlineLive.stopSession();
      onlineLive.startSession({
        className: classNameLevel,
        voiceName: voice,
        liveRole,
        voiceOnly: isVoiceOnly,
        studentName: studentName.trim() || undefined,
      });
    }
    return () => {
      stopCameraStream();
      onlineLive.stopSession();
      offlineLive.stopSession();
    };
  }, [
    isOpen,
    useOfflineMode,
    isVoiceOnly,
    classNameLevel,
    voice,
    liveRole,
    studentName,
    onlineLive.startSession,
    onlineLive.stopSession,
    offlineLive.startSession,
    offlineLive.stopSession,
    stopCameraStream,
  ]);

  useEffect(() => {
    if (!isOpen || !isCameraOpen) {
      stopCameraStream();
      return;
    }

    let cancelled = false;

    async function startCamera() {
      setIsStartingCamera(true);
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Live camera is unavailable here. Use the Photo button to take or upload a book photo.',
        );
        setIsStartingCamera(false);
        return;
      }

      try {
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack && typeof videoTrack.applyConstraints === 'function') {
          const caps =
            typeof videoTrack.getCapabilities === 'function'
              ? (videoTrack.getCapabilities() as { focusMode?: string[] })
              : null;
          if (caps?.focusMode?.includes('continuous')) {
            videoTrack
              .applyConstraints({
                advanced: [{ focusMode: 'continuous' } as unknown as MediaTrackConstraintSet],
              })
              .catch(() => {});
          }
        }

        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (!cancelled) {
          setCameraError(
            'Camera permission was denied or unavailable. You can still upload or snap a book photo using the Photo button.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsStartingCamera(false);
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCameraStream();
    };
  }, [isOpen, isCameraOpen, facingMode, stopCameraStream]);

  const captureVideoFrame = useCallback((maxDim: number, quality: number) => {
    try {
      const video = videoRef.current;
      if (!video || !video.videoWidth || !video.videoHeight) return null;

      const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
      const width = Math.max(1, Math.round(video.videoWidth * scale));
      const height = Math.max(1, Math.round(video.videoHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64 = dataUrl.split(',')[1] || '';
      if (!base64) return null;

      return { dataUrl, base64, mimeType: 'image/jpeg' };
    } catch {
      return null;
    }
  }, []);

  // Optional 1-FPS HD live video stream while Live Video mode is enabled
  useEffect(() => {
    if (!isOpen || !isCameraOpen || !isLiveVideoOn || status !== 'connected' || cameraError) {
      return;
    }

    const sendFrame = () => {
      const frame = captureVideoFrame(1024, 0.8);
      if (frame) {
        sendLiveVideoFrame(frame.base64, frame.mimeType);
      }
    };

    sendFrame();
    const timer = window.setInterval(sendFrame, 1000);
    return () => window.clearInterval(timer);
  }, [
    isOpen,
    isCameraOpen,
    isLiveVideoOn,
    status,
    cameraError,
    captureVideoFrame,
    sendLiveVideoFrame,
  ]);

  useEffect(() => {
    if (!isVoiceOnly) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [transcripts, interimUserText, isVoiceOnly]);

  if (!isOpen) return null;

  const handleEnd = () => {
    const snapshot = isVoiceOnly ? [] : [...transcripts];
    stopCameraStream();
    setIsCameraOpen(false);
    stopSession();
    onClose(snapshot);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim() || status !== 'connected') return;
    sendLiveText(quickMessage);
    setQuickMessage('');
  };

  const handleCaptureAndSend = () => {
    if (status !== 'connected') return;
    const frame = captureVideoFrame(1920, 0.92);
    if (!frame) return;
    sendLiveImage({
      base64: frame.base64,
      mimeType: frame.mimeType,
      dataUrl: frame.dataUrl,
      caption: isVoiceOnly ? '' : quickMessage,
    });
    setQuickMessage('');
    if (!isLiveVideoOn) {
      setIsCameraOpen(false);
    }
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || status !== 'connected') return;

    let bitmapUrl: string | null = null;
    try {
      bitmapUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = bitmapUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not read image'));
      });

      const maxDim = 1920;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const base64 = dataUrl.split(',')[1] || '';
      if (!base64) return;

      sendLiveImage({
        base64,
        mimeType: 'image/jpeg',
        dataUrl,
        caption: isVoiceOnly ? '' : quickMessage,
      });
      setQuickMessage('');
      setCameraError(null);
      setIsCameraOpen(false);
    } catch {
      setCameraError('Could not read that image file. Please try another JPG or PNG photo.');
      setIsCameraOpen(true);
    } finally {
      if (bitmapUrl) {
        URL.revokeObjectURL(bitmapUrl);
      }
    }
  };

  const voiceOrbScale = isMuted
    ? 0.94
    : isTeacherSpeaking
      ? 1.07
      : 1 + Math.min(0.16, micLevel * 0.18);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 dark:bg-black/82 backdrop-blur-md p-2.5 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Live Voice Teacher"
    >
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[95vh] rounded-3xl bg-white dark:bg-[#090b17] border border-slate-200 dark:border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col">
        {/* Subtle Internal Neon Glows */}
        <div
          className="pointer-events-none hidden dark:block absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-35 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff2a54, #7c3aed)' }}
        />
        <div
          className="pointer-events-none hidden dark:block absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-35 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, #6366f1)' }}
        />

        {/* Header */}
        <div className="relative z-10 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1f]/90 backdrop-blur-xl flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                status === 'connected'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : status === 'error'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border border-fuchsia-500/30'
              }`}
            >
              {status === 'connecting' || isOfflineThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : useOfflineMode ? (
                <Cpu className="w-4 h-4" />
              ) : isVoiceOnly ? (
                <AudioLines className="w-4 h-4" />
              ) : (
                <Radio className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {isVoiceOnly
                    ? useOfflineMode
                      ? 'AI Live (Offline Direct Voice)'
                      : 'AI Live — সরাসরি কথা'
                    : useOfflineMode
                      ? 'Text Live (Offline)'
                      : 'Text Live — টেক্সট ও ভয়েস'}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                    useOfflineMode
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {useOfflineMode
                    ? offlinePackSupportsLive
                      ? 'OFFLINE AI'
                      : 'OFFLINE'
                    : 'LIVE'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {status === 'connecting'
                  ? useOfflineMode
                    ? 'অফলাইন লাইভ টিচার চালু হচ্ছে...'
                    : 'লাইভ ভয়েস সংযোগ হচ্ছে...'
                  : isOfflineThinking
                    ? 'অফলাইন AI উত্তর তৈরি করছে...'
                    : status === 'connected'
                      ? isTeacherSpeaking
                        ? 'AI টিচার সরাসরি বলছেন...'
                        : isMuted
                          ? 'মাইক্রোফোন মিউট করা আছে'
                          : isVoiceOnly
                            ? 'কোনো লেখালেখি নেই — সরাসরি কথা বলুন'
                            : 'কথা বলুন অথবা নিচে লিখে পাঠান'
                      : status === 'error'
                        ? 'সংযোগে সমস্যা হয়েছে'
                        : 'প্রস্তুত'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isOnline && (
              <button
                type="button"
                onClick={() => setPreferOfflineEngine((prev) => !prev)}
                title={
                  useOfflineMode
                    ? 'Switch back to Online Cloud Live'
                    : 'Switch to Offline On-Device Live Teacher'
                }
                className={`min-h-[34px] px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  useOfflineMode
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-800 dark:text-amber-200'
                    : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                {useOfflineMode ? 'Online Live' : 'Offline Live'}
              </button>
            )}
            <button
              type="button"
              onClick={handleEnd}
              aria-label="Close Live Mode"
              className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two-Mode Switcher + Language & Voice Controls */}
        <div className="relative z-10 px-4 sm:px-5 py-2.5 bg-slate-50/90 dark:bg-[#0e1124]/90 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          {/* AI Live vs Text Live Mode Switcher */}
          <div
            className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/8 border border-slate-200/80 dark:border-white/10"
            role="tablist"
            aria-label="Live interaction mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isVoiceOnly}
              onClick={() => setInteractionMode('voice')}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isVoiceOnly
                  ? 'wbsec-btn-neon-voice text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AudioLines className="w-3.5 h-3.5" />
              AI Live (সরাসরি কথা)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isVoiceOnly}
              onClick={() => setInteractionMode('text')}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${
                !isVoiceOnly
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.45)]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              Text Live
            </button>
          </div>

          {/* Language & Voice */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center p-0.5 rounded-xl bg-slate-200/80 dark:bg-white/8 border border-slate-200/70 dark:border-white/10"
              role="group"
              aria-label="Live teacher language"
            >
              <button
                type="button"
                onClick={() => setLiveRole('bengali')}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  liveRole === 'bengali'
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLiveRole('english')}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  liveRole === 'english'
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLiveRole('bilingual')}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  liveRole === 'bilingual'
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN + বাংলা
              </button>
            </div>

            <select
              value={voice}
              onChange={(e) => onVoiceChange(e.target.value as VoicePersona)}
              aria-label="Live teacher voice"
              className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white dark:bg-[#13172e] border border-slate-200 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {LIVE_VOICES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Live Content Area */}
        {isVoiceOnly ? (
          /* ================= AI LIVE MODE (PURE DIRECT VOICE — NO TEXT / NO WRITING) ================= */
          <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center justify-center text-center gap-5 min-h-[240px]">
            {useOfflineMode && !offlinePackSupportsLive && (
              <div className="w-full max-w-lg rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200">
                <span className="text-left">
                  অফলাইনে পূর্ণ AI Live পেতে <strong>250 MB (Fast)</strong> বা <strong>500 MB (Pro)</strong> প্যাক ডাউনলোড করুন।
                </span>
                {onOpenOfflineAiPack && (
                  <button
                    type="button"
                    onClick={() => {
                      handleEnd();
                      onOpenOfflineAiPack();
                    }}
                    className="min-h-[30px] px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    ডাউনলোড
                  </button>
                )}
              </div>
            )}

            {error && (
              <div
                className="w-full max-w-lg rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 px-4 py-3 text-xs sm:text-sm text-rose-700 dark:text-rose-200 flex items-center justify-between gap-3 text-left"
                role="alert"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    startSession({
                      className: classNameLevel,
                      voiceName: voice,
                      liveRole,
                      voiceOnly: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Giant Reactive Holographic AI Voice Orb */}
            <div className="wbsec-live-orb-shell my-1">
              {status === 'connected' && !isMuted && (
                <>
                  <span className="wbsec-live-ring" aria-hidden="true" />
                  <span className="wbsec-live-ring wbsec-live-ring-2" aria-hidden="true" />
                </>
              )}
              <div
                className={`wbsec-live-orb ${
                  isTeacherSpeaking ? 'is-speaking' : ''
                } ${isMuted ? 'is-muted' : ''}`}
                style={{
                  transform: `scale(${voiceOrbScale.toFixed(3)})`,
                }}
                aria-hidden="true"
              />
            </div>

            {/* Live Equalizer Bars when Teacher Speaks or Student Talks */}
            <div className="h-11 flex items-center justify-center gap-1.5" aria-hidden="true">
              {WAVE_BAR_HEIGHTS.map((maxH, idx) => {
                const active =
                  status === 'connected' &&
                  !isMuted &&
                  (isTeacherSpeaking || isOfflineThinking || micLevel > 0.08);
                return (
                  <span
                    key={idx}
                    className="wbsec-wave-bar"
                    style={{
                      height: `${active ? maxH : 12}px`,
                      opacity: active ? 0.95 : 0.25,
                      animationDelay: `${idx * 0.11}s`,
                      animationPlayState: active ? 'running' : 'paused',
                    }}
                  />
                );
              })}
            </div>

            {/* Clean Direct Voice Status */}
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {status === 'connecting'
                  ? 'AI টিচারের সাথে সংযোগ হচ্ছে...'
                  : isOfflineThinking
                    ? 'AI টিচার ভাবছেন...'
                    : isTeacherSpeaking
                      ? 'AI টিচার কথা বলছেন...'
                      : isMuted
                        ? 'মাইক মিউট করা আছে'
                        : status === 'connected'
                          ? liveRole === 'english'
                            ? 'Listening — Speak directly in English'
                            : liveRole === 'bilingual'
                              ? 'শুনছি — বাংলা বা ইংরেজিতে সরাসরি কথা বলুন'
                              : 'শুনছি — সরাসরি বাংলায় কথা বলুন'
                          : 'লাইভ কল প্রস্তুত'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {liveRole === 'english'
                  ? 'Direct voice-to-voice conversation • No typing needed'
                  : 'কোনো লেখালেখি নেই • সরাসরি ফোনের মতো কথা বলুন (শুধু বিশুদ্ধ বাংলায় উত্তর পাবেন)'}
              </p>
            </div>

            {/* Quick Voice Action Pills (Stop Voice / Reconnect) */}
            <div className="flex items-center justify-center gap-2.5 min-h-[40px]">
              {status === 'connected' && isTeacherSpeaking && (
                <button
                  type="button"
                  onClick={stopTeacherSpeaking}
                  className="min-h-[40px] px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-[0_0_24px_rgba(244,63,94,0.55)] active:scale-95 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  কথা থামান (Stop Voice)
                </button>
              )}
              {status === 'idle' && (
                <button
                  type="button"
                  onClick={() =>
                    startSession({
                      className: classNameLevel,
                      voiceName: voice,
                      liveRole,
                      voiceOnly: true,
                    })
                  }
                  className="min-h-[42px] px-5 py-2 rounded-full wbsec-btn-neon-voice text-sm font-bold"
                >
                  আবার সংযোগ করুন (Reconnect)
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ================= TEXT LIVE MODE (LIVE TRANSCRIPTS + TEXT + VOICE) ================= */
          <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-7 py-5 space-y-4 min-h-[140px]">
            {useOfflineMode && !offlinePackSupportsLive && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs text-amber-950 dark:text-amber-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    অফলাইনে পূর্ণ AI লাইভ পেতে <strong>250 MB ফাস্ট</strong> বা <strong>500 MB প্রো</strong> প্যাক ডাউনলোড করুন।
                  </span>
                </div>
                {onOpenOfflineAiPack && (
                  <button
                    type="button"
                    onClick={() => {
                      handleEnd();
                      onOpenOfflineAiPack();
                    }}
                    className="min-h-[32px] px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Offline AI প্যাক
                  </button>
                )}
              </div>
            )}

            {/* Compact Audio Activity Indicator */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/12 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
                    isTeacherSpeaking
                      ? 'bg-fuchsia-600 text-white scale-105 shadow-[0_0_18px_rgba(217,70,239,0.6)]'
                      : isOfflineThinking
                        ? 'bg-amber-500 text-white'
                        : status === 'connected' && !isMuted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  style={{
                    boxShadow:
                      status === 'connected' && !isMuted && !isTeacherSpeaking && !isOfflineThinking
                        ? `0 0 0 ${Math.round(micLevel * 12)}px rgba(16, 185, 129, 0.28)`
                        : undefined,
                  }}
                >
                  {isOfflineThinking ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isTeacherSpeaking ? (
                    <Volume2 className="w-5 h-5" />
                  ) : isMuted ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {status === 'connecting'
                      ? 'Starting Text Live...'
                      : isOfflineThinking
                        ? 'Offline AI Thinking...'
                        : isTeacherSpeaking
                          ? 'Teacher Speaking'
                          : isMuted
                            ? 'Mic Muted'
                            : 'Listening & Ready to Type'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {liveRole === 'english'
                      ? 'Speak or type in English — live transcript + voice.'
                      : liveRole === 'bengali'
                        ? 'বাংলায় বলুন বা নিচে লিখুন — সাথে সাথে ভয়েস ও লেখা পাবেন।'
                        : 'Speak or type in English or বাংলা.'}
                  </p>
                </div>
              </div>

              {status === 'connected' ? (
                <div className="flex items-center gap-2 shrink-0">
                  {isTeacherSpeaking && (
                    <button
                      type="button"
                      onClick={stopTeacherSpeaking}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-500 whitespace-nowrap shrink-0"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      Stop Voice
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      sendLiveText(
                        liveRole === 'bengali'
                          ? 'হ্যালো স্যার!'
                          : liveRole === 'bilingual'
                            ? 'Hello teacher! হ্যালো স্যার!'
                            : 'Hello teacher!',
                      )
                    }
                    className="min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-cyan-400 whitespace-nowrap shrink-0"
                  >
                    {liveRole === 'bengali' ? 'হ্যালো বলুন' : 'Say Hi'}
                  </button>
                </div>
              ) : (
                status === 'idle' && (
                  <button
                    type="button"
                    onClick={() =>
                      startSession({
                        className: classNameLevel,
                        voiceName: voice,
                        liveRole,
                        voiceOnly: false,
                      })
                    }
                    className="min-h-[36px] px-3 py-1.5 rounded-xl wbsec-btn-neon-voice text-xs font-semibold whitespace-nowrap shrink-0"
                  >
                    Reconnect
                  </button>
                )
              )}
            </div>

            {error && (
              <div
                className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 px-4 py-3 text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex items-start justify-between gap-3"
                role="alert"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    startSession({
                      className: classNameLevel,
                      voiceName: voice,
                      liveRole,
                      voiceOnly: false,
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Transcript Messages */}
            <div className="space-y-3.5">
              {transcripts.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-2.5 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {item.role === 'model' && (
                    <div className="wbsec-mini-orb mt-1 shrink-0" aria-hidden="true" />
                  )}
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 dark:text-slate-100 ${
                      item.role === 'user' ? 'wbsec-bubble-user' : 'wbsec-bubble-ai'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {item.role === 'user' ? 'You' : 'Wbsec Live Teacher'}
                    </p>
                    {item.imageDataUrl && (
                      <img
                        src={item.imageDataUrl}
                        alt="Book photo sent to live teacher"
                        className="w-full max-w-[220px] max-h-48 rounded-xl border border-slate-200 dark:border-white/15 mb-1.5 object-cover"
                      />
                    )}
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}

              {interimUserText && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/15">
                    {interimUserText}...
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        {/* Inline Live Camera Panel (Available in both AI Live & Text Live) */}
        {enableCamera && isCameraOpen && (
          <div className="relative z-10 px-4 sm:px-5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0e1124] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {liveRole === 'bengali' ? 'লাইভ এইচডি ক্যামেরা' : 'Live HD Camera'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold">
                  {cameraResolution || 'HD'}
                </span>
                {isLiveVideoOn && !cameraError && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {!cameraError && (
                  <>
                    {!useOfflineMode && (
                      <button
                        type="button"
                        onClick={() => setIsLiveVideoOn((prev) => !prev)}
                        disabled={status !== 'connected' || isStartingCamera}
                        className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border transition-colors disabled:opacity-50 ${
                          isLiveVideoOn
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300'
                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {isLiveVideoOn ? (
                          <>
                            <VideoOff className="w-3.5 h-3.5" />
                            Stop Video
                          </>
                        ) : (
                          <>
                            <Video className="w-3.5 h-3.5" />
                            Live Video
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                      }
                      aria-label="Switch camera"
                      className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Flip
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(false)}
                  aria-label="Close live camera"
                  className="min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {cameraError ? (
              <div className="rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-lg wbsec-btn-neon-voice text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {liveRole === 'bengali' ? 'ছবি বাছাই করুন' : 'Choose Book Photo'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative h-44 sm:h-36 sm:w-60 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-white/10">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      if (v.videoWidth && v.videoHeight) {
                        const minDim = Math.min(v.videoWidth, v.videoHeight);
                        setCameraResolution(
                          minDim >= 1000
                            ? 'HD 1080p'
                            : minDim >= 700
                              ? 'HD 720p'
                              : `${v.videoWidth}×${v.videoHeight}`,
                        );
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  {isStartingCamera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/65 text-white text-xs">
                      Starting HD camera...
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center gap-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {liveRole === 'bengali'
                      ? 'বই বা খাতার দিকে ক্যামেরা ধরে "ছবি তুলে দেখান" চাপুন, অথবা Live Video চালু করে সরাসরি দেখান।'
                      : 'Point the camera at your book and tap "Snap & Show", or enable Live Video so your teacher sees continuously.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCaptureAndSend}
                      disabled={status !== 'connected' || isStartingCamera}
                      className="flex-1 min-h-[40px] px-3.5 py-2 rounded-xl wbsec-btn-neon-voice text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      {liveRole === 'bengali' ? 'ছবি তুলে দেখান' : 'Snap & Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={status !== 'connected'}
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Gallery
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Live Controls */}
        <div className="relative z-10 px-4 sm:px-5 py-3.5 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0c0f1f]/95 backdrop-blur-xl space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoFileChange}
            className="hidden"
          />

          {isVoiceOnly ? (
            /* Pure Voice Call Dock — Zero Text Input Box */
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={toggleMute}
                disabled={status !== 'connected'}
                aria-label={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                className={`min-h-[50px] px-4 sm:px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                  isMuted
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-800 dark:text-amber-200'
                    : 'wbsec-neon-action-mic'
                }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Mute</span>
                  </>
                )}
              </button>

              {enableCamera && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen((prev) => !prev)}
                    disabled={status !== 'connected'}
                    aria-label="Show book with camera"
                    title="Camera"
                    className={`min-h-[50px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 ${
                      isCameraOpen
                        ? 'bg-rose-600 text-white border border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                        : 'wbsec-neon-action-camera'
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    <span className="hidden sm:inline">Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status !== 'connected'}
                    aria-label="Show book photo"
                    title="Book photo"
                    className="min-h-[50px] px-4 py-2.5 rounded-2xl wbsec-neon-action-attach text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="hidden sm:inline">Photo</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleEnd}
                className="min-h-[50px] px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 shadow-[0_0_24px_rgba(244,63,94,0.5)] transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>
          ) : (
            /* Text Live Controls — Text Input + Voice + Camera */
            <>
              <form onSubmit={handleSendText} className="flex items-center gap-2">
                {enableCamera && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen((prev) => !prev)}
                      disabled={status !== 'connected'}
                      aria-label="Open camera in live mode"
                      title="Camera"
                      className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 ${
                        isCameraOpen
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : 'wbsec-neon-action-camera'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span className="hidden sm:inline">Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={status !== 'connected'}
                      aria-label="Send book photo in live mode"
                      title="Upload book photo"
                      className="min-h-[42px] px-3 py-2 rounded-xl wbsec-neon-action-attach text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                    >
                      <ImagePlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Photo</span>
                    </button>
                  </>
                )}

                <div className="flex-1 min-w-0 wbsec-neon-input px-3 py-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    disabled={status !== 'connected'}
                    placeholder={
                      liveRole === 'bengali'
                        ? 'এখানে প্রশ্ন লিখুন বা কথা বলুন...'
                        : 'Type a message or speak...'
                    }
                    className="flex-1 min-w-0 min-h-[34px] bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={status !== 'connected' || !quickMessage.trim()}
                    aria-label="Send text in live mode"
                    className="w-9 h-9 rounded-xl wbsec-neon-send inline-flex items-center justify-center disabled:opacity-45 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  disabled={status !== 'connected'}
                  className={`flex-1 min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                    isMuted
                      ? 'bg-amber-500/15 border-amber-400/60 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Unmute Mic
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Mute Mic
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleEnd}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-rose-500 active:scale-[0.98] transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Text Live
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
