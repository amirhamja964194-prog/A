import type { ClassLevel, DictionaryEntry } from '../types';
import {
  OFFLINE_AI_PACKS,
  type OfflineAiPackTier,
  type OfflineAiState,
  type OfflineChatTurn,
} from './offlineAiTypes';

const PACK_META_STORAGE_KEY = 'wbsec_offline_ai_pack_meta_v1';

interface StoredPackMeta {
  installedTier: OfflineAiPackTier;
  ocrCached: boolean;
  lastUpdatedAt: number;
}

function readStoredPackMeta(): StoredPackMeta | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(PACK_META_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPackMeta>;
    if (
      parsed.installedTier === 'class8' ||
      parsed.installedTier === 'standard' ||
      parsed.installedTier === 'pro'
    ) {
      return {
        installedTier: parsed.installedTier,
        ocrCached: Boolean(parsed.ocrCached),
        lastUpdatedAt: typeof parsed.lastUpdatedAt === 'number' ? parsed.lastUpdatedAt : Date.now(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredPackMeta(meta: StoredPackMeta | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (!meta) {
      localStorage.removeItem(PACK_META_STORAGE_KEY);
    } else {
      localStorage.setItem(PACK_META_STORAGE_KEY, JSON.stringify(meta));
    }
  } catch {
    // Storage blocked fallback
  }
}

export function isOfflineAiCacheName(cacheName: string): boolean {
  const lower = cacheName.toLowerCase();
  return (
    lower.includes('transformers') ||
    lower.includes('wbsec-offline-ai') ||
    lower.includes('huggingface') ||
    lower.includes('jsdelivr-wasm') ||
    lower.includes('tessdata')
  );
}

async function measureOfflineAiCacheBytes(): Promise<{
  cachedBytes: number;
  storageQuotaBytes: number;
  storageUsageBytes: number;
}> {
  let cachedBytes = 0;
  let storageQuotaBytes = 0;
  let storageUsageBytes = 0;

  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      storageQuotaBytes = est.quota ?? 0;
      storageUsageBytes = est.usage ?? 0;
    }
  } catch {
    // Ignore estimate failure
  }

  try {
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      for (const name of keys) {
        if (!isOfflineAiCacheName(name)) continue;
        const cache = await caches.open(name);
        const requests = await cache.keys();
        for (const req of requests) {
          const res = await cache.match(req);
          if (!res) continue;
          const cl = res.headers.get('content-length');
          if (cl) {
            const parsed = parseInt(cl, 10);
            if (Number.isFinite(parsed) && parsed > 0) {
              cachedBytes += parsed;
              continue;
            }
          }
          try {
            const blob = await res.clone().blob();
            cachedBytes += blob.size;
          } catch {
            // Skip opaque response if unreadable
          }
        }
      }
    }
  } catch {
    // Ignore cache inspection error
  }

  if (cachedBytes === 0 && storageUsageBytes > 20 * 1024 * 1024) {
    cachedBytes = storageUsageBytes;
  }

  return { cachedBytes, storageQuotaBytes, storageUsageBytes };
}

type PendingTask = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  onChunk?: (chunk: string) => void;
};

type StateListener = (state: OfflineAiState) => void;

const initialMeta = readStoredPackMeta();

let state: OfflineAiState = {
  status: initialMeta ? 'ready' : 'not-downloaded',
  installedTier: initialMeta?.installedTier ?? null,
  activeTier: initialMeta?.installedTier ?? null,
  llmLoaded: false,
  whisperLoaded: false,
  ocrCached: initialMeta?.ocrCached ?? false,
  deviceBackend: null,
  cachedBytes: 0,
  storageQuotaBytes: 0,
  storageUsageBytes: 0,
  progress: {
    stage: 'idle',
    stageLabelBn: '',
    file: '',
    percent: 0,
    loadedBytes: 0,
    totalBytes: 0,
  },
  error: null,
  lastUpdatedAt: initialMeta?.lastUpdatedAt ?? null,
};

const listeners = new Set<StateListener>();
let workerInstance: Worker | null = null;
const pendingTasks = new Map<string, PendingTask>();
let activeDownloadPromise: Promise<void> | null = null;

