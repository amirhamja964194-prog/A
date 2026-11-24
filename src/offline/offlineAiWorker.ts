import { OFFLINE_AI_PACKS, type OfflineAiPackTier, type OfflineChatTurn } from './offlineAiTypes';

const TRANSFORMERS_CDN_URL =
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';

interface ProgressInfo {
  status?: string;
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
}

interface RuntimeStopper {
  interrupt: () => void;
}

interface TextGenPipeline {
  (input: unknown, options: Record<string, unknown>): Promise<unknown>;
  tokenizer: unknown;
  dispose: () => Promise<void>;
}

interface AsrPipeline {
  (audio: Float32Array, options: Record<string, unknown>): Promise<
    { text?: string } | Array<{ text?: string }>
  >;
  dispose: () => Promise<void>;
}

interface TransformersModule {
  env: {
    allowLocalModels: boolean;
    allowRemoteModels: boolean;
    useBrowserCache: boolean;
    backends?: {
      onnx?: {
        wasm?: {
          numThreads?: number;
        };
      };
    };
  };
  pipeline: (
    task: string,
    model: string,
    options?: Record<string, unknown>,
  ) => Promise<unknown>;
  TextStreamer: new (
    tokenizer: unknown,
    options: {
      skip_prompt?: boolean;
      skip_special_tokens?: boolean;
      callback_function?: (text: string) => void;
    },
  ) => unknown;
  InterruptableStoppingCriteria: new () => RuntimeStopper;
}

let transformersPromise: Promise<TransformersModule> | null = null;

