import { useMemo, useState } from 'react';
import { BookOpen, X, WifiOff, Calculator, BookmarkCheck, Search } from 'lucide-react';
import {
  OFFLINE_SUBJECTS,
  OFFLINE_STUDY_TOPICS,
  loadCachedTeacherAnswers,
  type OfflineSubjectId,
} from '../offline/offlineKnowledge';

interface OfflineStudyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (questionTitle: string, fullAnswer: string) => void;
  isOnline: boolean;
}

export function OfflineStudyLibraryModal({
  isOpen,
  onClose,
  onSelectTopic,
  isOnline,
}: OfflineStudyLibraryModalProps) {
  const [selectedSubject, setSelectedSubject] = useState<OfflineSubjectId | 'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const savedAnswers = useMemo(
    () => (isOpen ? loadCachedTeacherAnswers() : []),
    [isOpen],
  );

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return OFFLINE_STUDY_TOPICS.filter((topic) => {
      if (selectedSubject !== 'all' && selectedSubject !== 'saved' && topic.subject !== selectedSubject) {
        return false;
      }
      if (!q) return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.subjectLabel.toLowerCase().includes(q) ||
        topic.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [selectedSubject, searchQuery]);

  const filteredSaved = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return savedAnswers;
    return savedAnswers.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [savedAnswers, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Offline WBBSE Study Library"
    >
      <div className="w-full max-w-3xl max-h-[88vh] rounded-2xl bg-[var(--app-card-bg)] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                অফলাইন WBBSE পাঠ্যবই ও নোটস
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {isOnline
                  ? 'ইন্টারনেট বা রিচার্জ ছাড়াই পড়ার জন্য সব বিষয় এখানে তৈরি আছে'
                  : 'অফলাইন মোড চালু — রিচার্জ ছাড়াই যেকোনো নোটস পড়ুন ও PDF সেভ করুন'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close offline library"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Subject Filters */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বিষয় খুঁজুন (যেমন: পলাশী, নিউটন, সালোকসংশ্লেষ, Tense, সন্ধি)..."
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl bg-[var(--app-surface-subtle)] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[var(--app-accent)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === 'all'
                  ? 'bg-[var(--app-accent)] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              সব বিষয় ({OFFLINE_STUDY_TOPICS.length})
            </button>

            {savedAnswers.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSubject('saved')}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === 'saved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                সেভ করা উত্তর ({savedAnswers.length})
              </button>
            )}

            {OFFLINE_SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj.id)}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === subj.id
                    ? 'bg-[var(--app-accent)] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {subj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
          {!isOnline && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 px-3.5 py-2.5 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>
                ইন্টারনেট নেই — নিচের যেকোনো বিষয়ে ট্যাপ করলে সাথে সাথে পূর্ণাঙ্গ উত্তর খুলবে। চ্যাটে সরাসরি অঙ্কও কষতে পারবেন (যেমন <code className="font-mono">25*14+30</code> বা <code className="font-mono">x^2-5x+6=0</code>)।
              </span>
            </div>
          )}

          {selectedSubject === 'saved' ? (
            filteredSaved.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                কোনো সেভ করা উত্তর পাওয়া যায়নি।
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredSaved.map((item, idx) => (
                  <button
                    key={`${item.createdAt}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectTopic(
                        item.question,
                        `${item.answer}\n\n---\n*অফলাইন সেভ করা উত্তর (${item.className})*`,
                      );
                      onClose();
                    }}
                    className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[var(--app-surface-subtle)] hover:border-[var(--app-accent)] transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <span>সেভ করা নোটস</span>
                      <span>{item.className}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {item.question}
                    </p>
                  </button>
                ))}
              </div>
            )
          ) : filteredTopics.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              এই নামে কোনো অফলাইন নোটস পাওয়া যায়নি। অন্য শব্দ লিখে খুঁজুন।
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    onSelectTopic(
                      topic.title,
                      `${topic.answer}\n\n---\n*অফলাইন WBBSE পাঠ্যবই নোটস (${topic.subjectLabel} · ${topic.classes}) — ইন্টারনেট ছাড়াই পঠনযোগ্য*`,
                    );
                    onClose();
                  }}
                  className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[var(--app-surface-subtle)] hover:border-[var(--app-accent)] hover:bg-white dark:hover:bg-slate-800 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
                    <span className="text-[var(--app-accent)] dark:text-sky-400">
                      {topic.subjectLabel}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{topic.classes}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {topic.title}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Offline Math Tip */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-3.5 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Calculator className="w-4 h-4 text-[var(--app-accent)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                অফলাইন গণিত সলভার টিপস:
              </p>
              <p className="mt-0.5 leading-relaxed">
                চ্যাটে সরাসরি লিখুন: <code className="font-mono">২৫ × ৪ + ১০</code>,{' '}
                <code className="font-mono">15% of 400</code>,{' '}
                <code className="font-mono">বর্গমূল 144</code>, অথবা{' '}
                <code className="font-mono">x^2 - 5x + 6 = 0</code> — ইন্টারনেট ছাড়াই ধাপে ধাপে উত্তর পাবেন!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
