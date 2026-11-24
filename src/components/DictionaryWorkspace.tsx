import { useState } from 'react';
import {
  Search,
  Volume2,
  Square,
  Copy,
  Check,
  AlertCircle,
  BookA,
  X,
  Mic,
  MicOff,
  Loader2,
  FileDown,
  WifiOff,
} from 'lucide-react';
import {
  DEFAULT_APP_CONFIG,
  type AppProgramConfig,
  type DictionaryEntry,
} from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useVoicePlayer } from '../hooks/useVoicePlayer';
import { generateDictionaryPdf } from '../utils/pdfGenerator';
import { getAllOfflineDictionaryWords } from '../offline/offlineDictionary';

const SAMPLE_WORDS = [
  'বিদ্যালয়',
  'সূর্যোদয়',
  'অন্বেষণ',
  'জিজ্ঞাসা',
  'দিগন্ত',
  'Resilience',
];

interface DictionaryWorkspaceProps {
  word: string;
  onWordChange: (val: string) => void;
  entry: DictionaryEntry | null;
  isLoading: boolean;
  error: string | null;
  validationError: string | null;
  onSearch: (overrideWord?: string) => void;
  isOnline?: boolean;
  offlineSuggestions?: string[];
  appConfig?: AppProgramConfig;
}

export function DictionaryWorkspace({
  word,
  onWordChange,
  entry,
  isLoading,
  error,
  validationError,
  onSearch,
  isOnline = true,
  offlineSuggestions = [],
  appConfig = DEFAULT_APP_CONFIG,
}: DictionaryWorkspaceProps) {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const offlineWords = getAllOfflineDictionaryWords();

  const {
    activeId: activeVoiceId,
    isLoading: isVoiceLoading,
    isPlaying: isVoicePlaying,
    speak,
  } = useVoicePlayer(appConfig.defaultVoice);

  const {
    isSupported: isSpeechSupported,
    isListening,
    isTranscribing,
    interimTranscript,
    lang: speechLang,
    setLang: setSpeechLang,
    error: speechError,
    stopListening,
    toggleListening,
  } = useSpeechRecognition({
    defaultLang: 'bn-IN',
    continuous: false,
    onFinalResult: (spokenWord) => {
      const cleaned = spokenWord.replace(/[।.?!,;:'"]+$/g, '').trim();
      if (!cleaned) return;
      onWordChange(cleaned);
      onSearch(cleaned);
    },
  });

  const handleCopyEntry = async () => {
    if (!entry) return;
    const formatted = [
      `শব্দ: ${entry.word}`,
      `১. উচ্চারণ: ${entry.pronunciation}`,
      `২. অর্থ: ${entry.meaning}`,
      `৩. সন্ধি বিচ্ছেদ: ${entry.sandhiVicched}`,
      `৪. ব্যাকরণগত পরিচয়: ${entry.grammar}`,
      `৫. বাক্য রচনা:\n${entry.exampleSentences.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}`,
    ].join('\n\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleSpeakWord = () => {
    if (!entry) return;
    const script = `${entry.word}। ${entry.meaning}`;
    speak(script, `dict-${entry.word}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Search Column */}
      <section
        aria-label="Dictionary Search"
        className="lg:col-span-5 bg-[var(--app-card-bg)] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {appConfig.dictionaryTitle.trim() || DEFAULT_APP_CONFIG.dictionaryTitle}
            </h1>
            {!isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-[11px] font-semibold shrink-0">
                <WifiOff className="w-3 h-3" />
                অফলাইন
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {!isOnline
              ? `অফলাইন ডিকশনারি চালু — ${offlineWords.length}টি বাংলা ও ইংরেজি শব্দ ইন্টারনেট ছাড়াই খুঁজুন।`
              : appConfig.dictionarySubtitle.trim() || DEFAULT_APP_CONFIG.dictionarySubtitle}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isListening) stopListening();
            onSearch();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="dict-word-input"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Enter Any Bengali or English Word
              </label>

              {isSpeechSupported && appConfig.enableVoiceInput && (
                <div
                  className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs"
                  role="group"
                  aria-label="Voice lookup language"
                >
                  <button
                    type="button"
                    disabled={isListening}
                    onClick={() => setSpeechLang('bn-IN')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      speechLang === 'bn-IN'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    } disabled:opacity-60`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    disabled={isListening}
                    onClick={() => setSpeechLang('en-IN')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      speechLang === 'en-IN'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    } disabled:opacity-60`}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="dict-word-input"
                  type="text"
                  value={word}
                  onChange={(e) => onWordChange(e.target.value)}
                  placeholder="e.g., বিদ্যালয় or Knowledge"
                  className="w-full min-h-[48px] pl-4 pr-11 py-3 rounded-xl bg-[var(--app-surface-subtle)] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/20 transition-colors"
                />
                {word && (
                  <button
                    type="button"
                    onClick={() => onWordChange('')}
                    aria-label="Clear word input"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isSpeechSupported && appConfig.enableVoiceInput && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isTranscribing}
                  aria-pressed={isListening}
                  aria-label={isListening ? 'Stop voice word search' : 'Speak a word to look up'}
                  className={`min-h-[48px] min-w-[48px] px-3.5 rounded-xl border inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-all shrink-0 disabled:opacity-60 ${
                    isListening
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[var(--app-accent)] dark:hover:border-sky-500 hover:text-[var(--app-accent)] dark:hover:text-sky-400'
                  }`}
                >
                  {isTranscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {(isListening || isTranscribing) && (
              <div
                className="rounded-xl bg-[var(--app-accent-soft)] border border-[var(--app-accent)]/30 dark:border-sky-800 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3"
                aria-live="polite"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold text-[var(--app-accent)] dark:text-sky-400 flex items-center gap-1.5">
                    {isTranscribing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" aria-hidden="true" />
                    )}
                    {isTranscribing
                      ? speechLang === 'bn-IN'
                        ? 'শব্দটি লেখা হচ্ছে...'
                        : 'Transcribing word...'
                      : speechLang === 'bn-IN'
                        ? 'শব্দটি বলুন...'
                        : 'Speak an English word...'}
                  </p>
                  {interimTranscript && (
                    <p className="text-slate-700 dark:text-slate-200 truncate">{interimTranscript}</p>
                  )}
                </div>
                {isListening && (
                  <button
                    type="button"
                    onClick={stopListening}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0"
                  >
                    Stop
                  </button>
                )}
              </div>
            )}

            {speechError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {speechError}
              </p>
            )}

            {!isSpeechSupported && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Voice input is unavailable in this browser.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {!isOnline
                ? `অফলাইনে উপলব্ধ শব্দ (${offlineWords.length}টি):`
                : 'Try a sample word:'}
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {(!isOnline
                ? offlineWords.slice(0, 24)
                : appConfig.sampleWords.length > 0
                  ? appConfig.sampleWords
                  : SAMPLE_WORDS
              ).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    onWordChange(sample);
                    onSearch(sample);
                  }}
                  className="min-h-[34px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {validationError && (
            <div
              className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap"
          >
            <Search className="w-4 h-4 shrink-0" />
            {isLoading ? 'Analyzing Word...' : 'Search Word'}
          </button>
        </form>
      </section>

      {/* Right Entry Sheet Column */}
      <section
        aria-label="Dictionary Entry"
        className="lg:col-span-7 bg-[var(--app-card-bg)] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 min-h-[440px] flex flex-col transition-colors"
      >
        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center space-y-5 py-8">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--app-accent)] dark:text-sky-400">
                Analyzing word structure and grammar...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Preparing pronunciation, meaning, and Sandhi Vicched
              </p>
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4">
            <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-md">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {!isOnline ? 'অফলাইন ডিকশনারি' : 'Could not look up this word'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{error}</p>
            </div>
            {offlineSuggestions.length > 0 && (
              <div className="w-full max-w-md space-y-2 pt-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  অফলাইনে এই শব্দগুলো দেখতে ট্যাপ করুন:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {offlineSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        onWordChange(s);
                        onSearch(s);
                      }}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300 text-xs font-semibold hover:opacity-85 transition-opacity"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => onSearch()}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : entry ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dictionary Entry</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {entry.word}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {appConfig.enableVoiceOutput && (
                  <button
                    type="button"
                    onClick={handleSpeakWord}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {activeVoiceId === `dict-${entry.word}` && isVoiceLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading...
                      </>
                    ) : activeVoiceId === `dict-${entry.word}` && isVoicePlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        Pronounce
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyEntry}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Entry
                    </>
                  )}
                </button>

                {appConfig.enablePdfExport && (
                  <button
                    type="button"
                    disabled={isExportingPdf}
                    onClick={async () => {
                      if (!entry || isExportingPdf) return;
                      setIsExportingPdf(true);
                      try {
                        await generateDictionaryPdf(entry);
                      } finally {
                        setIsExportingPdf(false);
                      }
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {isExportingPdf ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5" />
                        Save PDF
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <dl className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">১. উচ্চারণ</dt>
                <dd className="sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {entry.pronunciation}
                </dd>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">২. অর্থ</dt>
                <dd className="sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {entry.meaning}
                </dd>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">৩. সন্ধি বিচ্ছেদ</dt>
                <dd className="sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {entry.sandhiVicched}
                </dd>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">৪. ব্যাকরণগত পরিচয়</dt>
                <dd className="sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {entry.grammar}
                </dd>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4">
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">৫. বাক্য রচনা</dt>
                <dd className="sm:col-span-2">
                  <ul className="space-y-2 list-disc pl-5 text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                    {entry.exampleSentences.map((sentence, idx) => (
                      <li key={idx}>{sentence}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center py-8 space-y-6 max-w-lg mx-auto">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center mb-3">
                <BookA className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Structured Bengali Lexicon &amp; Grammar
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Search any Bengali or English word to view a 5-part West Bengal Board grammar breakdown: pronunciation, meaning, Sandhi Vicched, grammatical classification, and example sentences.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
