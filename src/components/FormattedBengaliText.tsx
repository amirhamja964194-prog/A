import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Highlighter, Trash2, X } from 'lucide-react';

interface FormattedBengaliTextProps {
  text: string;
  highlights?: string[];
  interactive?: boolean;
  onAddHighlight?: (phrase: string) => void;
  onRemoveHighlight?: (phrase: string) => void;
}

interface InlineSegment {
  text: string;
  kind: 'text' | 'bold' | 'code';
}

interface HighlightInterval {
  start: number;
  end: number;
  phrase: string;
}

interface FloatingBarState {
  phrase: string;
  mode: 'add' | 'remove';
  x: number;
  y: number;
  placeBelow: boolean;
}

function tokenizeInline(line: string): InlineSegment[] {
  const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  const segments: InlineSegment[] = [];

  for (const token of tokens) {
    if (!token) continue;
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      segments.push({ text: token.slice(2, -2), kind: 'bold' });
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      segments.push({ text: token.slice(1, -1), kind: 'code' });
    } else {
      segments.push({ text: token, kind: 'text' });
    }
  }
  return segments;
}

function findHighlightIntervals(plainText: string, highlights: string[]): HighlightInterval[] {
  if (!plainText || highlights.length === 0) return [];
  const sortedPhrases = [...highlights]
    .map((h) => h.trim())
    .filter((h) => h.length >= 2)
    .sort((a, b) => b.length - a.length);

  const candidates: HighlightInterval[] = [];
  for (const phrase of sortedPhrases) {
    let searchFrom = 0;
    while (searchFrom < plainText.length) {
      const idx = plainText.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      candidates.push({ start: idx, end: idx + phrase.length, phrase });
      searchFrom = idx + phrase.length;
    }
  }

  candidates.sort((a, b) => a.start - b.start || b.end - a.end);

  const merged: HighlightInterval[] = [];
  for (const item of candidates) {
    const last = merged[merged.length - 1];
    if (!last || item.start >= last.end) {
      merged.push(item);
    }
  }
  return merged;
}

function extractSentenceAtPoint(
  clientX: number,
  clientY: number,
  fallbackEl: HTMLElement | null,
): string {
  let targetText = '';
  let offset = 0;

  const docWithCaret = document as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };

  if (typeof docWithCaret.caretPositionFromPoint === 'function') {
    const pos = docWithCaret.caretPositionFromPoint(clientX, clientY);
    if (pos && pos.offsetNode.nodeType === Node.TEXT_NODE) {
      const parentBlock = pos.offsetNode.parentElement?.closest('p, li, h3, h4');
      if (parentBlock) {
        targetText = parentBlock.textContent || '';
        const preRange = document.createRange();
        preRange.selectNodeContents(parentBlock);
        preRange.setEnd(pos.offsetNode, pos.offset);
        offset = preRange.toString().length;
      }
    }
  } else if (typeof document.caretRangeFromPoint === 'function') {
    const range = document.caretRangeFromPoint(clientX, clientY);
    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
      const parentBlock = range.startContainer.parentElement?.closest('p, li, h3, h4');
      if (parentBlock) {
        targetText = parentBlock.textContent || '';
        const preRange = document.createRange();
        preRange.selectNodeContents(parentBlock);
        preRange.setEnd(range.startContainer, range.startOffset);
        offset = preRange.toString().length;
      }
    }
  }

  if (!targetText && fallbackEl) {
    const block = fallbackEl.closest('p, li, h3, h4');
    targetText = (block || fallbackEl).textContent || '';
    offset = Math.floor(targetText.length / 2);
  }

  const trimmed = targetText.trim();
  if (!trimmed) return '';

  const clampedOffset = Math.max(0, Math.min(offset, targetText.length));
  const delimiters = /[।.?!\n]/;

  let start = clampedOffset;
  while (start > 0 && !delimiters.test(targetText[start - 1])) {
    start--;
  }

  let end = clampedOffset;
  while (end < targetText.length && !delimiters.test(targetText[end])) {
    end++;
  }
  if (end < targetText.length && /[।.?!]/.test(targetText[end])) {
    end++;
  }

  const sentence = targetText.slice(start, end).trim();
  return sentence.length >= 2 ? sentence : trimmed;
}

