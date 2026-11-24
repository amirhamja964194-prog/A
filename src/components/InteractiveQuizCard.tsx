import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  BookOpenCheck,
} from 'lucide-react';
import type { QuizData } from '../types';

interface InteractiveQuizCardProps {
  quiz: QuizData;
  isBusy?: boolean;
  onRequestNewQuiz?: (topic: string) => void;
}

const BN_NUMS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBnNumber(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => BN_NUMS[Number(d)] ?? d);
}

export const InteractiveQuizCard: React.FC<InteractiveQuizCardProps> = ({
  quiz,
  isBusy = false,
  onRequestNewQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const isBengali = quiz.language !== 'en';
  const optionLabels = isBengali ? ['ক', 'খ', 'গ', 'ঘ'] : ['A', 'B', 'C', 'D'];
  const totalQuestions = quiz.questions.length;
  const currentQ = quiz.questions[currentIndex];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const correctCount = useMemo(
    () =>
      quiz.questions.reduce((acc, q, idx) => {
        return acc + (answers[idx] === q.correctIndex ? 1 : 0);
      }, 0),
    [answers, quiz.questions],
  );

  if (!currentQ || totalQuestions === 0) return null;

  const selectedOption = answers[currentIndex];
  const hasAnsweredCurrent = selectedOption !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && selectedOption === currentQ.correctIndex;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  };

  const fmtNum = (n: number) => (isBengali ? toBnNumber(n) : String(n));

  if (showResult) {
    const remark =
      scorePercent >= 80
        ? isBengali
          ? 'অসাধারণ পারফরম্যান্স! তোমার প্রস্তুতি দারুণ।'
          : 'Outstanding performance! You nailed this topic.'
        : scorePercent >= 50
          ? isBengali
            ? 'খুব ভালো হয়েছে! ভুল উত্তরগুলো দেখে আরেকবার অনুশীলন করো।'
            : 'Good job! Review the missed questions to score 100%.'
          : isBengali
            ? 'চেষ্টা চালিয়ে যাও! নিচের ব্যাখ্যাগুলো পড়ে আবার কুইজ দাও।'
            : 'Keep practicing! Read the explanations below and try again.';

    return (
      <div className="rounded-2xl border border-fuchsia-400/40 dark:border-cyan-400/35 bg-white dark:bg-[#101325]/95 shadow-lg dark:shadow-[0_12px_36px_rgba(6,182,212,0.14)] overflow-hidden max-w-2xl">
        <div className="px-4 sm:px-5 py-4 bg-gradient-to-r from-fuchsia-600/15 via-violet-600/15 to-cyan-500/15 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {quiz.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isBengali ? 'কুইজের ফলাফল সম্পন্ন' : 'Quiz Completed'} · {quiz.className}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-600 to-cyan-600 dark:from-fuchsia-400 dark:to-cyan-300 bg-clip-text text-transparent tabular-nums">
              {fmtNum(correctCount)} / {fmtNum(totalQuestions)} ({fmtNum(scorePercent)}%)
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
            {remark}
          </p>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {quiz.questions.map((q, idx) => {
              const picked = answers[idx];
              const isRight = picked === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-3 text-xs sm:text-sm space-y-1.5 ${
                    isRight
                      ? 'border-emerald-300/70 dark:border-emerald-500/35 bg-emerald-50/70 dark:bg-emerald-950/25'
                      : 'border-rose-300/70 dark:border-rose-500/35 bg-rose-50/70 dark:bg-rose-950/25'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isRight ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <p className="font-semibold text-slate-900 dark:text-white leading-snug">
                      {fmtNum(idx + 1)}. {q.question}
                    </p>
                  </div>
                  <div className="pl-6 space-y-0.5 text-xs">
                    {!isRight && picked !== undefined && (
                      <p className="text-rose-700 dark:text-rose-300">
                        {isBengali ? 'তোমার উত্তর:' : 'Your answer:'}{' '}
                        <span className="font-semibold">
                          ({optionLabels[picked]}) {q.options[picked]}
                        </span>
                      </p>
                    )}
                    <p className="text-emerald-700 dark:text-emerald-300">
                      {isBengali ? 'সঠিক উত্তর:' : 'Correct answer:'}{' '}
                      <span className="font-semibold">
                        ({optionLabels[q.correctIndex]}) {q.options[q.correctIndex]}
                      </span>
                    </p>
                    {q.explanation && (
                      <p className="text-slate-600 dark:text-slate-300 pt-0.5 leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {isBengali ? 'আবার চেষ্টা করো' : 'Retry Quiz'}
            </button>

            {onRequestNewQuiz && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onRequestNewQuiz(quiz.topic)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 hover:brightness-110 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isBengali ? 'এই টপিকে নতুন কুইজ বানাও' : 'New Quiz on This Topic'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-fuchsia-400/40 dark:border-cyan-400/35 bg-white dark:bg-[#101325]/95 shadow-lg dark:shadow-[0_10px_32px_rgba(168,85,247,0.14)] overflow-hidden max-w-2xl">
      {/* Header + Progress */}
      <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-fuchsia-600/12 via-violet-600/12 to-cyan-500/12 border-b border-slate-200 dark:border-white/10 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-sm">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {quiz.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {quiz.topic} · {quiz.className}
                {quiz.source === 'offline' ? ' · অফলাইন' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-bold tabular-nums">
            <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/10 text-slate-800 dark:text-cyan-200 border border-slate-200 dark:border-white/10">
              {isBengali
                ? `প্রশ্ন ${fmtNum(currentIndex + 1)} / ${fmtNum(totalQuestions)}`
                : `Q ${currentIndex + 1} / ${totalQuestions}`}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              {isBengali
                ? `স্কোর: ${fmtNum(correctCount)}/${fmtNum(answeredCount)}`
                : `Score: ${correctCount}/${answeredCount}`}
            </span>
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question & 4 Options */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-[15px] sm:text-[16.5px] font-bold text-slate-900 dark:text-white leading-relaxed">
          {fmtNum(currentIndex + 1)}. {currentQ.question}
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {currentQ.options.map((optionText, optIdx) => {
            const isPicked = selectedOption === optIdx;
            const isCorrectOpt = optIdx === currentQ.correctIndex;

            let optionClasses =
              'border-slate-200 dark:border-white/12 bg-slate-50/70 dark:bg-[#171a2f]/90 hover:border-fuchsia-400 dark:hover:border-cyan-400/70 hover:bg-white dark:hover:bg-[#1d213b] text-slate-800 dark:text-slate-100';
            let badgeClasses =
              'bg-white dark:bg-white/10 text-slate-700 dark:text-cyan-200 border border-slate-200 dark:border-white/15';

            if (hasAnsweredCurrent) {
              if (isCorrectOpt) {
                optionClasses =
                  'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/55 text-emerald-950 dark:text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.2)]';
                badgeClasses =
                  'bg-emerald-500 text-white border border-emerald-400';
              } else if (isPicked) {
                optionClasses =
                  'border-rose-500 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/55 text-rose-950 dark:text-rose-100';
                badgeClasses =
                  'bg-rose-500 text-white border border-rose-400';
              } else {
                optionClasses =
                  'border-slate-200/70 dark:border-white/8 bg-slate-50/40 dark:bg-[#131628]/60 text-slate-500 dark:text-slate-400 opacity-75';
              }
            }

            return (
              <button
                key={`${currentQ.id}-opt-${optIdx}`}
                type="button"
                disabled={hasAnsweredCurrent}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center gap-3 active:scale-[0.99] disabled:cursor-default ${optionClasses}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors ${badgeClasses}`}
                >
                  {optionLabels[optIdx]}
                </span>
                <span className="flex-1 text-sm sm:text-[15px] font-medium leading-snug">
                  {optionText}
                </span>
                {hasAnsweredCurrent && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {hasAnsweredCurrent && isPicked && !isCorrectOpt && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Feedback */}
        {hasAnsweredCurrent && (
          <div
            className={`rounded-xl border px-3.5 py-3 text-xs sm:text-sm space-y-1 ${
              isCurrentCorrect
                ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/35 text-emerald-900 dark:text-emerald-100'
                : 'border-amber-300 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/35 text-amber-950 dark:text-amber-100'
            }`}
          >
            <p className="font-bold flex items-center gap-1.5">
              <BookOpenCheck className="w-4 h-4 shrink-0" />
              {isCurrentCorrect
                ? isBengali
                  ? 'সঠিক উত্তর! খুব ভালো হয়েছে।'
                  : 'Correct! Great job.'
                : isBengali
                  ? `ভুল হয়েছে — সঠিক উত্তর হলো (${optionLabels[currentQ.correctIndex]}) ${currentQ.options[currentQ.correctIndex]}`
                  : `Incorrect — Correct answer is (${optionLabels[currentQ.correctIndex]}) ${currentQ.options[currentQ.correctIndex]}`}
            </p>
            {currentQ.explanation && (
              <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>
            )}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {isBengali ? 'আগের' : 'Prev'}
            </button>

            <div className="hidden sm:flex items-center gap-1 pl-1">
              {quiz.questions.map((q, idx) => {
                const ans = answers[idx];
                const isActive = idx === currentIndex;
                let dotClass = 'bg-slate-200 dark:bg-white/15 text-slate-600 dark:text-slate-300';
                if (ans !== undefined) {
                  dotClass =
                    ans === q.correctIndex
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white';
                }
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all ${dotClass} ${
                      isActive ? 'ring-2 ring-cyan-400 ring-offset-1 dark:ring-offset-[#101325]' : ''
                    }`}
                  >
                    {fmtNum(idx + 1)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all ${
              hasAnsweredCurrent
                ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-md hover:brightness-110'
                : 'border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            {isLastQuestion ? (
              <>
                <Trophy className="w-4 h-4" />
                {isBengali ? 'ফলাফল দেখুন' : 'View Result'}
              </>
            ) : (
              <>
                {hasAnsweredCurrent
                  ? isBengali
                    ? 'পরের প্রশ্ন'
                    : 'Next Question'
                  : isBengali
                    ? 'স্কিপ করুন'
                    : 'Skip'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