function notify(): void {
  const snapshot = { ...state, progress: { ...state.progress } };
  for (const listener of listeners) {
    listener(snapshot);
  }
}

function updateState(patch: Partial<OfflineAiState>): void {
  state = { ...state, ...patch };
  notify();
}

function ensureWorker(): Worker {
  if (workerInstance) return workerInstance;

  const worker = new Worker(new URL('./offlineAiWorker.ts', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event: MessageEvent) => {
    const data = event.data as {
      id?: string;
      type: string;
      stage?: 'llm' | 'whisper';
      stageLabelBn?: string;
      file?: string;
      percent?: number;
      loadedBytes?: number;
      totalBytes?: number;
      text?: string;
      tier?: OfflineAiPackTier;
      backend?: 'webgpu' | 'wasm';
      llmLoaded?: boolean;
      whisperLoaded?: boolean;
      error?: string;
    };

    if (!data) return;

    if (data.type === 'progress') {
      updateState({
        progress: {
          stage: data.stage ?? 'llm',
          stageLabelBn: data.stageLabelBn ?? 'ডাউনলোড হচ্ছে...',
          file: data.file ?? '',
          percent: data.percent ?? 0,
          loadedBytes: data.loadedBytes ?? 0,
          totalBytes: data.totalBytes ?? 0,
        },
      });
      return;
    }

    if (data.type === 'chunk' && data.id) {
      const task = pendingTasks.get(data.id);
      if (task?.onChunk && typeof data.text === 'string') {
        task.onChunk(data.text);
      }
      return;
    }

    if (data.id && pendingTasks.has(data.id)) {
      const task = pendingTasks.get(data.id)!;
      pendingTasks.delete(data.id);

      if (data.type === 'error') {
        task.reject(new Error(data.error || 'Offline AI error'));
      } else {
        if (data.backend) {
          updateState({ deviceBackend: data.backend });
        }
        task.resolve(data);
      }
    }
  };

  worker.onerror = (err) => {
    const message = err.message || 'Offline AI worker crashed.';
    for (const [, task] of pendingTasks) {
      task.reject(new Error(message));
    }
    pendingTasks.clear();
    workerInstance = null;
    updateState({
      status: state.installedTier ? 'ready' : 'error',
      llmLoaded: false,
      whisperLoaded: false,
      error: message,
    });
  };

  workerInstance = worker;
  return worker;
}

function sendWorkerRequest<T = { text?: string; backend?: 'webgpu' | 'wasm' }>(
  payload: Record<string, unknown>,
  options?: {
    onChunk?: (chunk: string) => void;
    transfer?: Transferable[];
  },
): Promise<T> {
  const worker = ensureWorker();
  const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return new Promise<T>((resolve, reject) => {
    pendingTasks.set(id, {
      resolve: resolve as (v: unknown) => void,
      reject,
      onChunk: options?.onChunk,
    });
    if (options?.transfer && options.transfer.length > 0) {
      worker.postMessage({ ...payload, id }, options.transfer);
    } else {
      worker.postMessage({ ...payload, id });
    }
  });
}

export function getOfflineAiState(): OfflineAiState {
  return { ...state, progress: { ...state.progress } };
}

export function subscribeOfflineAiState(listener: StateListener): () => void {
  listeners.add(listener);
  listener(getOfflineAiState());
  return () => {
    listeners.delete(listener);
  };
}

export function isOfflineAiPackInstalled(): boolean {
  return Boolean(state.installedTier);
}

export function getInstalledOfflinePack() {
  return state.installedTier ? OFFLINE_AI_PACKS[state.installedTier] : null;
}

export function isOfflineFeatureAllowed(
  feature: 'message' | 'voice' | 'pdf' | 'live' | 'quiz' | 'camera' | 'dictionary',
): boolean {
  const pack = getInstalledOfflinePack();
  if (!pack) return true;
  switch (feature) {
    case 'message':
      return pack.capabilities.allowMessage;
    case 'voice':
      return pack.capabilities.allowVoice;
    case 'pdf':
      return pack.capabilities.allowPdf;
    case 'live':
      return pack.capabilities.allowLive;
    case 'quiz':
      return pack.capabilities.allowQuiz;
    case 'camera':
      return pack.capabilities.allowCamera;
    case 'dictionary':
      return pack.capabilities.allowDictionary;
  }
}

export async function refreshOfflineAiStorageInfo(): Promise<void> {
  const info = await measureOfflineAiCacheBytes();
  updateState({
    cachedBytes: info.cachedBytes,
    storageQuotaBytes: info.storageQuotaBytes,
    storageUsageBytes: info.storageUsageBytes,
  });
}

export async function downloadOfflineAiPack(tier: OfflineAiPackTier): Promise<void> {
  if (activeDownloadPromise) return activeDownloadPromise;

  const pack = OFFLINE_AI_PACKS[tier];

  activeDownloadPromise = (async () => {
    updateState({
      status: 'downloading',
      activeTier: tier,
      error: null,
      progress: {
        stage: 'llm',
        stageLabelBn: `${pack.nameBn} ডাউনলোড শুরু হচ্ছে (${pack.sizeLabel})...`,
        file: '',
        percent: 1,
        loadedBytes: 0,
        totalBytes: pack.approxBytes,
      },
    });

    try {
      // Request persistent browser storage so Android/Chrome never evicts the student's 1GB AI pack
      if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
        await navigator.storage.persist().catch(() => false);
      }

      const result = await sendWorkerRequest<{
        backend?: 'webgpu' | 'wasm';
        llmLoaded?: boolean;
        whisperLoaded?: boolean;
      }>({
        type: 'load-pack',
        tier,
        localOnly: false,
        loadWhisper: true,
      });

      // Pre-cache Bengali + English offline book OCR engine only for packs that include Camera/OCR (500MB & 250MB)
      let ocrCached = pack.includeOcr ? state.ocrCached : false;
      if (pack.includeOcr) {
        try {
          updateState({
            progress: {
              stage: 'ocr',
              stageLabelBn: 'অফলাইন বইয়ের ছবি পড়া (OCR) সেভ হচ্ছে...',
              file: 'ben+eng.traineddata',
              percent: 96,
              loadedBytes: pack.approxBytes,
              totalBytes: pack.approxBytes,
            },
          });
          const createWorker = await loadTesseractCreateWorker();
          if (createWorker) {
            const ocrWorker = await createWorker(['ben', 'eng']);
            await ocrWorker.terminate();
            ocrCached = true;
          }
        } catch {
          // OCR is optional bonus — don't fail the main AI + Voice pack if OCR CDN is slow
        }
      }

      const now = Date.now();
      writeStoredPackMeta({
        installedTier: tier,
        ocrCached,
        lastUpdatedAt: now,
      });

      const storageInfo = await measureOfflineAiCacheBytes();

      updateState({
        status: 'ready',
        installedTier: tier,
        activeTier: tier,
        llmLoaded: Boolean(result.llmLoaded ?? true),
        whisperLoaded: Boolean(result.whisperLoaded ?? true),
        ocrCached,
        deviceBackend: result.backend ?? state.deviceBackend ?? 'wasm',
        cachedBytes: storageInfo.cachedBytes,
        storageQuotaBytes: storageInfo.storageQuotaBytes,
        storageUsageBytes: storageInfo.storageUsageBytes,
        lastUpdatedAt: now,
        error: null,
        progress: {
          stage: 'idle',
          stageLabelBn: 'সম্পূর্ণ ডাউনলোড সম্পন্ন!',
          file: '',
          percent: 100,
          loadedBytes: storageInfo.cachedBytes,
          totalBytes: storageInfo.cachedBytes,
        },
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'অফলাইন AI প্যাক ডাউনলোড করা যায়নি। ইন্টারনেট ও ফোনের খালি স্টোরেজ চেক করে আবার চেষ্টা করুন।';
      updateState({
        status: state.installedTier ? 'ready' : 'error',
        error: msg,
        progress: {
          stage: 'idle',
          stageLabelBn: '',
          file: '',
          percent: 0,
          loadedBytes: 0,
          totalBytes: 0,
        },
      });
      throw err;
    } finally {
      activeDownloadPromise = null;
    }
  })();

  return activeDownloadPromise;
}

export async function deleteOfflineAiPack(): Promise<void> {
  if (workerInstance) {
    try {
      await sendWorkerRequest({ type: 'unload' });
    } catch {
      // Ignore
    }
    workerInstance.terminate();
    workerInstance = null;
  }

  try {
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => isOfflineAiCacheName(k)).map((k) => caches.delete(k)),
      );
    }
  } catch {
    // Ignore cache clear failure
  }

  writeStoredPackMeta(null);
  const storageInfo = await measureOfflineAiCacheBytes();

  updateState({
    status: 'not-downloaded',
    installedTier: null,
    activeTier: null,
    llmLoaded: false,
    whisperLoaded: false,
    ocrCached: false,
    deviceBackend: null,
    cachedBytes: storageInfo.cachedBytes,
    storageQuotaBytes: storageInfo.storageQuotaBytes,
    storageUsageBytes: storageInfo.storageUsageBytes,
    lastUpdatedAt: null,
    error: null,
    progress: {
      stage: 'idle',
      stageLabelBn: '',
      file: '',
      percent: 0,
      loadedBytes: 0,
      totalBytes: 0,
    },
  });
}