function renderInlineWithHighlights(
  line: string,
  highlights: string[],
  onClickMark?: (phrase: string, rect: DOMRect) => void,
): React.ReactNode[] {
  const segments = tokenizeInline(line);
  if (segments.length === 0) return [];

  const plainLine = segments.map((s) => s.text).join('');
  const intervals = findHighlightIntervals(plainLine, highlights);

  if (intervals.length === 0) {
    return segments.map((seg, idx) => {
      if (seg.kind === 'bold') {
        return (
          <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
            {seg.text}
          </strong>
        );
      }
      if (seg.kind === 'code') {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[0.9em]"
          >
            {seg.text}
          </code>
        );
      }
      return <React.Fragment key={idx}>{seg.text}</React.Fragment>;
    });
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let intervalIdx = 0;

  segments.forEach((seg, segIdx) => {
    const segStart = cursor;
    const segEnd = segStart + seg.text.length;
    let localPos = segStart;

    const wrapKind = (content: React.ReactNode, key: string) => {
      if (seg.kind === 'bold') {
        return (
          <strong key={key} className="font-semibold text-slate-900 dark:text-white">
            {content}
          </strong>
        );
      }
      if (seg.kind === 'code') {
        return (
          <code
            key={key}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[0.9em]"
          >
            {content}
          </code>
        );
      }
      return <React.Fragment key={key}>{content}</React.Fragment>;
    };

    while (intervalIdx < intervals.length && intervals[intervalIdx].end <= localPos) {
      intervalIdx++;
    }

    while (localPos < segEnd) {
      const activeInterval = intervals[intervalIdx];
      if (!activeInterval || activeInterval.start >= segEnd) {
        const tailText = seg.text.slice(localPos - segStart);
        if (tailText) {
          nodes.push(wrapKind(tailText, `${segIdx}-tail-${localPos}`));
        }
        localPos = segEnd;
        break;
      }

      if (localPos < activeInterval.start) {
        const beforeText = seg.text.slice(localPos - segStart, activeInterval.start - segStart);
        if (beforeText) {
          nodes.push(wrapKind(beforeText, `${segIdx}-pre-${localPos}`));
        }
        localPos = activeInterval.start;
      }

      const markEnd = Math.min(segEnd, activeInterval.end);
      const highlightedText = seg.text.slice(localPos - segStart, markEnd - segStart);
      if (highlightedText) {
        const phraseToRemove = activeInterval.phrase;
        nodes.push(
          wrapKind(
            <mark
              data-highlight={phraseToRemove}
              onClick={(e) => {
                if (!onClickMark) return;
                e.stopPropagation();
                const sel = window.getSelection()?.toString().trim();
                if (sel && sel.length >= 2) return;
                onClickMark(phraseToRemove, e.currentTarget.getBoundingClientRect());
              }}
              title="Tap to remove highlight"
              className="bg-yellow-200/95 dark:bg-yellow-400/35 text-slate-900 dark:text-yellow-100 rounded-xs px-0.5 box-decoration-clone cursor-pointer transition-colors hover:bg-yellow-300 dark:hover:bg-yellow-400/50"
            >
              {highlightedText}
            </mark>,
            `${segIdx}-mark-${localPos}`,
          ),
        );
      }
      localPos = markEnd;
      if (localPos >= activeInterval.end) {
        intervalIdx++;
      }
    }

    cursor = segEnd;
  });

  return nodes;
}