async function loadTransformers(): Promise<TransformersModule> {
  if (!transformersPromise) {
    transformersPromise = (async () => {
      const mod = (await import(
        /* @vite-ignore */ TRANSFORMERS_CDN_URL
      )) as unknown as TransformersModule;

      // Always use browser Cache API so downloaded models persist across restarts & offline mode
      mod.env.allowLocalModels = false;
      mod.env.allowRemoteModels = true;
      mod.env.useBrowserCache = true;

      if (mod.env.backends?.onnx?.wasm) {
        // Safe multi-threading only when crossOriginIsolated, otherwise single-thread WASM (universal Android support)
        mod.env.backends.onnx.wasm.numThreads =
          typeof self !== 'undefined' &&
          (self as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated
            ? Math.min(4, navigator.hardwareConcurrency || 2)
            : 1;
      }

      return mod;
    })().catch((err) => {
      transformersPromise = null;
      throw err;
    });
  }
  return transformersPromise;
}

type WorkerRequest =
  | {
      id: string;
      type: 'load-pack';
      tier: OfflineAiPackTier;
      localOnly?: boolean;
      loadWhisper?: boolean;
    }
  | {
      id: string;
      type: 'chat';
      tier: OfflineAiPackTier;
      className: string;
      studentName?: string;
      messages: OfflineChatTurn[];
      contextHint?: string;
      maxNewTokens?: number;
    }
  | {
      id: string;
      type: 'live-reply';
      tier: OfflineAiPackTier;
      className: string;
      liveRole: 'bengali' | 'english' | 'bilingual';
      studentName?: string;
      history: OfflineChatTurn[];
      userText: string;
      contextHint?: string;
    }
  | {
      id: string;
      type: 'dictionary';
      tier: OfflineAiPackTier;
      word: string;
    }
  | {
      id: string;
      type: 'transcribe';
      tier: OfflineAiPackTier;
      audio: Float32Array;
      language: 'bengali' | 'english';
    }
  | {
      id: string;
      type: 'abort';
    }
  | {
      id: string;
      type: 'unload';
    };

let llmPipeline: TextGenPipeline | null = null;
let loadedLlmModelId: string | null = null;
let whisperPipeline: AsrPipeline | null = null;
let loadedWhisperModelId: string | null = null;
let activeBackend: 'webgpu' | 'wasm' = 'wasm';
let currentStopper: RuntimeStopper | null = null;

async function detectBestDevice(): Promise<'webgpu' | 'wasm'> {
  try {
    const nav = navigator as unknown as {
      gpu?: { requestAdapter?: () => Promise<unknown | null> };
    };
    if (nav.gpu && typeof nav.gpu.requestAdapter === 'function') {
      const adapter = await nav.gpu.requestAdapter();
      if (adapter) {
        return 'webgpu';
      }
    }
  } catch {
    // Fallback to WASM
  }
  return 'wasm';
}

function createProgressTracker(stage: 'llm' | 'whisper', stageLabelBn: string) {
  const fileSizes = new Map<string, { loaded: number; total: number }>();
  let lastEmit = 0;

  return (info: ProgressInfo) => {
    if (!info || !info.file) return;
    if (info.status === 'progress' || info.status === 'downloading' || info.status === 'done') {
      const prev = fileSizes.get(info.file) || { loaded: 0, total: 0 };
      const total = typeof info.total === 'number' && info.total > 0 ? info.total : prev.total;
      const loaded =
        info.status === 'done'
          ? total || prev.loaded
          : typeof info.loaded === 'number'
            ? info.loaded
            : prev.loaded;
      fileSizes.set(info.file, { loaded, total });

      const now = performance.now();
      if (info.status !== 'done' && now - lastEmit < 120) return;
      lastEmit = now;

      let loadedBytes = 0;
      let totalBytes = 0;
      for (const entry of fileSizes.values()) {
        loadedBytes += entry.loaded;
        totalBytes += Math.max(entry.total, entry.loaded);
      }
      const percent =
        totalBytes > 0
          ? Math.min(99, Math.round((loadedBytes / totalBytes) * 100))
          : Math.round(info.progress || 0);

      self.postMessage({
        type: 'progress',
        stage,
        stageLabelBn,
        file: info.file,
        percent,
        loadedBytes,
        totalBytes,
      });
    }
  };
}

async function ensureLlmLoaded(
  tier: OfflineAiPackTier,
  localOnly = false,
): Promise<TextGenPipeline> {
  const pack = OFFLINE_AI_PACKS[tier];
  if (llmPipeline && loadedLlmModelId === pack.llmModelId) {
    return llmPipeline;
  }

  if (llmPipeline) {
    try {
      await llmPipeline.dispose();
    } catch {
      // Ignore dispose error
    }
    llmPipeline = null;
    loadedLlmModelId = null;
  }

  const { pipeline } = await loadTransformers();
  const preferredDevice = await detectBestDevice();
  const progressCb = createProgressTracker(
    'llm',
    `অফলাইন AI ব্রেইন লোড হচ্ছে (${pack.llmLabel})...`,
  );

  // Try compact q4f16 first (~461MB / ~260MB / ~112MB), with automatic fallback to universal q8 on WASM
  const loadAttempts: Array<{ device: 'webgpu' | 'wasm'; dtype: 'q4f16' | 'q8' }> =
    preferredDevice === 'webgpu'
      ? [
          { device: 'webgpu', dtype: 'q4f16' },
          { device: 'wasm', dtype: 'q4f16' },
          { device: 'wasm', dtype: 'q8' },
        ]
      : [
          { device: 'wasm', dtype: 'q4f16' },
          { device: 'wasm', dtype: 'q8' },
        ];

  let lastErr: unknown = null;
  for (const attempt of loadAttempts) {
    try {
      llmPipeline = (await pipeline('text-generation', pack.llmModelId, {
        device: attempt.device,
        dtype: attempt.dtype,
        local_files_only: localOnly,
        progress_callback: progressCb,
      })) as TextGenPipeline;
      activeBackend = attempt.device;
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
    }
  }

  if (!llmPipeline) {
    throw lastErr instanceof Error
      ? lastErr
      : new Error('অফলাইন AI মডেল লোড করা যায়নি। ইন্টারনেট চেক করে আবার চেষ্টা করো।');
  }

  loadedLlmModelId = pack.llmModelId;
  return llmPipeline;
}

async function ensureWhisperLoaded(
  tier: OfflineAiPackTier,
  localOnly = false,
): Promise<AsrPipeline> {
  const pack = OFFLINE_AI_PACKS[tier];
  if (whisperPipeline && loadedWhisperModelId === pack.whisperModelId) {
    return whisperPipeline;
  }

  if (whisperPipeline) {
    try {
      await whisperPipeline.dispose();
    } catch {
      // Ignore dispose error
    }
    whisperPipeline = null;
    loadedWhisperModelId = null;
  }

  const { pipeline } = await loadTransformers();
  const progressCb = createProgressTracker(
    'whisper',
    `অফলাইন ভয়েস ইঞ্জিন লোড হচ্ছে (${pack.whisperLabel})...`,
  );

  // Whisper tiny with q8 encoder (10MB) + q8 merged decoder (29MB) = only ~39MB total & works universally on Android WASM
  const whisperDtype = {
    encoder_model: 'q8',
    decoder_model_merged: 'q8',
  };

  whisperPipeline = (await pipeline('automatic-speech-recognition', pack.whisperModelId, {
    device: 'wasm',
    dtype: whisperDtype,
    local_files_only: localOnly,
    progress_callback: progressCb,
  })) as AsrPipeline;

  loadedWhisperModelId = pack.whisperModelId;
  return whisperPipeline;
}

function extractGeneratedAssistantText(output: unknown): string {
  if (Array.isArray(output) && output.length > 0) {
    const first = output[0] as { generated_text?: unknown };
    const gen = first?.generated_text;
    if (Array.isArray(gen) && gen.length > 0) {
      const lastMsg = gen[gen.length - 1] as { content?: string };
      if (typeof lastMsg?.content === 'string') {
        return lastMsg.content.trim();
      }
    }
    if (typeof gen === 'string') {
      return gen.trim();
    }
  }
  return '';
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  if (!msg) return;

  if (msg.type === 'abort') {
    currentStopper?.interrupt();
    return;
  }

  if (msg.type === 'unload') {
    try {
      await llmPipeline?.dispose();
    } catch {
      // Ignore
    }
    try {
      await whisperPipeline?.dispose();
    } catch {
      // Ignore
    }
    llmPipeline = null;
    whisperPipeline = null;
    loadedLlmModelId = null;
    loadedWhisperModelId = null;
    self.postMessage({ id: msg.id, type: 'unloaded' });
    return;
  }

  try {
    if (msg.type === 'load-pack') {
      await ensureLlmLoaded(msg.tier, Boolean(msg.localOnly));
      if (msg.loadWhisper !== false) {
        await ensureWhisperLoaded(msg.tier, Boolean(msg.localOnly));
      }
      self.postMessage({
        id: msg.id,
        type: 'pack-ready',
        tier: msg.tier,
        backend: activeBackend,
        llmLoaded: Boolean(llmPipeline),
        whisperLoaded: Boolean(whisperPipeline),
      });
      return;
    }

    if (msg.type === 'chat') {
      const { TextStreamer, InterruptableStoppingCriteria } = await loadTransformers();
      const generator = await ensureLlmLoaded(msg.tier, !navigator.onLine);
      const stopper = new InterruptableStoppingCriteria();
      currentStopper = stopper;

      const effectiveClass = msg.tier === 'class8' ? 'Class 8' : msg.className;

      const styleInstruction =
        msg.tier === 'pro'
          ? 'Organize your answer very neatly and clearly: start with a short intro, use bold headings, clear bullet points or numbered steps, simple school-level examples, and a quick exam takeaway at the end. Keep formulas and dates accurate.'
          : msg.tier === 'standard'
            ? 'Give a very fast, direct, accurate, and concise answer in short clear points so the student gets the exact solution immediately.'
            : 'You are exclusively a WBBSE Class 8 tutor. Give a simple, clear, concise Class 8 level explanation with key points.';

      const systemPrompt = [
        `You are Wbsec AI Teacher, a friendly, accurate West Bengal Board (WBBSE) tutor for ${effectiveClass} students.`,
        msg.studentName ? `The student's name is ${msg.studentName}. Warmly address them by name naturally.` : '',
        'Answer clearly in the same language the student uses (prefer clear, natural Bengali if asked in Bengali, or English if asked in English).',
        styleInstruction,
        msg.contextHint ? `\nReference study note for accuracy:\n${msg.contextHint.slice(0, 1200)}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const recentTurns = msg.messages.slice(msg.tier === 'pro' ? -6 : -4).map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text.slice(0, msg.tier === 'pro' ? 1400 : 800),
      }));

      const chatInput = [{ role: 'system', content: systemPrompt }, ...recentTurns];
      let streamedText = '';

      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (tokenText: string) => {
          streamedText += tokenText;
          self.postMessage({
            id: msg.id,
            type: 'chunk',
            text: tokenText,
          });
        },
      });

      const isFastPack = msg.tier === 'standard' || msg.tier === 'class8';
      const defaultTokens = msg.tier === 'pro' ? 520 : msg.tier === 'standard' ? 240 : 260;

      const output = await generator(chatInput, {
        max_new_tokens: msg.maxNewTokens ?? defaultTokens,
        do_sample: !isFastPack,
        ...(isFastPack ? {} : { temperature: 0.4, top_p: 0.9 }),
        repetition_penalty: 1.12,
        streamer,
        stopping_criteria: [stopper],
      });

      currentStopper = null;
      const finalText = streamedText.trim() || extractGeneratedAssistantText(output);
      self.postMessage({
        id: msg.id,
        type: 'done',
        text: finalText,
        backend: activeBackend,
      });
      return;
    }

    if (msg.type === 'live-reply') {
      const { TextStreamer, InterruptableStoppingCriteria } = await loadTransformers();
      const generator = await ensureLlmLoaded(msg.tier, !navigator.onLine);
      const stopper = new InterruptableStoppingCriteria();
      currentStopper = stopper;

      const roleRule =
        msg.liveRole === 'english'
          ? 'Reply ONLY in simple, warm spoken English (2 to 4 short sentences).'
          : msg.liveRole === 'bilingual'
            ? 'Reply briefly in BOTH simple English and natural Bengali (2 to 4 short sentences total).'
            : 'Reply ONLY in natural, warm spoken Bengali (2 to 4 short sentences).';

      const systemPrompt = [
        `You are Wbsec Live Voice Teacher talking live to a West Bengal Board (WBBSE) ${msg.className} student.`,
        msg.studentName ? `The student's name is ${msg.studentName}. Address them warmly by name naturally.` : '',
        roleRule,
        'Speak naturally like a real teacher in a voice call. Do NOT use markdown symbols like *, #, or bullet lists. Keep your reply concise and easy to listen to.',
        msg.contextHint ? `\nReference textbook fact:\n${msg.contextHint.slice(0, 900)}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const recentTurns = msg.history.slice(-6).map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text.slice(0, 600),
      }));

      const chatInput = [
        { role: 'system', content: systemPrompt },
        ...recentTurns,
        { role: 'user', content: msg.userText },
      ];

      let streamedText = '';
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (tokenText: string) => {
          streamedText += tokenText;
          self.postMessage({
            id: msg.id,
            type: 'chunk',
            text: tokenText,
          });
        },
      });

      const isFastLive = msg.tier === 'standard';
      const output = await generator(chatInput, {
        max_new_tokens: isFastLive ? 130 : 190,
        do_sample: !isFastLive,
        ...(isFastLive ? {} : { temperature: 0.48, top_p: 0.9 }),
        repetition_penalty: 1.12,
        streamer,
        stopping_criteria: [stopper],
      });

      currentStopper = null;
      const finalText = (streamedText.trim() || extractGeneratedAssistantText(output))
        .replace(/[*#`_]/g, '')
        .trim();

      self.postMessage({
        id: msg.id,
        type: 'done',
        text: finalText,
        backend: activeBackend,
      });
      return;
    }

    if (msg.type === 'dictionary') {
      const generator = await ensureLlmLoaded(msg.tier, !navigator.onLine);
      const chatInput = [
        {
          role: 'system',
          content:
            'You are a West Bengal Board Bengali & English School Dictionary. Return ONLY valid JSON with keys: "word", "pronunciation", "meaning" (in clear Bengali), "sandhiVicched" (Sandhi or root word), "grammar" (part of speech in Bengali/English), and "exampleSentences" (array of 2 short example sentences). No extra text outside JSON.',
        },
        {
          role: 'user',
          content: `Define the word: "${msg.word}"`,
        },
      ];

      const output = await generator(chatInput, {
        max_new_tokens: 260,
        do_sample: false,
        repetition_penalty: 1.08,
      });

      const raw = extractGeneratedAssistantText(output);
      self.postMessage({
        id: msg.id,
        type: 'done',
        text: raw,
        backend: activeBackend,
      });
      return;
    }

    if (msg.type === 'transcribe') {
      const transcriber = await ensureWhisperLoaded(msg.tier, !navigator.onLine);
      const result = await transcriber(msg.audio, {
        language: msg.language === 'bengali' ? 'bengali' : 'english',
        task: 'transcribe',
        chunk_length_s: 20,
        stride_length_s: 3,
      });

      const text = Array.isArray(result)
        ? result.map((r) => r.text || '').join(' ').trim()
        : (result?.text || '').trim();

      self.postMessage({
        id: msg.id,
        type: 'done',
        text,
      });
      return;
    }
  } catch (err) {
    currentStopper = null;
    const message =
      err instanceof Error ? err.message : 'Offline AI worker encountered an error.';
    self.postMessage({
      id: msg.id,
      type: 'error',
      error: message,
    });
  }
};
