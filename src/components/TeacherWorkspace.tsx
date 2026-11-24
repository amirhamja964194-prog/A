import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Paperclip,
  Trash2,
  Send,
  Square,
  Copy,
  Check,
  Volume2,
  VolumeX,
  AlertCircle,
  BookOpen,
  RotateCcw,
  Mic,
  MicOff,
  Loader2,
  FileDown,
  FileText,
  AudioLines,
  WifiOff,
  BookMarked,
  Cpu,
  ListChecks,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DEFAULT_APP_CONFIG,
  type AppProgramConfig,
  type ChatMessage,
  type ClassLevel,
  type ImageAttachment,
  type StudentProfile,
  type VoicePersona,
} from '../types';
import { FormattedBengaliText } from './FormattedBengaliText';
import { InteractiveQuizCard } from './InteractiveQuizCard';
import { StudentAvatar } from './StudentAvatar';
import { formatQuizAsMarkdown } from '../offline/offlineQuiz';
import type { OfflineAiPackTier } from '../offline/offlineAiTypes';

const CameraCaptureModal = lazy(() =>
  import('./CameraCaptureModal').then((m) => ({ default: m.CameraCaptureModal })),
);
const LiveTeacherModal = lazy(() =>
  import('./LiveTeacherModal').then((m) => ({ default: m.LiveTeacherModal })),
);
const OfflineStudyLibraryModal = lazy(() =>
  import('./OfflineStudyLibraryModal').then((m) => ({ default: m.OfflineStudyLibraryModal })),
);
import type { LiveTranscriptItem } from '../hooks/useLiveTeacher';
import type { SpeechLang } from '../hooks/useSpeechRecognition';
import { useVoicePlayer } from '../hooks/useVoicePlayer';
import {
  extractPdfTitle,
  generateConversationPdf,
  generateStudyPdf,
  makeSafeFilename,
} from '../utils/pdfGenerator';

