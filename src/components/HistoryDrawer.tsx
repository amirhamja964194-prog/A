import { useMemo, useState } from 'react';
import { X, Trash2, BookOpen, BookA, ChevronRight, Highlighter } from 'lucide-react';
import type { StudyHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: StudyHistoryItem[];
  onSelect: (item: StudyHistoryItem) => void;
  onClearAll: () => void;
  onRemoveHighlight?: (historyId: string, phrase: string) => void;
}

type HistoryFilter = 'all' | 'highlighted';

function formatTime(ts: number): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(new Date(ts));
  } catch {
    return '';
  }
}

export function HistoryDrawer({
  isOpen,
  onClose,
  items,
  onSelect,
  onClearAll,
  onRemoveHighlight,
}: HistoryDrawerProps) {
  const [filter, setFilter] = useState<HistoryFilter>('all');

  const highlightedCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.type === 'teacher' && item.highlights && item.highlights.length > 0,
      ).length,
    [items],
  );

  const visibleItems = useMemo(() => {
    if (filter === 'highlighted') {
      return items.filter(
        (item) =>
          item.type === 'teacher' && item.highlights && item.highlights.length > 0,
      );
    }
    return items;
  }, [filter, items]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Recent study notes"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Notes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {items.length} saved {items.length === 1 ? 'session' : 'sessions'}
              {highlightedCount > 0 && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span>{highlightedCount} with highlights</span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="min-h-[44px] px-3 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close recent notes"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Segmented Filter Control */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800">
            <div
              className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              role="tablist"
              aria-label="Filter saved notes"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                onClick={() => setFilter('all')}
                className={`flex-1 min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All Notes ({items.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'highlighted'}
                onClick={() => setFilter('highlighted')}
                className={`flex-1 min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                  filter === 'highlighted'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 shrink-0" />
                Highlighted ({highlightedCount})
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {visibleItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {filter === 'highlighted' ? 'No highlighted notes yet' : 'No saved notes yet'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {filter === 'highlighted'
                  ? 'Long-press or select any important sentence in an AI Teacher response and tap Highlight Yellow to save it here.'
                  : 'Questions answered by AI Teacher and words looked up in Dictionary appear here automatically.'}
              </p>
            </div>
          ) : (
            visibleItems.map((item) => {
              const itemHighlights =
                item.type === 'teacher' && item.highlights ? item.highlights : [];

              return (
                <div key={item.id} className="bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-3.5 min-h-[64px]"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                      {item.type === 'teacher' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <BookA className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.type === 'teacher'
                          ? item.question || 'Photo Question'
                          : item.word}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {item.type === 'teacher'
                          ? `${item.className}${item.hasImage ? ' · Photo' : ''}`
                          : 'Dictionary'}
                        {itemHighlights.length > 0 && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span className="text-amber-700 dark:text-yellow-300 font-medium tabular-nums">
                              {itemHighlights.length} {itemHighlights.length === 1 ? 'highlight' : 'highlights'}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">{formatTime(item.createdAt)}</span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  </button>

                  {itemHighlights.length > 0 && (
                    <div className="px-5 pb-4 pl-[68px] space-y-2">
                      {itemHighlights.map((phrase, idx) => (
                        <div
                          key={`${item.id}-hl-${idx}`}
                          className="flex items-start justify-between gap-2 text-xs leading-relaxed"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onSelect(item);
                              onClose();
                            }}
                            className="text-left flex-1 min-w-0"
                          >
                            <mark className="bg-yellow-200/90 dark:bg-yellow-400/30 text-slate-900 dark:text-yellow-100 rounded-xs px-1 py-0.5 box-decoration-clone">
                              {phrase}
                            </mark>
                          </button>
                          {onRemoveHighlight && (
                            <button
                              type="button"
                              onClick={() => onRemoveHighlight(item.id, phrase)}
                              aria-label="Remove saved highlight"
                              title="Remove highlight"
                              className="min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
