import type { ChatMessage, ClassLevel, DictionaryEntry } from '../types';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineHtml(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#0f172a;">$1</strong>')
    .replace(
      /`([^`]+)`/g,
      '<code style="background:#f1f5f9;padding:2px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#1e293b;">$1</code>',
    );
}

function markdownToBlocks(markdown: string): HTMLElement[] {
  const blocks: HTMLElement[] = [];
  const lines = markdown.split(/\r?\n/);
  let listEl: HTMLUListElement | HTMLOListElement | null = null;
  let listOrdered = false;

  const flushList = () => {
    if (listEl) {
      blocks.push(listEl);
      listEl = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      const h4 = document.createElement('h4');
      h4.style.cssText =
        'font-size:15px;font-weight:600;color:#0f172a;margin:14px 0 6px;padding-bottom:4px;border-bottom:1px solid #e2e8f0;';
      h4.innerHTML = formatInlineHtml(line.slice(4));
      blocks.push(h4);
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('# ')) {
      flushList();
      const content = line.startsWith('## ') ? line.slice(3) : line.slice(2);
      const h3 = document.createElement('h3');
      h3.style.cssText =
        'font-size:17px;font-weight:700;color:#0f172a;margin:18px 0 8px;padding-bottom:5px;border-bottom:1px solid #e2e8f0;';
      h3.innerHTML = formatInlineHtml(content);
      blocks.push(h3);
      continue;
    }

    const unorderedMatch = line.match(/^[-*•]\s+(.*)$/);
    if (unorderedMatch) {
      if (!listEl || listOrdered) {
        flushList();
        listEl = document.createElement('ul');
        listEl.style.cssText =
          'margin:6px 0 10px;padding-left:22px;list-style-type:disc;font-size:14px;line-height:1.75;color:#1e293b;';
        listOrdered = false;
      }
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom:5px;';
      li.innerHTML = formatInlineHtml(unorderedMatch[1]);
      listEl.appendChild(li);
      continue;
    }

    const orderedMatch = line.match(/^(?:\d+|[০-৯]+)[.)]\s+(.*)$/);
    if (orderedMatch) {
      if (!listEl || !listOrdered) {
        flushList();
        listEl = document.createElement('ol');
        listEl.style.cssText =
          'margin:6px 0 10px;padding-left:22px;list-style-type:decimal;font-size:14px;line-height:1.75;color:#1e293b;';
        listOrdered = true;
      }
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom:5px;';
      li.innerHTML = formatInlineHtml(orderedMatch[1]);
      listEl.appendChild(li);
      continue;
    }

    flushList();
    const p = document.createElement('p');
    p.style.cssText =
      'margin:0 0 10px;font-size:14px;line-height:1.75;color:#1e293b;';
    p.innerHTML = formatInlineHtml(line);
    blocks.push(p);
  }

  flushList();
  return blocks;
}

export function extractPdfTitle(markdown: string, fallback = 'Wbsec Study Notes'): string {
  const lines = markdown.split(/\r?\n/);
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (trimmed.startsWith('# ')) return trimmed.slice(2).replace(/\*\*/g, '').trim();
    if (trimmed.startsWith('## ')) return trimmed.slice(3).replace(/\*\*/g, '').trim();
  }
  return fallback;
}

export function makeSafeFilename(title: string, fallback = 'wbsec-notes'): string {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${ascii || fallback}.pdf`;
}