export function FormattedBengaliText({
  text,
  highlights = [],
  interactive = false,
  onAddHighlight,
  onRemoveHighlight,
}: FormattedBengaliTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const [floatingBar, setFloatingBar] = useState<FloatingBarState | null>(null);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const showBarFromRect = useCallback(
    (phrase: string, mode: 'add' | 'remove', rect: DOMRect) => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

      const rawX = rect.left + rect.width / 2 - containerRect.left;
      const clampedX = Math.max(115, Math.min(rawX, Math.max(115, containerRect.width - 115)));

      const spaceAbove = rect.top;
      const placeBelow = isCoarsePointer || spaceAbove < 90;
      const rawY = placeBelow
        ? rect.bottom - containerRect.top + 8
        : rect.top - containerRect.top - 8;

      setFloatingBar({
        phrase,
        mode,
        x: clampedX,
        y: rawY,
        placeBelow,
      });
    },
    [],
  );

  const inspectActiveSelection = useCallback(() => {
    if (!interactive || !onAddHighlight) return;
    const container = containerRef.current;
    if (!container) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

    const anchorNode = sel.anchorNode;
    const focusNode = sel.focusNode;
    if (
      !anchorNode ||
      !focusNode ||
      !container.contains(anchorNode) ||
      !container.contains(focusNode)
    ) {
      return;
    }

    const selectedText = sel.toString().trim();
    if (selectedText.length < 2) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const alreadyHighlighted = highlights.some(
      (h) => h.trim() === selectedText || (h.includes(selectedText) && selectedText.length >= 4),
    );
    const matchingHighlight = alreadyHighlighted
      ? highlights.find((h) => h.trim() === selectedText || h.includes(selectedText)) ||
        selectedText
      : selectedText;

    showBarFromRect(
      matchingHighlight,
      alreadyHighlighted ? 'remove' : 'add',
      rect,
    );
  }, [highlights, interactive, onAddHighlight, showBarFromRect]);

  useEffect(() => {
    if (!interactive) return;

    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setFloatingBar((prev) => (prev?.mode === 'add' ? null : prev));
        return;
      }
      inspectActiveSelection();
    };

    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setFloatingBar(null);
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('pointerdown', onDocPointerDown);
      clearLongPressTimer();
    };
  }, [clearLongPressTimer, inspectActiveSelection, interactive]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !onAddHighlight) return;
    if ((e.target as HTMLElement | null)?.closest('[data-highlight-toolbar="true"]')) {
      return;
    }

    clearLongPressTimer();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const targetEl = e.target as HTMLElement | null;
    pointerStartRef.current = { x: clientX, y: clientY };

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null;
      const sel = window.getSelection();
      const selected = sel?.toString().trim() || '';
      if (selected.length >= 2 && sel && sel.rangeCount > 0) {
        inspectActiveSelection();
        return;
      }

      const sentence = extractSentenceAtPoint(clientX, clientY, targetEl);
      if (sentence.length >= 2) {
        const existing = highlights.find(
          (h) => h.trim() === sentence || sentence.includes(h.trim()),
        );
        const anchorRect = new DOMRect(clientX - 40, clientY - 12, 80, 24);
        showBarFromRect(existing || sentence, existing ? 'remove' : 'add', anchorRect);
      }
    }, 460);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 10 || dy > 10) {
      clearLongPressTimer();
    }
  };

  const handlePointerUpOrCancel = () => {
    clearLongPressTimer();
    pointerStartRef.current = null;
    window.setTimeout(() => {
      inspectActiveSelection();
    }, 20);
  };

  const handleMarkClick = useCallback(
    (phrase: string, rect: DOMRect) => {
      if (!interactive || !onRemoveHighlight) return;
      showBarFromRect(phrase, 'remove', rect);
    },
    [interactive, onRemoveHighlight, showBarFromRect],
  );

  const handleConfirmHighlight = () => {
    if (!floatingBar) return;
    if (floatingBar.mode === 'add') {
      const parts = floatingBar.phrase
        .split(/\r?\n/)
        .map((p) => p.trim())
        .filter((p) => p.length >= 2);
      parts.forEach((part) => onAddHighlight?.(part));
    } else {
      onRemoveHighlight?.(floatingBar.phrase);
    }
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      // Ignore selection clear errors
    }
    setFloatingBar(null);
  };

  const elements = useMemo(() => {
    const lines = text.split(/\r?\n/);
    const rendered: React.ReactNode[] = [];
    let listBuffer: { ordered: boolean; items: string[] } | null = null;
    const markHandler = interactive ? handleMarkClick : undefined;

    const flushList = (keyPrefix: string) => {
      if (!listBuffer) return;
      if (listBuffer.ordered) {
        rendered.push(
          <ol
            key={`${keyPrefix}-ol`}
            className="list-decimal pl-6 space-y-2 text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200"
          >
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInlineWithHighlights(item, highlights, markHandler)}
              </li>
            ))}
          </ol>,
        );
      } else {
        rendered.push(
          <ul
            key={`${keyPrefix}-ul`}
            className="list-disc pl-6 space-y-2 text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200"
          >
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInlineWithHighlights(item, highlights, markHandler)}
              </li>
            ))}
          </ul>,
        );
      }
      listBuffer = null;
    };

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();

      if (!line) {
        flushList(`line-${index}`);
        return;
      }

      if (line.startsWith('### ')) {
        flushList(`line-${index}`);
        rendered.push(
          <h4
            key={`h4-${index}`}
            className="text-base font-semibold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-100 dark:border-slate-800"
          >
            {renderInlineWithHighlights(line.slice(4), highlights, markHandler)}
          </h4>,
        );
        return;
      }

      if (line.startsWith('## ') || line.startsWith('# ')) {
        flushList(`line-${index}`);
        const content = line.startsWith('## ') ? line.slice(3) : line.slice(2);
        rendered.push(
          <h3
            key={`h3-${index}`}
            className="text-lg font-semibold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-100 dark:border-slate-800"
          >
            {renderInlineWithHighlights(content, highlights, markHandler)}
          </h3>,
        );
        return;
      }

      const unorderedMatch = line.match(/^[-*•]\s+(.*)$/);
      if (unorderedMatch) {
        if (!listBuffer || listBuffer.ordered) {
          flushList(`line-${index}`);
          listBuffer = { ordered: false, items: [] };
        }
        listBuffer.items.push(unorderedMatch[1]);
        return;
      }

      const orderedMatch = line.match(/^(?:\d+|[০-৯]+)[.)]\s+(.*)$/);
      if (orderedMatch) {
        if (!listBuffer || !listBuffer.ordered) {
          flushList(`line-${index}`);
          listBuffer = { ordered: true, items: [] };
        }
        listBuffer.items.push(orderedMatch[1]);
        return;
      }

      flushList(`line-${index}`);
      rendered.push(
        <p key={`p-${index}`} className="text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200">
          {renderInlineWithHighlights(line, highlights, markHandler)}
        </p>,
      );
    });

    flushList('end');
    return rendered;
  }, [handleMarkClick, highlights, interactive, text]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className="relative space-y-3.5 w-full select-text"
    >
      {elements}

      {interactive && floatingBar && (
        <div
          data-highlight-toolbar="true"
          style={{
            left: `${floatingBar.x}px`,
            top: `${floatingBar.y}px`,
            transform: floatingBar.placeBelow
              ? 'translate(-50%, 0)'
              : 'translate(-50%, -100%)',
          }}
          className="absolute z-30 max-w-[min(300px,calc(100vw-2rem))] rounded-xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 shadow-xl p-1.5 flex items-center gap-1.5"
        >
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleConfirmHighlight}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              floatingBar.mode === 'add'
                ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300'
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
          >
            {floatingBar.mode === 'add' ? (
              <>
                <Highlighter className="w-3.5 h-3.5 shrink-0" />
                Highlight Yellow
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                Remove Highlight
              </>
            )}
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              try {
                window.getSelection()?.removeAllRanges();
              } catch {
                // Ignore
              }
              setFloatingBar(null);
            }}
            aria-label="Cancel highlight"
            className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