export function abortOfflineAiGeneration(): void {
  if (workerInstance) {
    workerInstance.postMessage({ type: 'abort' });
  }
}

export async function streamOfflineTeacherChat(options: {
  className: ClassLevel;
  messages: OfflineChatTurn[];
  studentName?: string;
  contextHint?: string;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const tier = state.installedTier;
  if (!tier) {
    throw new Error('Offline AI Pack is not installed yet.');
  }

  const onAbort = () => abortOfflineAiGeneration();
  options.signal?.addEventListener('abort', onAbort, { once: true });

  try {
    if (!state.llmLoaded) {
      updateState({ status: 'loading' });
    }
      const pack = OFFLINE_AI_PACKS[tier];
      const maxNewTokens = tier === 'pro' ? 520 : tier === 'standard' ? 240 : 260;
      const res = await sendWorkerRequest<{ text?: string; backend?: 'webgpu' | 'wasm' }>(
        {
          type: 'chat',
          tier,
          className: pack.capabilities.onlyClass ?? options.className,
          studentName: options.studentName,
          messages: options.messages,
          contextHint: options.contextHint,
          maxNewTokens,
        },
        { onChunk: options.onChunk },
      );

    updateState({
      status: 'ready',
      llmLoaded: true,
      deviceBackend: res.backend ?? state.deviceBackend,
      error: null,
    });
    return (res.text || '').trim();
  } finally {
    options.signal?.removeEventListener('abort', onAbort);
  }
}

export async function generateOfflineLiveReply(options: {
  className: ClassLevel;
  liveRole: 'bengali' | 'english' | 'bilingual';
  studentName?: string;
  history: OfflineChatTurn[];
  userText: string;
  contextHint?: string;
  onChunk?: (chunk: string) => void;
}): Promise<string> {
  const tier = state.installedTier;
  if (!tier) {
    throw new Error('Offline AI Pack is not installed yet.');
  }
  if (!OFFLINE_AI_PACKS[tier].capabilities.allowLive) {
    throw new Error(
      'অনলি ক্লাস ৮ (১০০ MB) প্যাকে AI Live চালু নেই। লাইভ কথা বলতে ২৫০ MB বা ৫০০ MB প্যাক ডাউনলোড করো।',
    );
  }

  if (!state.llmLoaded) {
    updateState({ status: 'loading' });
  }

  const res = await sendWorkerRequest<{ text?: string; backend?: 'webgpu' | 'wasm' }>(
    {
      type: 'live-reply',
      tier,
      className: options.className,
      liveRole: options.liveRole,
      studentName: options.studentName,
      history: options.history,
      userText: options.userText,
      contextHint: options.contextHint,
    },
    { onChunk: options.onChunk },
  );

  updateState({
    status: 'ready',
    llmLoaded: true,
    deviceBackend: res.backend ?? state.deviceBackend,
    error: null,
  });

  return (res.text || '').trim();
}

export async function lookupOfflineAiDictionary(word: string): Promise<DictionaryEntry | null> {
  const tier = state.installedTier;
  if (!tier) return null;
  if (!OFFLINE_AI_PACKS[tier].capabilities.allowDictionary) return null;

  try {
    const res = await sendWorkerRequest<{ text?: string }>({
      type: 'dictionary',
      tier,
      word,
    });
    const raw = (res.text || '').trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as Partial<DictionaryEntry>;
    if (!parsed.meaning || typeof parsed.meaning !== 'string') return null;

    return {
      word: (parsed.word || word).trim(),
      pronunciation:
        typeof parsed.pronunciation === 'string' && parsed.pronunciation.trim()
          ? parsed.pronunciation.trim()
          : word,
      meaning: parsed.meaning.trim(),
      sandhiVicched:
        typeof parsed.sandhiVicched === 'string' && parsed.sandhiVicched.trim()
          ? parsed.sandhiVicched.trim()
          : 'অফলাইন AI বিশ্লেষণ',
      grammar:
        typeof parsed.grammar === 'string' && parsed.grammar.trim()
          ? parsed.grammar.trim()
          : 'শব্দ',
      exampleSentences:
        Array.isArray(parsed.exampleSentences) && parsed.exampleSentences.length > 0
          ? parsed.exampleSentences
              .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
              .slice(0, 2)
          : [`${word} শব্দটি পড়াশোনায় ব্যবহৃত হয়।`],
    };
  } catch {
    return null;
  }
}

export async function transcribeOfflineAudio(
  pcm16k: Float32Array,
  language: 'bengali' | 'english',
): Promise<string> {
  const tier = state.installedTier;
  if (!tier) {
    throw new Error('Offline Voice Pack is not installed yet.');
  }

  const copy = new Float32Array(pcm16k);
  const res = await sendWorkerRequest<{ text?: string }>(
    {
      type: 'transcribe',
      tier,
      audio: copy,
      language,
    },
    { transfer: [copy.buffer] },
  );

  updateState({ whisperLoaded: true });
  return (res.text || '').trim();
}

export async function decodeAudioBlobTo16kPcm(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const channelData = decoded.getChannelData(0);
    const inputRate = decoded.sampleRate;
    if (inputRate === 16000) {
      return new Float32Array(channelData);
    }
    const ratio = inputRate / 16000;
    const newLength = Math.max(1, Math.round(channelData.length / ratio));
    const output = new Float32Array(newLength);
    let outIdx = 0;
    let inIdx = 0;
    while (outIdx < newLength) {
      const nextIn = Math.min(channelData.length, Math.round((outIdx + 1) * ratio));
      let sum = 0;
      let count = 0;
      for (let i = inIdx; i < nextIn; i += 1) {
        sum += channelData[i];
        count += 1;
      }
      output[outIdx] = count > 0 ? sum / count : 0;
      outIdx += 1;
      inIdx = nextIn;
    }
    return output;
  } finally {
    if (ctx.state !== 'closed') {
      ctx.close().catch(() => {});
    }
  }
}

const TESSERACT_CDN_URL =
  'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.esm.min.js';

interface TesseractModule {
  createWorker?: (langs: string | string[]) => Promise<{
    recognize: (img: string) => Promise<{ data?: { text?: string } }>;
    terminate: () => Promise<void>;
  }>;
  default?: {
    createWorker?: (langs: string | string[]) => Promise<{
      recognize: (img: string) => Promise<{ data?: { text?: string } }>;
      terminate: () => Promise<void>;
    }>;
  };
}

async function loadTesseractCreateWorker() {
  const mod = (await import(/* @vite-ignore */ TESSERACT_CDN_URL)) as unknown as TesseractModule;
  return mod.createWorker ?? mod.default?.createWorker ?? null;
}

export async function extractTextFromImageOffline(imageDataUrl: string): Promise<string> {
  try {
    const createWorker = await loadTesseractCreateWorker();
    if (!createWorker) return '';
    const worker = await createWorker(['ben', 'eng']);
    try {
      const result = await worker.recognize(imageDataUrl);
      return (result?.data?.text || '').replace(/\s+/g, ' ').trim();
    } finally {
      await worker.terminate();
    }
  } catch {
    return '';
  }
}

export function formatBytesCompact(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