const CLASS_LEVELS: ClassLevel[] = [
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

const VOICE_OPTIONS: Array<{ value: VoicePersona; label: string }> = [
  { value: 'Kore', label: 'Kore (Warm)' },
  { value: 'Puck', label: 'Puck (Bright)' },
  { value: 'Zephyr', label: 'Zephyr (Calm)' },
  { value: 'Charon', label: 'Charon (Deep)' },
];

const SAMPLE_PROMPTS = [
  'সালোকসংশ্লেষ প্রক্রিয়াটি সহজভাবে বুঝিয়ে দাও।',
  'নিউটনের গতির তৃতীয় সূত্র উদাহরণসহ ব্যাখ্যা করো।',
  'সালোকসংশ্লেষের ওপর একটি PDF তৈরি করো।',
];

interface TeacherWorkspaceProps {
  classNameLevel: ClassLevel;
  onClassChange: (level: ClassLevel) => void;
  messages: ChatMessage[];
  draftText: string;
  onDraftTextChange: (val: string) => void;
  image: ImageAttachment | null;
  onImageChange: (img: ImageAttachment | null) => void;
  isStreaming: boolean;
  error: string | null;
  validationError: string | null;
  onSendMessage: (options?: { overrideText?: string; speakReply?: boolean }) => void;
  onStopStreaming: () => void;
  onReset: () => void;
  latestCompletedAssistantId: string | null;
  shouldAutoSpeakLatest: boolean;
  onHandledAutoSpeak: () => void;
  isSpeechSupported: boolean;
  isListening: boolean;
  isTranscribing?: boolean;
  interimTranscript: string;
  speechLang: SpeechLang;
  onSpeechLangChange: (lang: SpeechLang) => void;
  speechError: string | null;
  onToggleListening: () => void;
  onStopListening: () => void;
  onSaveLiveTranscripts?: (items: LiveTranscriptItem[]) => void;
  onAddHighlight?: (messageId: string, phrase: string) => void;
  onRemoveHighlight?: (messageId: string, phrase: string) => void;
  isOnline?: boolean;
  offlineAiReady?: boolean;
  offlineAiTier?: OfflineAiPackTier | null;
  onOpenOfflineAiPack?: () => void;
  openLiveCounter?: number;
  onOpenOfflineTopic?: (questionTitle: string, fullAnswer: string) => void;
  studentProfile?: StudentProfile;
  onOpenProfile?: () => void;
  appConfig?: AppProgramConfig;
}

async function processImageFile(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result;
      if (typeof rawDataUrl !== 'string') {
        reject(new Error('Invalid image data.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const targetW = Math.round(img.width * scale);
        const targetH = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const base64 = rawDataUrl.split(',')[1] || '';
          resolve({
            dataUrl: rawDataUrl,
            base64,
            mimeType: file.type || 'image/jpeg',
            name: file.name,
            sizeBytes: file.size,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);
        const outputMime = 'image/jpeg';
        const compressedUrl = canvas.toDataURL(outputMime, 0.8);
        const base64 = compressedUrl.split(',')[1] || '';
        const sizeBytes = Math.round((base64.length * 3) / 4);

        resolve({
          dataUrl: compressedUrl,
          base64,
          mimeType: outputMime,
          name: file.name,
          sizeBytes,
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function TeacherWorkspace({
  classNameLevel,
  onClassChange,
  messages,
  draftText,
  onDraftTextChange,
  image,
  onImageChange,
  isStreaming,
  error,
  validationError,
  onSendMessage,
  onStopStreaming,
  onReset,
  latestCompletedAssistantId,
  shouldAutoSpeakLatest,
  onHandledAutoSpeak,
  isSpeechSupported,
  isListening,
  isTranscribing = false,
  interimTranscript,
  speechLang,
  onSpeechLangChange,
  speechError,
  onToggleListening,
  onStopListening,
  onSaveLiveTranscripts,
  onAddHighlight,
  onRemoveHighlight,
  isOnline = true,
  offlineAiReady = false,
  offlineAiTier = null,
  onOpenOfflineAiPack,
  openLiveCounter = 0,
  onOpenOfflineTopic,
  studentProfile,
  onOpenProfile,
  appConfig = DEFAULT_APP_CONFIG,
}: TeacherWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [liveInitialMode, setLiveInitialMode] = useState<'voice' | 'text'>('voice');
  const [offlineLibraryOpen, setOfflineLibraryOpen] = useState(false);

  // Strict restriction for Only Class 8 (100 MB) offline pack: ONLY Message, Voice & PDF for Class 8
  const isClass8OfflineOnly = !isOnline && offlineAiTier === 'class8';
  const effectiveCanCamera = appConfig.enableCamera && !isClass8OfflineOnly;
  const effectiveCanLive = appConfig.enableLiveMode && !isClass8OfflineOnly;
  const effectiveCanQuiz = !isClass8OfflineOnly;

  const openLiveMode = (mode: 'voice' | 'text') => {
    if (!effectiveCanLive) return;
    stopVoice();
    if (isListening) onStopListening();
    setLiveInitialMode(mode);
    setLiveModalOpen(true);
  };

  useEffect(() => {
    if (openLiveCounter > 0 && appConfig.enableLiveMode) {
      setLiveInitialMode('voice');
      setLiveModalOpen(true);
    }
  }, [openLiveCounter, appConfig.enableLiveMode]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);
  const [quizMakerOpen, setQuizMakerOpen] = useState(false);
  const [quizTopicInput, setQuizTopicInput] = useState('');
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(5);

  const {
    voice,
    setVoice,
    activeId: activeVoiceId,
    isLoading: isVoiceLoading,
    isPlaying: isVoicePlaying,
    speak,
    stop: stopVoice,
  } = useVoicePlayer(appConfig.defaultVoice);

  useEffect(() => {
    setVoice(appConfig.defaultVoice);
  }, [appConfig.defaultVoice, setVoice]);

  useEffect(() => {
    if (!appConfig.enableLiveMode && liveModalOpen) {
      setLiveModalOpen(false);
    }
  }, [appConfig.enableLiveMode, liveModalOpen]);

  useEffect(() => {
    if (!appConfig.enableVoiceOutput && autoSpeak) {
      setAutoSpeak(false);
      stopVoice();
    }
  }, [appConfig.enableVoiceOutput, autoSpeak, stopVoice]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isStreaming ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!latestCompletedAssistantId || !shouldAutoSpeakLatest) return;
    const msg = messages.find((m) => m.id === latestCompletedAssistantId);
    if (msg && msg.role === 'model' && msg.text.trim()) {
      speak(msg.text, msg.id);
    }
    onHandledAutoSpeak();
  }, [
    latestCompletedAssistantId,
    shouldAutoSpeakLatest,
    messages,
    speak,
    onHandledAutoSpeak,
  ]);

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    setFileError(null);
    try {
      const processed = await processImageFile(file);
      onImageChange(processed);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Unable to process image.');
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
    } catch {
      // Clipboard blocked fallback
    }
  };

  const handleSendClick = () => {
    if (isListening) {
      onStopListening();
      if (!draftText.trim() && !image) {
        return;
      }
    }
    if (isTranscribing && !draftText.trim() && !image) {
      return;
    }
    onSendMessage({ speakReply: autoSpeak });
  };

  const handleDownloadMessagePdf = async (msg: ChatMessage) => {
    const markdownSource = msg.quiz ? formatQuizAsMarkdown(msg.quiz) : msg.text;
    if (!markdownSource.trim() || exportingPdfId) return;
    setExportingPdfId(msg.id);
    try {
      const title =
        msg.quiz?.title ||
        msg.pdf?.title ||
        extractPdfTitle(msg.text, `${classNameLevel} Study Notes`);
      const filename = msg.pdf?.filename || makeSafeFilename(title);
      await generateStudyPdf({
        title,
        subtitle: `West Bengal Board (WBBSE) · ${classNameLevel}`,
        markdown: markdownSource,
        filename,
      });
    } finally {
      setExportingPdfId(null);
    }
  };

  const handleExportChatPdf = async () => {
    if (messages.length === 0 || exportingPdfId) return;
    setExportingPdfId('full-chat');
    try {
      const pdfMessages = messages.map((m) =>
        m.quiz ? { ...m, text: formatQuizAsMarkdown(m.quiz) } : m,
      );
      await generateConversationPdf(pdfMessages, classNameLevel);
    } finally {
      setExportingPdfId(null);
    }
  };

  return (
    <section
      aria-label="AI Teacher Chat"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (appConfig.enableCamera) {
          handleFileSelected(e.dataTransfer.files?.[0]);
        }
      }}
      className={`flex-1 min-h-0 bg-[var(--app-card-bg)] dark:backdrop-blur-xl sm:border rounded-none sm:rounded-3xl flex flex-col overflow-hidden transition-colors dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] ${
        isDragging
          ? 'border-[var(--app-accent)] dark:border-fuchsia-400 ring-2 ring-fuchsia-500/30'
          : 'border-slate-200/90 dark:border-white/10'
      }`}
    >
      {/* Ultra-Compact Single-Line Chat Toolbar (Never Wraps on Mobile) */}
      <div className="shrink-0 px-2 sm:px-5 py-1 sm:py-1.5 border-b border-slate-200/80 dark:border-white/10 bg-[var(--app-card-bg)] flex items-center justify-between gap-1 flex-nowrap overflow-x-auto taskbar-scroll">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <label htmlFor="class-select" className="sr-only">
            Select Class
          </label>
          <select
            id="class-select"
            value={isClass8OfflineOnly ? 'Class 8' : classNameLevel}
            onChange={(e) => onClassChange(e.target.value as ClassLevel)}
            disabled={isClass8OfflineOnly}
            className="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none disabled:opacity-80"
          >
            {(isClass8OfflineOnly ? (['Class 8'] as ClassLevel[]) : CLASS_LEVELS).map((lvl) => (
              <option key={lvl} value={lvl}>
                {isClass8OfflineOnly ? 'Class 8 (100MB)' : lvl}
              </option>
            ))}
          </select>

          {!isClass8OfflineOnly && (
            <button
              type="button"
              onClick={() => setOfflineLibraryOpen(true)}
              className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                !isOnline
                  ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                  : 'bg-[var(--app-surface-subtle)] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">নোটস</span>
              <span className="hidden sm:inline">অফলাইন নোটস</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {appConfig.enableVoiceOutput && (
            <>
              <label htmlFor="voice-select" className="sr-only">
                AI Voice
              </label>
              <select
                id="voice-select"
                value={voice}
                onChange={(e) => setVoice(e.target.value as VoicePersona)}
                className="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none max-w-[68px] sm:max-w-none"
                title="Select AI Teacher Voice"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.value}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const next = !autoSpeak;
                  setAutoSpeak(next);
                  if (!next && (isVoicePlaying || isVoiceLoading)) {
                    stopVoice();
                  }
                }}
                aria-pressed={autoSpeak}
                aria-label={autoSpeak ? 'Auto Voice On' : 'Auto Voice Off'}
                title={autoSpeak ? 'Voice On' : 'Voice Off'}
                className={`h-7 sm:h-8 px-2 rounded-lg border text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                  autoSpeak
                    ? 'bg-[var(--app-accent-soft)] border-[var(--app-accent)]/40 dark:border-sky-500/50 text-[var(--app-accent)] dark:text-sky-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {autoSpeak ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Voice On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Voice Off</span>
                  </>
                )}
              </button>
            </>
          )}

          {messages.length > 0 && (
            <>
              {appConfig.enablePdfExport && (
                <button
                  type="button"
                  onClick={handleExportChatPdf}
                  disabled={isStreaming || exportingPdfId === 'full-chat'}
                  aria-label="Export conversation as PDF"
                  title="Download full chat as PDF"
                  className="h-7 sm:h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap disabled:opacity-50 shrink-0"
                >
                  {exportingPdfId === 'full-chat' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  stopVoice();
                  if (isListening) onStopListening();
                  onReset();
                }}
                disabled={isStreaming}
                aria-label="Start new chat"
                title="Clear chat"
                className="h-7 sm:h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap disabled:opacity-50 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!isOnline && (
        <div className="shrink-0 px-3 sm:px-5 py-2 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/70 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2 min-w-0">
            <WifiOff className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">
              {isClass8OfflineOnly
                ? 'অনলি ক্লাস ৮ (১০০ MB) মোড চালু — শুধু Class 8-এর মেসেজ, ভয়েস ও PDF কাজ করবে (অন্য কিছু নয়)।'
                : offlineAiTier === 'pro'
                  ? 'অফলাইন প্রো (৫০০ MB) চালু — সব ফিচার ও গুছিয়ে বিস্তারিত উত্তর চলছে!'
                  : offlineAiTier === 'standard'
                    ? 'অফলাইন ফাস্ট (২৫০ MB) চালু — সব ফিচার ও সুপার ফাস্ট উত্তর চলছে!'
                    : 'অফলাইন মোড চালু — WBBSE নোটস, অঙ্ক সমাধান ও PDF ব্যবহার করুন, অথবা 100/250/500 MB AI প্যাক ডাউনলোড করুন।'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenOfflineAiPack && (
              <button
                type="button"
                onClick={onOpenOfflineAiPack}
                className="min-h-[28px] px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                {offlineAiTier === 'pro'
                  ? '500 MB AI ✓'
                  : offlineAiTier === 'standard'
                    ? '250 MB AI ✓'
                    : offlineAiTier === 'class8'
                      ? 'Class 8 (100 MB) ✓'
                      : 'Offline AI প্যাক'}
              </button>
            )}
            {!isClass8OfflineOnly && (
              <button
                type="button"
                onClick={() => setOfflineLibraryOpen(true)}
                className="min-h-[28px] px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0"
              >
                পাঠ্যবই নোটস খুলুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* Enlarged Scrollable Chat Conversation Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-6 py-2.5 sm:py-5 space-y-3 sm:space-y-5">
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col justify-start sm:justify-center max-w-3xl mx-auto py-1 sm:py-4 space-y-3.5 sm:space-y-5">
            {/* Centered Animated Neon AI Orb & Title */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="wbsec-ai-orb" aria-hidden="true" />
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {appConfig.welcomeTitle.trim() || `${appConfig.appName} AI Assistant`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {appConfig.welcomeSubtitle.trim() || DEFAULT_APP_CONFIG.welcomeSubtitle}
                </p>
              </div>
            </div>

            {/* Neon Greeting Bubble */}
            <div className="flex items-start gap-2.5 max-w-2xl mx-auto w-full">
              <div className="wbsec-mini-orb mt-1" aria-hidden="true" />
              <div className="wbsec-bubble-ai px-4 py-3 text-sm text-slate-900 dark:text-slate-100 leading-relaxed flex-1">
                {studentProfile?.name?.trim() ? (
                  <>
                    নমস্কার, <strong className="text-cyan-700 dark:text-cyan-300">{studentProfile.name.trim()}</strong>! আমি তোমার <strong>{appConfig.appName} AI Teacher ({isClass8OfflineOnly ? 'Class 8' : classNameLevel})</strong>।{' '}
                    {isClass8OfflineOnly
                      ? 'এখন অনলি ক্লাস ৮ (১০০ MB) মোডে আছো — নিচে মেসেজ লেখো, ভয়েস ব্যবহার করো বা PDF নাও।'
                      : 'আজ কী পড়বে বলো — নিচে প্রশ্ন লিখো অথবা মাইক, ক্যামেরা, কুইজ ও লাইভ বাটন ব্যবহার করো।'}
                  </>
                ) : (
                  <>
                    নমস্কার! আমি আপনার <strong>{appConfig.appName} AI Teacher ({isClass8OfflineOnly ? 'Class 8' : classNameLevel})</strong>।{' '}
                    {isClass8OfflineOnly
                      ? 'এখন অনলি ক্লাস ৮ (১০০ MB) মোড চালু — শুধু মেসেজ, ভয়েস ও PDF ব্যবহার করুন।'
                      : 'নিচে যেকোনো প্রশ্ন লিখুন অথবা মাইক, ক্যামেরা, ফাইল ও লাইভ বাটন ব্যবহার করুন।'}
                  </>
                )}
              </div>
            </div>

            {/* Focused Welcome Quick Tools (Quiz + Offline AI) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {effectiveCanQuiz && (
                <button
                  type="button"
                  onClick={() => setQuizMakerOpen((prev) => !prev)}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-amber-400/60 dark:border-amber-400/50 bg-amber-50/80 dark:bg-amber-950/35 hover:border-amber-500 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all"
                >
                  <ListChecks className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
                  কুইজ তৈরি করুন (Quiz)
                </button>
              )}
              {onOpenOfflineAiPack && (
                <button
                  type="button"
                  onClick={onOpenOfflineAiPack}
                  className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all ${
                    offlineAiReady
                      ? 'border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-white/15 bg-[var(--app-surface-subtle)] hover:border-fuchsia-400 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400 shrink-0" />
                  {offlineAiTier === 'pro'
                    ? 'Offline AI (500 MB) ✓'
                    : offlineAiTier === 'standard'
                      ? 'Offline AI (250 MB) ✓'
                      : offlineAiTier === 'class8'
                        ? 'Class 8 (100 MB) ✓'
                        : 'অফলাইন AI প্যাক (100–500 MB)'}
                </button>
              )}
            </div>

            {quizMakerOpen && (
              <div className="rounded-2xl border border-amber-400/40 dark:border-amber-400/35 bg-white/95 dark:bg-[#12162b]/95 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-300" />
                    যেকোনো টপিক লিখো — ৪ অপশনের কুইজ তৈরি হয়ে যাবে
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuizMakerOpen(false)}
                    aria-label="Close quiz maker"
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const topic = quizTopicInput.trim();
                    if (!topic) return;
                    setQuizMakerOpen(false);
                    setQuizTopicInput('');
                    onSendMessage({
                      overrideText: `${topic} নিয়ে ${quizQuestionCount}টি কুইজ প্রশ্ন বানাও`,
                      speakReply: autoSpeak,
                    });
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={quizTopicInput}
                    onChange={(e) => setQuizTopicInput(e.target.value)}
                    placeholder="টপিক লিখো (যেমন: সালোকসংশ্লেষ, পলাশীর যুদ্ধ, গণিত, Tense)..."
                    className="flex-1 min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0b0e1e] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-cyan-400"
                  />
                  <select
                    value={quizQuestionCount}
                    onChange={(e) => setQuizQuestionCount(Number(e.target.value))}
                    aria-label="Number of quiz questions"
                    className="min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0b0e1e] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value={5}>৫টি প্রশ্ন</option>
                    <option value={8}>৮টি প্রশ্ন</option>
                    <option value={10}>১০টি প্রশ্ন</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!quizTopicInput.trim() || isStreaming}
                    className="min-h-[42px] px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 disabled:opacity-50 shrink-0"
                  >
                    <ListChecks className="w-4 h-4" />
                    কুইজ বানাও
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5">
                  {['সালোকসংশ্লেষ', 'নিউটনের গতিসূত্র', 'পলাশীর যুদ্ধ', 'পশ্চিমবঙ্গের ভূগোল', 'বাংলা সন্ধি', 'গণিত', 'English Tense'].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        disabled={isStreaming}
                        onClick={() => {
                          setQuizMakerOpen(false);
                          onSendMessage({
                            overrideText: `${preset} নিয়ে ${quizQuestionCount}টি কুইজ প্রশ্ন বানাও`,
                            speakReply: autoSpeak,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:border-cyan-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {preset}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                Try asking:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(appConfig.samplePrompts.length > 0 ? appConfig.samplePrompts : SAMPLE_PROMPTS).map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() =>
                      onSendMessage({ overrideText: sample, speakReply: autoSpeak })
                    }
                    className="text-left p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-[var(--app-surface-subtle)] hover:bg-white dark:hover:bg-[#181b2e] hover:border-fuchsia-400/70 dark:hover:border-cyan-400/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="wbsec-msg-enter flex items-start justify-end gap-1.5 sm:gap-2">
                    <div className="wbsec-bubble-user max-w-[88%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 space-y-1.5">
                      {studentProfile?.name?.trim() && (
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80">
                          {studentProfile.name.trim()}
                        </div>
                      )}
                      {msg.image && (
                        <img
                          src={msg.image.dataUrl}
                          alt={msg.image.name || 'Attached textbook photo'}
                          referrerPolicy="no-referrer"
                          className="max-h-52 rounded-xl object-contain bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10"
                        />
                      )}
                      {msg.text && (
                        <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-900 dark:text-slate-50 whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}
                    </div>
                    {studentProfile && (
                      <button
                        type="button"
                        onClick={() => onOpenProfile?.()}
                        title="আমার প্রোফাইল"
                        aria-label="Open student profile"
                        className="mt-0.5 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <StudentAvatar profile={studentProfile} size="xs" />
                      </button>
                    )}
                  </div>
                );
              }

              const isThisVoiceActive = activeVoiceId === msg.id;
              const isCurrentlyStreamingMsg =
                isStreaming && msg.id === messages[messages.length - 1]?.id;
              const msgHighlights = msg.highlights ?? [];

              return (
                <div key={msg.id} className="wbsec-msg-enter flex items-start gap-2 sm:gap-3">
                  <div className="wbsec-mini-orb mt-1 shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="wbsec-bubble-ai px-3 sm:px-4 py-2.5 sm:py-3.5 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {appConfig.appName} Teacher
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{classNameLevel}</span>
                        {msgHighlights.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 dark:text-yellow-300 font-medium tabular-nums">
                              {msgHighlights.length} highlighted
                            </span>
                          </>
                        )}
                        {isCurrentlyStreamingMsg && !msg.text && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                              Thinking...
                            </span>
                          </>
                        )}
                      </div>

                      {msg.text ? (
                        <FormattedBengaliText
                          text={msg.text}
                          highlights={msgHighlights}
                          interactive={!isCurrentlyStreamingMsg}
                          onAddHighlight={(phrase) => onAddHighlight?.(msg.id, phrase)}
                          onRemoveHighlight={(phrase) => onRemoveHighlight?.(msg.id, phrase)}
                        />
                      ) : (
                        <div className="space-y-2 max-w-md animate-pulse py-1">
                          <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                          <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
                        </div>
                      )}
                    </div>

                  {!isCurrentlyStreamingMsg && msg.quiz && (
                    <InteractiveQuizCard
                      quiz={msg.quiz}
                      isBusy={isStreaming}
                      onRequestNewQuiz={(topic) =>
                        onSendMessage({
                          overrideText: `${topic} নিয়ে নতুন ৫টি কুইজ প্রশ্ন বানাও`,
                          speakReply: autoSpeak,
                        })
                      }
                    />
                  )}

                  {!isCurrentlyStreamingMsg && msg.pdf && appConfig.enablePdfExport && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 max-w-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {msg.pdf.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {msg.pdf.filename} · Ready
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadMessagePdf(msg)}
                        disabled={exportingPdfId === msg.id}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
                      >
                        {exportingPdfId === msg.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Creating PDF...
                          </>
                        ) : (
                          <>
                            <FileDown className="w-3.5 h-3.5" />
                            Download PDF
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!isCurrentlyStreamingMsg && msg.text && (
                    <div className="flex items-center gap-1.5 pt-0.5 flex-nowrap overflow-x-auto taskbar-scroll">
                      {appConfig.enableVoiceOutput && (
                        <button
                          type="button"
                          onClick={() => speak(msg.text, msg.id)}
                          className={`h-7 sm:h-8 px-2.5 rounded-lg border text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                            isThisVoiceActive && (isVoicePlaying || isVoiceLoading)
                              ? 'bg-[var(--app-accent-soft)] border-[var(--app-accent)]/40 dark:border-sky-500/50 text-[var(--app-accent)] dark:text-sky-400'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isThisVoiceActive && isVoiceLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Voice...
                            </>
                          ) : isThisVoiceActive && isVoicePlaying ? (
                            <>
                              <Square className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              Listen
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(msg.id, msg.quiz ? formatQuizAsMarkdown(msg.quiz) : msg.text)
                        }
                        className="h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>

                      {!msg.pdf && appConfig.enablePdfExport && (
                        <button
                          type="button"
                          onClick={() => handleDownloadMessagePdf(msg)}
                          disabled={exportingPdfId === msg.id}
                          className="h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
                        >
                          {exportingPdfId === msg.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              PDF...
                            </>
                          ) : (
                            <>
                              <FileDown className="w-3 h-3" />
                              PDF
                            </>
                          )}
                        </button>
                      )}

                      {!msg.quiz && (
                        <button
                          type="button"
                          disabled={isStreaming}
                          onClick={() =>
                            onSendMessage({
                              overrideText:
                                'উপরের বিষয়টি নিয়ে ৫টি কুইজ প্রশ্ন বানাও (প্রতিটিতে ৪টি অপশনসহ)।',
                            })
                          }
                          className="h-7 sm:h-8 px-2.5 rounded-lg border border-amber-300/70 dark:border-amber-500/40 text-[11px] sm:text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
                        >
                          <ListChecks className="w-3 h-3" />
                          কুইজ
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isStreaming}
                        onClick={() =>
                          onSendMessage({
                            overrideText:
                              'উপরের গল্প বা বিষয়টি আরও বড়, পূর্ণাঙ্গ এবং বিস্তারিতভাবে শুরু থেকে শেষ পর্যন্ত সুন্দর করে বুঝিয়ে দাও।',
                          })
                        }
                        className="h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-[var(--app-accent)] dark:hover:border-sky-500 hover:text-[var(--app-accent)] dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
                      >
                        <BookOpen className="w-3 h-3" />
                        আরও বিস্তারিত
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              );
            })}

            {error && (
              <div
                className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Compact Bottom Neon AI Assistant Composer Section */}
      <div className="shrink-0 border-t border-slate-200/80 dark:border-white/10 bg-[var(--app-card-bg)] dark:bg-gradient-to-b dark:from-transparent dark:to-[#05060d]/95 px-2 sm:px-6 py-1.5 sm:py-2.5">
        <div className="max-w-4xl mx-auto space-y-1.5">
          {/* Listening / Transcribing Live Status */}
          {(isListening || isTranscribing) && (
            <div
              className="rounded-xl bg-[var(--app-accent-soft)] dark:bg-fuchsia-950/50 border border-[var(--app-accent)]/30 dark:border-fuchsia-500/40 px-3 py-1.5 text-xs text-slate-700 dark:text-fuchsia-100 flex items-center justify-between gap-2.5"
              aria-live="polite"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-semibold text-[var(--app-accent)] dark:text-fuchsia-300 flex items-center gap-1.5">
                  {isTranscribing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {isTranscribing
                    ? speechLang === 'bn-IN'
                      ? 'আপনার কথা পরিষ্কারভাবে লেখা হচ্ছে...'
                      : 'Transcribing your voice...'
                    : speechLang === 'bn-IN'
                      ? 'শুনছি — কথা শেষে Done চাপুন'
                      : 'Listening — speak now, tap Done when finished'}
                </p>
                {interimTranscript && (
                  <p className="text-slate-700 dark:text-slate-200 truncate">{interimTranscript}</p>
                )}
              </div>
              {isListening && (
                <button
                  type="button"
                  onClick={onStopListening}
                  className="h-7 px-2.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold shrink-0"
                >
                  Done
                </button>
              )}
            </div>
          )}

          {/* Attached Photo Preview Chip */}
          {image && (
            <div className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/35 bg-slate-50 dark:bg-[#121422] px-2.5 py-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={image.dataUrl}
                  alt="Attached photo preview"
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-white/15 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{image.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-cyan-300">Photo attached</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onImageChange(null)}
                aria-label="Remove attached photo"
                className="h-7 px-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 inline-flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          )}

          {(validationError || fileError || speechError) && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {validationError || fileError || speechError}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFileSelected(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

          {/* Compact Neon Gradient-Bordered Input Bar + Gradient Send Button */}
          <div className="wbsec-neon-input flex items-center gap-1.5 pl-3 pr-1 py-1">
            <textarea
              id="ai-question"
              rows={1}
              value={draftText}
              onChange={(e) => onDraftTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isStreaming) handleSendClick();
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 min-w-0 max-h-24 py-1.5 bg-transparent text-slate-900 dark:text-white text-sm sm:text-[15px] leading-snug placeholder:text-slate-400 dark:placeholder:text-[#8b92a8] focus:outline-none resize-none"
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                aria-label="Stop response"
                className="min-w-[38px] h-[34px] sm:h-[38px] px-2.5 sm:px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendClick}
                aria-label="Send message"
                className="wbsec-neon-send min-w-[38px] h-[34px] sm:h-[38px] px-2.5 sm:px-3 rounded-xl inline-flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>

          {/* Single-Line Compact Neon Action Bar (Mic, BN/EN, Camera, Attach, AI Live) */}
          <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto taskbar-scroll">
            {isSpeechSupported && appConfig.enableVoiceInput && (
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={onToggleListening}
                  disabled={isTranscribing}
                  aria-pressed={isListening}
                  title={isListening ? 'Stop voice dictation' : 'Voice Mic'}
                  aria-label={isListening ? 'Stop voice dictation' : 'Start Bengali voice dictation'}
                  className={`wbsec-neon-action wbsec-neon-action-mic px-2.5 sm:px-3 disabled:opacity-60 ${
                    isListening ? 'ring-2 ring-fuchsia-400/70' : ''
                  }`}
                >
                  {isTranscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : isListening ? (
                    <MicOff className="w-4 h-4 shrink-0" />
                  ) : (
                    <Mic className="w-4 h-4 shrink-0" />
                  )}
                  <span className="hidden sm:inline text-xs font-semibold">
                    {isTranscribing ? 'Writing...' : isListening ? 'Stop' : 'Voice'}
                  </span>
                </button>

                <div
                  className="inline-flex items-center rounded-lg bg-slate-200/80 dark:bg-[#121422] border border-slate-200 dark:border-white/10 p-0.5 text-[10.5px] sm:text-[11px]"
                  role="group"
                  aria-label="Voice language"
                >
                  <button
                    type="button"
                    disabled={isListening}
                    onClick={() => onSpeechLangChange('bn-IN')}
                    className={`h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      speechLang === 'bn-IN'
                        ? 'bg-white dark:bg-fuchsia-600 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    } disabled:opacity-60`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    disabled={isListening}
                    onClick={() => onSpeechLangChange('en-IN')}
                    className={`h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      speechLang === 'en-IN'
                        ? 'bg-white dark:bg-fuchsia-600 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    } disabled:opacity-60`}
                  >
                    EN
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {effectiveCanCamera && (
                <>
                  <button
                    type="button"
                    onClick={() => setCameraModalOpen(true)}
                    title="Camera"
                    aria-label="Take a photo with camera"
                    className="wbsec-neon-action wbsec-neon-action-camera px-2.5 sm:px-3"
                  >
                    <Camera className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline text-xs font-semibold">Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach Book Photo"
                    aria-label="Upload an image"
                    className="wbsec-neon-action wbsec-neon-action-attach px-2.5 sm:px-3"
                  >
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline text-xs font-semibold">Attach</span>
                  </button>
                </>
              )}

              {effectiveCanLive && (
                <button
                  type="button"
                  onClick={() => openLiveMode('voice')}
                  title="AI Live (সরাসরি কথা ও টেক্সট লাইভ)"
                  aria-label="Open AI Live Teacher Mode"
                  className="wbsec-neon-action wbsec-neon-action-live px-2.5 sm:px-3.5"
                >
                  <AudioLines className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
                    {isOnline ? 'AI Live' : 'Offline Live'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {effectiveCanCamera && cameraModalOpen && (
        <Suspense fallback={null}>
          <CameraCaptureModal
            isOpen={true}
            onClose={() => setCameraModalOpen(false)}
            onCapture={(captured) => {
              setFileError(null);
              onImageChange(captured);
            }}
            onFallbackUpload={() => fileInputRef.current?.click()}
          />
        </Suspense>
      )}

      {appConfig.enableLiveMode && liveModalOpen && (
        <Suspense fallback={null}>
          <LiveTeacherModal
            isOpen={true}
            onClose={(liveItems) => {
              setLiveModalOpen(false);
              if (liveItems.length > 0) {
                onSaveLiveTranscripts?.(liveItems);
              }
            }}
            classNameLevel={classNameLevel}
            voice={voice}
            onVoiceChange={setVoice}
            defaultLiveRole={appConfig.defaultLiveRole}
            initialInteractionMode={liveInitialMode}
            enableCamera={appConfig.enableCamera}
            studentName={studentProfile?.name}
            onOpenOfflineAiPack={onOpenOfflineAiPack}
          />
        </Suspense>
      )}

      {offlineLibraryOpen && (
        <Suspense fallback={null}>
          <OfflineStudyLibraryModal
            isOpen={true}
            onClose={() => setOfflineLibraryOpen(false)}
            isOnline={isOnline}
            onSelectTopic={(title, answer) => {
              onOpenOfflineTopic?.(title, answer);
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