async function renderElementsToPaginatedPdf(
  elements: HTMLElement[],
  filename: string,
): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const PAGE_WIDTH_PX = 794;
  const PAGE_HEIGHT_PX = 1122;
  const CONTENT_PADDING_X = 52;
  const CONTENT_TOP_PAD = 44;
  const CONTENT_BOTTOM_PAD = 54;
  const MAX_CONTENT_HEIGHT = PAGE_HEIGHT_PX - CONTENT_TOP_PAD - CONTENT_BOTTOM_PAD;

  // Measure each block accurately in an offscreen container
  const measurer = document.createElement('div');
  measurer.style.cssText = `position:fixed;left:-10000px;top:0;width:${
    PAGE_WIDTH_PX - CONTENT_PADDING_X * 2
  }px;background:#ffffff;color:#0f172a;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;
  document.body.appendChild(measurer);

  const pages: HTMLElement[][] = [[]];
  let currentHeight = 0;

  for (const el of elements) {
    const clone = el.cloneNode(true) as HTMLElement;
    measurer.appendChild(clone);
    const computed = window.getComputedStyle(clone);
    const marginTop = parseFloat(computed.marginTop) || 0;
    const marginBottom = parseFloat(computed.marginBottom) || 0;
    const totalElHeight = clone.offsetHeight + marginTop + marginBottom;
    measurer.removeChild(clone);

    const activePage = pages[pages.length - 1];
    if (activePage.length > 0 && currentHeight + totalElHeight > MAX_CONTENT_HEIGHT) {
      pages.push([el]);
      currentHeight = totalElHeight;
    } else {
      activePage.push(el);
      currentHeight += totalElHeight;
    }
  }

  document.body.removeChild(measurer);

  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro'),
  ]);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const stage = document.createElement('div');
  stage.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_WIDTH_PX}px;background:#ffffff;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;
  document.body.appendChild(stage);

  try {
    for (let i = 0; i < pages.length; i += 1) {
      const pageSheet = document.createElement('div');
      pageSheet.style.cssText = `width:${PAGE_WIDTH_PX}px;height:${PAGE_HEIGHT_PX}px;padding:${CONTENT_TOP_PAD}px ${CONTENT_PADDING_X}px ${CONTENT_BOTTOM_PAD}px;background:#ffffff;color:#0f172a;box-sizing:border-box;position:relative;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;

      for (const block of pages[i]) {
        pageSheet.appendChild(block);
      }

      const footer = document.createElement('div');
      footer.style.cssText = `position:absolute;left:${CONTENT_PADDING_X}px;right:${CONTENT_PADDING_X}px;bottom:22px;padding-top:8px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#64748b;`;
      footer.innerHTML = `<span>Wbsec · Made by Amir</span><span>Page ${i + 1} of ${pages.length}</span>`;
      pageSheet.appendChild(footer);

      stage.innerHTML = '';
      stage.appendChild(pageSheet);

      const canvas = await html2canvas(pageSheet, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.94);
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const nativeBridge =
      typeof window !== 'undefined'
        ? (
            window as unknown as {
              WbsecNative?: { saveBase64File?: (b64: string, name: string) => boolean };
            }
          ).WbsecNative
        : undefined;

    if (nativeBridge?.saveBase64File) {
      try {
        const dataUri = pdf.output('datauristring');
        const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;
        const ok = nativeBridge.saveBase64File(base64, filename);
        if (ok) return;
      } catch {
        // Fallback to standard browser download
      }
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(stage);
  }
}

export async function generateStudyPdf(options: {
  title: string;
  subtitle: string;
  markdown: string;
  filename?: string;
}): Promise<string> {
  const filename = options.filename || makeSafeFilename(options.title);

  const header = document.createElement('div');
  header.style.cssText =
    'margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #0f172a;';
  header.innerHTML = `
    <div style="font-size:11px;font-weight:600;color:#007AFF;margin-bottom:4px;">Wbsec · Made by Amir</div>
    <div style="font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">${escapeHtml(options.title)}</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px;">${escapeHtml(options.subtitle)}</div>
  `;

  const contentBlocks = markdownToBlocks(options.markdown);
  await renderElementsToPaginatedPdf([header, ...contentBlocks], filename);
  return filename;
}

export async function generateConversationPdf(
  messages: ChatMessage[],
  classNameLevel: ClassLevel,
): Promise<string> {
  const filename = makeSafeFilename(`wbsec-${classNameLevel}-notes`);
  const today = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const header = document.createElement('div');
  header.style.cssText =
    'margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #0f172a;';
  header.innerHTML = `
    <div style="font-size:11px;font-weight:600;color:#007AFF;margin-bottom:4px;">Wbsec · Made by Amir</div>
    <div style="font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">AI Teacher Study Notes</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px;">West Bengal Board (WBBSE) · ${escapeHtml(classNameLevel)} · ${escapeHtml(today)}</div>
  `;

  const blocks: HTMLElement[] = [header];

  for (const msg of messages) {
    if (!msg.text.trim()) continue;
    const roleBanner = document.createElement('div');
    roleBanner.style.cssText =
      'margin-top:16px;margin-bottom:6px;font-size:12px;font-weight:700;color:' +
      (msg.role === 'user' ? '#334155' : '#007AFF') +
      ';';
    roleBanner.textContent = msg.role === 'user' ? 'Student Question' : 'Wbsec AI Teacher';
    blocks.push(roleBanner);

    blocks.push(...markdownToBlocks(msg.text));
  }

  await renderElementsToPaginatedPdf(blocks, filename);
  return filename;
}

export async function generateDictionaryPdf(entry: DictionaryEntry): Promise<string> {
  const filename = makeSafeFilename(`wbsec-dictionary-${entry.word}`, 'wbsec-dictionary');

  const markdown = [
    `## ১. উচ্চারণ`,
    entry.pronunciation,
    `## ২. অর্থ`,
    entry.meaning,
    `## ৩. সন্ধি বিচ্ছেদ`,
    entry.sandhiVicched,
    `## ৪. ব্যাকরণগত পরিচয়`,
    entry.grammar,
    `## ৫. বাক্য রচনা`,
    ...entry.exampleSentences.map((s) => `- ${s}`),
  ].join('\n\n');

  return generateStudyPdf({
    title: entry.word,
    subtitle: 'Bengali Dictionary & Grammar Entry · WBBSE',
    markdown,
    filename,
  });
}
