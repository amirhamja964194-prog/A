import React from 'react';
import { RefreshCw, ArrowUpCircle, X, Loader2 } from 'lucide-react';
import type { AppProgramConfig } from '../types';

interface AppUpdateModalProps {
  isOpen: boolean;
  currentVersion: number;
  pendingConfig: AppProgramConfig | null;
  hasSwUpdate: boolean;
  isApplying: boolean;
  onConfirmUpdate: () => void;
  onDismiss: () => void;
}

export function AppUpdateModal({
  isOpen,
  currentVersion,
  pendingConfig,
  hasSwUpdate,
  isApplying,
  onConfirmUpdate,
  onDismiss,
}: AppUpdateModalProps) {
  if (!isOpen) return null;

  const targetVersion = pendingConfig?.configVersion ?? currentVersion;
  const updateTitle =
    pendingConfig?.updateTitle?.trim() || 'নতুন অ্যাপ আপডেট এসেছে (App Update)';
  const rawNotes = pendingConfig?.updateNotes?.trim() || '';
  const noteLines = rawNotes
    ? rawNotes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [
        hasSwUpdate
          ? 'নতুন Neon Dark ডিজাইন, অ্যানিমেটেড AI Orb এবং 100 MB / 250 MB / 500 MB অফলাইন AI প্যাক আপডেট রেডি হয়ে গেছে। একবার আপডেট করলেই নতুন ভার্সন চালু হবে।'
          : 'অ্যাডমিন অ্যাপে নতুন আপডেট পাবলিশ করেছেন।',
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="App Update Available"
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0c0e1c] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center shrink-0">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {updateTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                v1.0.{currentVersion} → v1.0.{targetVersion}
              </p>
            </div>
          </div>

          {!isApplying && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Remind me later"
              className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              এই আপডেটে কী নতুন এসেছে:
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5 max-h-52 overflow-y-auto">
              {noteLines.map((line, index) => (
                <p
                  key={index}
                  className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            নতুন কোনো লিংকের দরকার নেই — নিচের Update বাটনে ক্লিক করলেই আপনার পুরোনো লিংকে অ্যাপটি অটোমেটিক আপডেট হয়ে রিস্টার্ট হবে।
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onDismiss}
              disabled={isApplying}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              পরে করব (Later)
            </button>
            <button
              type="button"
              onClick={onConfirmUpdate}
              disabled={isApplying}
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Update &amp; Restart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
