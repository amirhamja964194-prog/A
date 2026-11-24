import express from 'express';
import http from 'http';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Type,
  ThinkingLevel,
} from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const IS_PROD =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' && process.env.npm_lifecycle_event === 'start');

function resolveServerBuildVersion(): string {
  if (!IS_PROD) {
    return 'dev';
  }
  try {
    const metaPath = path.resolve(__dirname, 'dist', 'build-meta.json');
    if (fs.existsSync(metaPath)) {
      const parsed = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as { buildId?: string };
      if (parsed?.buildId && typeof parsed.buildId === 'string') {
        return parsed.buildId;
      }
    }
  } catch {
    // Fallback to boot timestamp
  }
  return `build-${Date.now()}`;
}
const APP_BUILD_VERSION = resolveServerBuildVersion();
const MODEL_NAME = 'gemini-3.1-flash-lite';
const LIVE_MODEL_NAME = 'gemini-3.8-live';
const TTS_MODEL_NAME = 'gemini-3.8-flash-lite-tts';
const TRANSCRIBE_MODEL_NAME = 'gemini-3.5-transcribe';
const ALLOWED_VOICES = new Set(['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir']);

let cachedAIClient: GoogleGenAI | null = null;
let cachedLiveAIClient: GoogleGenAI | null = null;
let cachedApiKey: string | undefined;

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  if (!cachedAIClient || cachedApiKey !== apiKey) {
    cachedApiKey = apiKey;
    cachedAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 20000,
        retryOptions: { attempts: 1 },
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    cachedLiveAIClient = null;
  }
  return cachedAIClient;
}

function getLiveAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  if (!cachedLiveAIClient || cachedApiKey !== apiKey) {
    cachedApiKey = apiKey;
    cachedLiveAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        apiVersion: 'v1beta',
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedLiveAIClient;
}

const dictionaryCache = new Map<string, Record<string, unknown>>();
const MAX_DICT_CACHE = 200;

interface ServerAppConfig {
  configVersion: number;
  updateTitle: string;
  updateNotes: string;
  appName: string;
  attributionText: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  dictionaryTitle: string;
  dictionarySubtitle: string;
  accentColor: 'blue' | 'emerald' | 'indigo' | 'violet' | 'rose' | 'amber';
  pageBackground: 'default' | 'yellow' | 'blue' | 'emerald' | 'rose' | 'violet';
  fontScale: 'normal' | 'large';
  announcementBanner: string;
  apkDownloadUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  enableTeacher: boolean;
  enableLiveMode: boolean;
  enableDictionary: boolean;
  enableVoiceInput: boolean;
  enableVoiceOutput: boolean;
  enablePdfExport: boolean;
  enableCamera: boolean;
  defaultClass: 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';
  defaultVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';
  defaultLiveRole: 'english' | 'bengali' | 'bilingual';
  temperature: number;
  conciseAnswers: boolean;
  customTeacherPrompt: string;
  customLivePrompt: string;
  samplePrompts: string[];
  sampleWords: string[];
  updatedAt: number;
}

const ALLOWED_CLASSES = new Set([
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
]);
const ALLOWED_LIVE_ROLES = new Set(['english', 'bengali', 'bilingual']);
const ALLOWED_ACCENT_COLORS = new Set(['blue', 'emerald', 'indigo', 'violet', 'rose', 'amber']);
const ALLOWED_PAGE_BACKGROUNDS = new Set(['default', 'yellow', 'blue', 'emerald', 'rose', 'violet']);
const ALLOWED_FONT_SCALES = new Set(['normal', 'large']);

const DEFAULT_SERVER_CONFIG: ServerAppConfig = {
  configVersion: 1,
  updateTitle: 'New App Update Available',
  updateNotes: '',
  appName: 'Wbsec',
  attributionText: 'Made by Amir',
  welcomeTitle: '',
  welcomeSubtitle:
    'Start Live Mode to talk directly with your English or Bengali teacher in real time, tap the mic to dictate, or attach a textbook photo.',
  dictionaryTitle: 'Bengali Dictionary',
  dictionarySubtitle:
    'Look up pronunciation, Bengali meaning, Sandhi Vicched, grammar identity, and example sentences.',
  accentColor: 'blue',
  pageBackground: 'default',
  fontScale: 'normal',
  announcementBanner: '',
  apkDownloadUrl: '',
  maintenanceMode: false,
  maintenanceMessage: 'App maintenance is in progress. Please check back shortly.',
  enableTeacher: true,
  enableLiveMode: true,
  enableDictionary: true,
  enableVoiceInput: true,
  enableVoiceOutput: true,
  enablePdfExport: true,
  enableCamera: true,
  defaultClass: 'Class 8',
  defaultVoice: 'Kore',
  defaultLiveRole: 'bengali',
  temperature: 0.2,
  conciseAnswers: true,
  customTeacherPrompt: '',
  customLivePrompt: '',
  samplePrompts: [
    'সালোকসংশ্লেষ প্রক্রিয়াটি সহজভাবে বুঝিয়ে দাও।',
    'নিউটনের গতির তৃতীয় সূত্র উদাহরণসহ ব্যাখ্যা করো।',
    'সালোকসংশ্লেষের ওপর একটি PDF তৈরি করো।',
  ],
  sampleWords: [
    'বিদ্যালয়',
    'সূর্যোদয়',
    'অন্বেষণ',
    'জিজ্ঞাসা',
    'দিগন্ত',
    'Resilience',
  ],
  updatedAt: Date.now(),
};

const DATA_DIR = path.resolve(__dirname, 'data');
const ADMIN_STORE_PATH = path.join(DATA_DIR, 'admin-config.json');

interface PersistedAdminStore {
  signingSecret: string;
  config: ServerAppConfig;
}

function sanitizeAppConfig(
  patch: Partial<ServerAppConfig> | undefined,
  base: ServerAppConfig = DEFAULT_SERVER_CONFIG,
): ServerAppConfig {
  const src = patch ?? {};
  const str = (val: unknown, fallback: string, maxLen: number) =>
    typeof val === 'string' ? val.trim().slice(0, maxLen) : fallback;
  const allowBlankStr = (val: unknown, fallback: string, maxLen: number) =>
    typeof val === 'string' ? val.trim().slice(0, maxLen) : fallback;
  const sanitizeApkUrl = (val: unknown, fallback: string) => {
    if (typeof val !== 'string') return fallback;
    const trimmed = val.trim().slice(0, 500);
    if (!trimmed) return '';
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' ? parsed.toString() : fallback;
    } catch {
      return fallback;
    }
  };
  const bool = (val: unknown, fallback: boolean) =>
    typeof val === 'boolean' ? val : fallback;

  const rawClass = typeof src.defaultClass === 'string' ? src.defaultClass : base.defaultClass;
  const defaultClass = ALLOWED_CLASSES.has(rawClass)
    ? (rawClass as ServerAppConfig['defaultClass'])
    : base.defaultClass;

  const rawVoice = typeof src.defaultVoice === 'string' ? src.defaultVoice : base.defaultVoice;
  const defaultVoice = ALLOWED_VOICES.has(rawVoice)
    ? (rawVoice as ServerAppConfig['defaultVoice'])
    : base.defaultVoice;

  const rawRole = typeof src.defaultLiveRole === 'string' ? src.defaultLiveRole : base.defaultLiveRole;
  const defaultLiveRole = ALLOWED_LIVE_ROLES.has(rawRole)
    ? (rawRole as ServerAppConfig['defaultLiveRole'])
    : base.defaultLiveRole;

  const rawAccent = typeof src.accentColor === 'string' ? src.accentColor : base.accentColor;
  const accentColor = ALLOWED_ACCENT_COLORS.has(rawAccent)
    ? (rawAccent as ServerAppConfig['accentColor'])
    : base.accentColor;

  const rawPageBg = typeof src.pageBackground === 'string' ? src.pageBackground : base.pageBackground;
  const pageBackground = ALLOWED_PAGE_BACKGROUNDS.has(rawPageBg)
    ? (rawPageBg as ServerAppConfig['pageBackground'])
    : base.pageBackground;

  const rawScale = typeof src.fontScale === 'string' ? src.fontScale : base.fontScale;
  const fontScale = ALLOWED_FONT_SCALES.has(rawScale)
    ? (rawScale as ServerAppConfig['fontScale'])
    : base.fontScale;

  const rawVersion =
    typeof src.configVersion === 'number' && Number.isFinite(src.configVersion) && src.configVersion >= 1
      ? Math.floor(src.configVersion)
      : base.configVersion || 1;

  const rawTemp = typeof src.temperature === 'number' && Number.isFinite(src.temperature)
    ? Math.round(Math.min(1, Math.max(0, src.temperature)) * 100) / 100
    : base.temperature;

  const sanitizeList = (list: unknown, fallback: string[], maxItems: number, maxLen: number) => {
    if (!Array.isArray(list)) return fallback;
    const cleaned = list
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, maxLen))
      .filter(Boolean)
      .slice(0, maxItems);
    return cleaned.length > 0 ? cleaned : fallback;
  };

  return {
    configVersion: rawVersion,
    updateTitle:
      str(src.updateTitle, base.updateTitle, 80) || DEFAULT_SERVER_CONFIG.updateTitle,
    updateNotes: allowBlankStr(src.updateNotes, base.updateNotes, 600),
    appName: str(src.appName, base.appName, 40) || DEFAULT_SERVER_CONFIG.appName,
    attributionText: str(src.attributionText, base.attributionText, 50) || DEFAULT_SERVER_CONFIG.attributionText,
    welcomeTitle: allowBlankStr(src.welcomeTitle, base.welcomeTitle, 100),
    welcomeSubtitle:
      str(src.welcomeSubtitle, base.welcomeSubtitle, 280) || DEFAULT_SERVER_CONFIG.welcomeSubtitle,
    dictionaryTitle:
      str(src.dictionaryTitle, base.dictionaryTitle, 60) || DEFAULT_SERVER_CONFIG.dictionaryTitle,
    dictionarySubtitle:
      str(src.dictionarySubtitle, base.dictionarySubtitle, 240) ||
      DEFAULT_SERVER_CONFIG.dictionarySubtitle,
    accentColor,
    pageBackground,
    fontScale,
    announcementBanner: allowBlankStr(src.announcementBanner, base.announcementBanner, 240),
    apkDownloadUrl: sanitizeApkUrl(src.apkDownloadUrl, base.apkDownloadUrl || ''),
    maintenanceMode: bool(src.maintenanceMode, base.maintenanceMode),
    maintenanceMessage:
      str(src.maintenanceMessage, base.maintenanceMessage, 240) ||
      DEFAULT_SERVER_CONFIG.maintenanceMessage,
    enableTeacher: bool(src.enableTeacher, base.enableTeacher),
    enableLiveMode: bool(src.enableLiveMode, base.enableLiveMode),
    enableDictionary: bool(src.enableDictionary, base.enableDictionary),
    enableVoiceInput: bool(src.enableVoiceInput, base.enableVoiceInput),
    enableVoiceOutput: bool(src.enableVoiceOutput, base.enableVoiceOutput),
    enablePdfExport: bool(src.enablePdfExport, base.enablePdfExport),
    enableCamera: bool(src.enableCamera, base.enableCamera),
    defaultClass,
    defaultVoice,
    defaultLiveRole,
    temperature: rawTemp,
    conciseAnswers: bool(src.conciseAnswers, base.conciseAnswers),
    customTeacherPrompt: allowBlankStr(src.customTeacherPrompt, base.customTeacherPrompt, 600),
    customLivePrompt: allowBlankStr(src.customLivePrompt, base.customLivePrompt, 600),
    samplePrompts: sanitizeList(src.samplePrompts, base.samplePrompts, 6, 160),
    sampleWords: sanitizeList(src.sampleWords, base.sampleWords, 10, 60),
    updatedAt: Date.now(),
  };
}

function loadAdminStore(): PersistedAdminStore {
  try {
    if (fs.existsSync(ADMIN_STORE_PATH)) {
      const raw = JSON.parse(fs.readFileSync(ADMIN_STORE_PATH, 'utf-8')) as Partial<PersistedAdminStore>;
      if (raw && typeof raw.signingSecret === 'string' && raw.signingSecret.length >= 32) {
        return {
          signingSecret: raw.signingSecret,
          config: sanitizeAppConfig(raw.config, DEFAULT_SERVER_CONFIG),
        };
      }
    }
  } catch {
    // Recreate store if corrupted
  }
  const fresh: PersistedAdminStore = {
    signingSecret: process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex'),
    config: { ...DEFAULT_SERVER_CONFIG, updatedAt: Date.now() },
  };
  saveAdminStore(fresh);
  return fresh;
}

function saveAdminStore(store: PersistedAdminStore): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(ADMIN_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Ignore disk write failure in read-only environments
  }
}

const adminStore = loadAdminStore();
const serverStartTime = Date.now();
let totalAiRequests = 0;
let activeLiveConnections = 0;

interface FirebaseClientFileConfig {
  projectId?: string;
  apiKey?: string;
  firestoreDatabaseId?: string;
}

function loadFirebaseClientConfig(): FirebaseClientFileConfig | null {
  try {
    const cfgPath = path.resolve(__dirname, 'firebase-applet-config.json');
    if (!fs.existsSync(cfgPath)) return null;
    return JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as FirebaseClientFileConfig;
  } catch {
    return null;
  }
}

const firebaseFileConfig = loadFirebaseClientConfig();

function decodeFirestoreValue(val: Record<string, unknown> | undefined): unknown {
  if (!val || typeof val !== 'object') return undefined;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) {
    const n = Number(val.integerValue);
    return Number.isFinite(n) ? n : undefined;
  }
  if ('doubleValue' in val) {
    const n = Number(val.doubleValue);
    return Number.isFinite(n) ? n : undefined;
  }
  if ('timestampValue' in val && typeof val.timestampValue === 'string') {
    const ms = Date.parse(val.timestampValue);
    return Number.isFinite(ms) ? ms : Date.now();
  }
  if ('arrayValue' in val && val.arrayValue && typeof val.arrayValue === 'object') {
    const arr = (val.arrayValue as { values?: Array<Record<string, unknown>> }).values;
    if (!Array.isArray(arr)) return [];
    return arr.map((item) => decodeFirestoreValue(item));
  }
  return undefined;
}

let lastFirestoreSyncAt = 0;
let inflightFirestoreSync: Promise<ServerAppConfig> | null = null;

async function syncConfigFromFirestore(force = false): Promise<ServerAppConfig> {
  if (!firebaseFileConfig?.projectId || !firebaseFileConfig?.apiKey) {
    return adminStore.config;
  }

  const now = Date.now();
  if (!force && now - lastFirestoreSyncAt < 15000) {
    return adminStore.config;
  }

  if (inflightFirestoreSync) {
    return inflightFirestoreSync;
  }

  const databaseId = firebaseFileConfig.firestoreDatabaseId || '(default)';
  const docUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    firebaseFileConfig.projectId,
  )}/databases/${encodeURIComponent(databaseId)}/documents/appSettings/live?key=${encodeURIComponent(
    firebaseFileConfig.apiKey,
  )}`;

  inflightFirestoreSync = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const resp = await fetch(docUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!resp.ok) {
        lastFirestoreSyncAt = Date.now();
        return adminStore.config;
      }

      const json = (await resp.json()) as {
        fields?: Record<string, Record<string, unknown>>;
      };
      if (!json.fields || typeof json.fields !== 'object') {
        lastFirestoreSyncAt = Date.now();
        return adminStore.config;
      }

      const decoded: Record<string, unknown> = {};
      for (const [key, rawVal] of Object.entries(json.fields)) {
        const parsed = decodeFirestoreValue(rawVal);
        if (parsed !== undefined) {
          decoded[key] = parsed;
        }
      }

      const remoteConfig = sanitizeAppConfig(
        decoded as Partial<ServerAppConfig>,
        DEFAULT_SERVER_CONFIG,
      );
      if (typeof decoded.updatedAt === 'number') {
        remoteConfig.updatedAt = decoded.updatedAt;
      }

      const localVer = adminStore.config.configVersion || 1;
      const localUpdatedAt = adminStore.config.updatedAt || 0;
      if (
        remoteConfig.configVersion > localVer ||
        (remoteConfig.configVersion === localVer && remoteConfig.updatedAt > localUpdatedAt)
      ) {
        adminStore.config = remoteConfig;
        saveAdminStore(adminStore);
      }

      lastFirestoreSyncAt = Date.now();
      return adminStore.config;
    } catch {
      lastFirestoreSyncAt = Date.now();
      return adminStore.config;
    } finally {
      inflightFirestoreSync = null;
    }
  })();

  return inflightFirestoreSync;
}

function getAdminStats() {
  return {
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    dictionaryCacheSize: dictionaryCache.size,
    activeLiveConnections,
    totalAiRequests,
  };
}

function constantTimeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'Amir123';
  const expectedPass = process.env.ADMIN_PASSWORD || 'Amir@123';
  return constantTimeMatch(username.trim(), expectedUser) && constantTimeMatch(password, expectedPass);
}

function signAdminToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      role: 'admin',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', adminStore.signingSecret)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string): { sub: string; role: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', adminStore.signingSecret)
      .update(payload)
      .digest('base64url');
    if (!constantTimeMatch(sig, expectedSig)) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      sub?: string;
      role?: string;
      exp?: number;
    };
    if (!decoded.sub || decoded.role !== 'admin' || typeof decoded.exp !== 'number') return null;
    if (Date.now() > decoded.exp) return null;
    return { sub: decoded.sub, role: decoded.role, exp: decoded.exp };
  } catch {
    return null;
  }
}

function extractBearerToken(req: express.Request): string {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return '';
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = extractBearerToken(req);
  const claims = token ? verifyAdminToken(token) : null;
  if (!claims) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  (req as express.Request & { adminUser?: string }).adminUser = claims.sub;
  next();
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  if (error instanceof Error && error.message === 'MISSING_API_KEY') {
    return {
      status: 500,
      message: 'Gemini API key is not configured. Please check the Settings > Secrets panel.',
    };
  }

  const rawMsg = error instanceof Error ? error.message : String(error);

  if (rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('403')) {
    return {
      status: 403,
      message: 'Gemini API access was denied or the API key is invalid. Please verify your key in Settings > Secrets.',
    };
  }

  if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
    return {
      status: 429,
      message: 'Rate limit reached. Please wait a moment and try again.',
    };
  }

  if (rawMsg.includes('NOT_FOUND') || rawMsg.includes('404')) {
    return {
      status: 404,
      message: 'The requested Gemini model could not be found.',
    };
  }

  return {
    status: 500,
    message: rawMsg || 'Failed to generate a response. Please try again.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Android Trusted Web Activity (TWA) Digital Asset Links for 100% browser-bar-free standalone APK
  app.get('/.well-known/assetlinks.json', (_req, res) => {
    const packageName = (process.env.ANDROID_PACKAGE_NAME || 'com.wbsec.aiteacher').trim();
    const fingerprints = (process.env.ANDROID_SHA256_FINGERPRINT || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    res.setHeader('Cache-Control', 'no-cache, max-age=0');
    res.json([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: packageName,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ]);
  });

  app.get('/api/config', async (req, res) => {
    const forceFresh = req.query.fresh === '1';
    let latestConfig = adminStore.config;
    if (forceFresh) {
      latestConfig = await syncConfigFromFirestore(true);
    } else {
      void syncConfigFromFirestore(false);
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.json({ config: latestConfig, buildVersion: APP_BUILD_VERSION });
  });

  app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    if (!verifyAdminCredentials(username, password)) {
      return res.status(401).json({ error: 'Invalid admin username or password.' });
    }
    const cleanUser = username.trim();
    const token = signAdminToken(cleanUser);
    const latestConfig = await syncConfigFromFirestore(true);
    return res.json({
      token,
      username: cleanUser,
      config: latestConfig,
      stats: getAdminStats(),
    });
  });

  app.get('/api/admin/me', requireAdmin, async (req, res) => {
    const adminUser = (req as express.Request & { adminUser?: string }).adminUser || 'Amir123';
    const latestConfig = await syncConfigFromFirestore(true);
    return res.json({
      username: adminUser,
      config: latestConfig,
      stats: getAdminStats(),
    });
  });

  app.put('/api/admin/config', requireAdmin, async (req, res) => {
    await syncConfigFromFirestore(true);
    const body = req.body as { config?: Partial<ServerAppConfig>; publishUpdate?: boolean };
    const incoming = body?.config ?? (req.body as Partial<ServerAppConfig>);
    const shouldBumpVersion = body?.publishUpdate !== false;
    const incomingVer =
      typeof incoming?.configVersion === 'number' && Number.isFinite(incoming.configVersion)
        ? Math.floor(incoming.configVersion)
        : 0;
    const currentVer = adminStore.config.configVersion || 1;
    const nextVersion = shouldBumpVersion
      ? Math.max(currentVer + 1, incomingVer)
      : Math.max(currentVer, incomingVer || currentVer);
    adminStore.config = sanitizeAppConfig(
      { ...incoming, configVersion: nextVersion },
      adminStore.config,
    );
    saveAdminStore(adminStore);
    return res.json({
      config: adminStore.config,
      stats: getAdminStats(),
    });
  });

  app.post('/api/admin/interpret-change', requireAdmin, async (req, res) => {
    try {
      const { description, currentConfig } = req.body as {
        description?: string;
        currentConfig?: Partial<ServerAppConfig>;
      };
      const cleanDesc = typeof description === 'string' ? description.trim().slice(0, 1200) : '';
      if (!cleanDesc) {
        return res.status(400).json({ error: 'Please write what you want to change in the app.' });
      }

      const ai = getAIClient();
      const baseCfg = sanitizeAppConfig(currentConfig, adminStore.config);
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are converting an Admin's app update request (written in Bengali, Banglish, or English) into a partial JSON patch for app settings.

Current settings (reference only — DO NOT repeat unchanged fields):
${JSON.stringify({
  appName: baseCfg.appName,
  attributionText: baseCfg.attributionText,
  welcomeTitle: baseCfg.welcomeTitle,
  welcomeSubtitle: baseCfg.welcomeSubtitle,
  dictionaryTitle: baseCfg.dictionaryTitle,
  dictionarySubtitle: baseCfg.dictionarySubtitle,
  accentColor: baseCfg.accentColor,
  pageBackground: baseCfg.pageBackground,
  fontScale: baseCfg.fontScale,
  announcementBanner: baseCfg.announcementBanner,
  defaultClass: baseCfg.defaultClass,
  defaultVoice: baseCfg.defaultVoice,
  defaultLiveRole: baseCfg.defaultLiveRole,
  conciseAnswers: baseCfg.conciseAnswers,
  enableTeacher: baseCfg.enableTeacher,
  enableLiveMode: baseCfg.enableLiveMode,
  enableDictionary: baseCfg.enableDictionary,
  enableVoiceInput: baseCfg.enableVoiceInput,
  enableVoiceOutput: baseCfg.enableVoiceOutput,
  enablePdfExport: baseCfg.enablePdfExport,
  enableCamera: baseCfg.enableCamera,
  customTeacherPrompt: baseCfg.customTeacherPrompt,
  customLivePrompt: baseCfg.customLivePrompt,
  samplePrompts: baseCfg.samplePrompts,
  sampleWords: baseCfg.sampleWords,
})}

Admin's requested change:
"${cleanDesc}"

Rules:
1. Return ONLY a JSON object containing ONLY the fields that must CHANGE based on the Admin's request, plus 'updateNotes'. OMIT all unchanged fields completely.
2. CRITICAL: Do NOT modify appName, attributionText, welcomeTitle, welcomeSubtitle, dictionaryTitle, or dictionarySubtitle UNLESS the Admin explicitly asks to change the app name, title, heading, subtitle, or welcome text.
3. Feature toggles (apply EVERY toggle mentioned in the request):
   - Dictionary off/hide ("ডিকশনারি বন্ধ", "dictionary off", "turn off dictionary", "disable dictionary") => enableDictionary: false (or true to turn on / enable).
   - Live Mode off/on ("লাইভ মোড বন্ধ", "live mode off") => enableLiveMode: false / true.
   - AI Teacher off/on => enableTeacher: false / true.
   - Voice Mic off/on ("মাইক বন্ধ") => enableVoiceInput: false / true.
   - Voice Output off/on ("ভয়েস বন্ধ") => enableVoiceOutput: false / true.
   - PDF Export off/on ("পিডিএফ বন্ধ") => enablePdfExport: false / true.
   - Camera off/on ("ক্যামেরা বন্ধ") => enableCamera: false / true.
4. Colors:
   - Background color ("yellow background", "হলুদ ব্যাকগ্রাউন্ড", "green/emerald background", "blue/নীল background", "pink/rose background", "purple/violet background", "white/default background"): set 'pageBackground' to one of: default, yellow, blue, emerald, rose, violet. When setting pageBackground to 'yellow', also set accentColor: 'amber' unless a different button accent color is requested.
   - Button/Accent color: map blue, emerald/green, indigo, violet/purple, rose/pink/red, amber/yellow/orange to 'accentColor'.
5. Text & Typography:
   - Bigger/larger text ("লেখা বড় করো") => fontScale: "large" (or "normal").
   - Name/title/heading/banner requests => appName, attributionText, welcomeTitle, welcomeSubtitle, dictionaryTitle, dictionarySubtitle, announcementBanner.
6. Teaching & Prompts:
   - Longer/detailed answers ("বড় উত্তর", "ভালোভাবে বোঝাবে") => conciseAnswers: false, and set customTeacherPrompt accordingly.
   - Adding questions/topics/words => update samplePrompts, sampleWords, or customTeacherPrompt / customLivePrompt.`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.1,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              updateTitle: { type: Type.STRING },
              updateNotes: { type: Type.STRING },
              appName: { type: Type.STRING },
              attributionText: { type: Type.STRING },
              welcomeTitle: { type: Type.STRING },
              welcomeSubtitle: { type: Type.STRING },
              dictionaryTitle: { type: Type.STRING },
              dictionarySubtitle: { type: Type.STRING },
              accentColor: {
                type: Type.STRING,
                enum: ['blue', 'emerald', 'indigo', 'violet', 'rose', 'amber'],
              },
              pageBackground: {
                type: Type.STRING,
                enum: ['default', 'yellow', 'blue', 'emerald', 'rose', 'violet'],
              },
              fontScale: { type: Type.STRING, enum: ['normal', 'large'] },
              announcementBanner: { type: Type.STRING },
              defaultClass: {
                type: Type.STRING,
                enum: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
              },
              defaultVoice: {
                type: Type.STRING,
                enum: ['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir'],
              },
              defaultLiveRole: {
                type: Type.STRING,
                enum: ['english', 'bengali', 'bilingual'],
              },
              conciseAnswers: { type: Type.BOOLEAN },
              enableTeacher: { type: Type.BOOLEAN },
              enableLiveMode: { type: Type.BOOLEAN },
              enableDictionary: { type: Type.BOOLEAN },
              enableVoiceInput: { type: Type.BOOLEAN },
              enableVoiceOutput: { type: Type.BOOLEAN },
              enablePdfExport: { type: Type.BOOLEAN },
              enableCamera: { type: Type.BOOLEAN },
              customTeacherPrompt: { type: Type.STRING },
              customLivePrompt: { type: Type.STRING },
              samplePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
              sampleWords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['updateNotes'],
          },
        },
      });

      const rawJson = response.text?.trim() || '{}';
      const parsedPatch = JSON.parse(rawJson) as Partial<ServerAppConfig>;
      // Strip echoed string fields that only differ by trailing/leading whitespace
      for (const key of Object.keys(parsedPatch) as Array<keyof ServerAppConfig>) {
        const val = parsedPatch[key];
        const baseVal = baseCfg[key];
        if (
          key !== 'updateNotes' &&
          key !== 'updateTitle' &&
          typeof val === 'string' &&
          typeof baseVal === 'string' &&
          val.trim() === baseVal.trim()
        ) {
          delete parsedPatch[key];
        }
      }
      const mergedPreview = sanitizeAppConfig(parsedPatch, baseCfg);

      const trackedKeys: Array<[keyof ServerAppConfig, string]> = [
        ['appName', 'App Name'],
        ['attributionText', 'Header Attribution'],
        ['welcomeTitle', 'Welcome Heading'],
        ['welcomeSubtitle', 'Welcome Description'],
        ['dictionaryTitle', 'Dictionary Heading'],
        ['dictionarySubtitle', 'Dictionary Subtitle'],
        ['accentColor', 'Accent Color'],
        ['pageBackground', 'Page Background'],
        ['fontScale', 'Text Size'],
        ['announcementBanner', 'Announcement Banner'],
        ['enableTeacher', 'AI Teacher'],
        ['enableLiveMode', 'Live Mode'],
        ['enableDictionary', 'Dictionary Mode'],
        ['enableVoiceInput', 'Voice Mic'],
        ['enableVoiceOutput', 'Voice Output'],
        ['enablePdfExport', 'PDF Export'],
        ['enableCamera', 'Camera & Photos'],
        ['defaultClass', 'Default Class'],
        ['defaultVoice', 'Default Voice'],
        ['defaultLiveRole', 'Live Language'],
        ['conciseAnswers', 'Concise Answers'],
        ['customTeacherPrompt', 'Teacher AI Prompt'],
        ['customLivePrompt', 'Live AI Prompt'],
        ['samplePrompts', 'Sample Questions'],
        ['sampleWords', 'Sample Words'],
      ];
      const changedFields: string[] = [];
      for (const [key, label] of trackedKeys) {
        if (JSON.stringify(baseCfg[key]) !== JSON.stringify(mergedPreview[key])) {
          changedFields.push(label);
        }
      }

      return res.json({ suggestedConfig: mergedPreview, changedFields });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/admin/cache/clear', requireAdmin, (_req, res) => {
    dictionaryCache.clear();
    return res.json({ cleared: true, stats: getAdminStats() });
  });

  app.post('/api/admin/reset', requireAdmin, (_req, res) => {
    const nextVersion = (adminStore.config.configVersion || 1) + 1;
    adminStore.config = {
      ...DEFAULT_SERVER_CONFIG,
      configVersion: nextVersion,
      updateNotes: 'Restored default app settings.',
      updatedAt: Date.now(),
    };
    saveAdminStore(adminStore);
    return res.json({
      config: adminStore.config,
      stats: getAdminStats(),
    });
  });

  async function openFastStream(params: {
    ai: GoogleGenAI;
    primaryModel: string;
    primaryConfig: Record<string, unknown>;
    fallbackModel: string;
    fallbackConfig: Record<string, unknown>;
    contents: unknown;
    outerSignal: AbortSignal;
    hedgeDelayMs?: number;
  }): Promise<{
    firstText: string;
    iterator: AsyncIterator<{ text?: string }>;
    winnerAbort: AbortController;
  }> {
    const {
      ai,
      primaryModel,
      primaryConfig,
      fallbackModel,
      fallbackConfig,
      contents,
      outerSignal,
      hedgeDelayMs = 1300,
    } = params;

    type AttemptWin = {
      firstText: string;
      iterator: AsyncIterator<{ text?: string }>;
      winnerAbort: AbortController;
    };

    const launchAttempt = (
      model: string,
      config: Record<string, unknown>,
      attemptAbort: AbortController,
    ): Promise<AttemptWin> => {
      const onOuterAbort = () => attemptAbort.abort();
      if (outerSignal.aborted) {
        attemptAbort.abort();
      } else {
        outerSignal.addEventListener('abort', onOuterAbort, { once: true });
      }

      return (async () => {
        try {
          const stream = await ai.models.generateContentStream({
            model,
            contents: contents as never,
            config: {
              ...config,
              abortSignal: attemptAbort.signal,
            } as never,
          });

          const iterator = stream[Symbol.asyncIterator]();
          while (true) {
            const step = await iterator.next();
            if (step.done) {
              return { firstText: '', iterator, winnerAbort: attemptAbort };
            }
            const delta = step.value?.text ?? '';
            if (delta) {
              return { firstText: delta, iterator, winnerAbort: attemptAbort };
            }
          }
        } finally {
          outerSignal.removeEventListener('abort', onOuterAbort);
        }
      })();
    };

    return new Promise<AttemptWin>((resolve, reject) => {
      let settled = false;
      const abort1 = new AbortController();
      const abort2 = new AbortController();
      let started2 = false;
      let attempt1Failed = false;
      let attempt2Failed = false;
      let lastError: unknown;

      const finishWin = (win: AttemptWin, loserAbort: AbortController) => {
        if (settled) {
          win.winnerAbort.abort();
          return;
        }
        settled = true;
        clearTimeout(hedgeTimer);
        if (loserAbort !== win.winnerAbort) {
          loserAbort.abort();
        }
        resolve(win);
      };

      const maybeReject = (err: unknown) => {
        if (settled) return;
        lastError = err;
        if (outerSignal.aborted) {
          settled = true;
          clearTimeout(hedgeTimer);
          abort1.abort();
          abort2.abort();
          reject(err);
          return;
        }
        if (attempt1Failed && (!started2 || attempt2Failed)) {
          settled = true;
          clearTimeout(hedgeTimer);
          reject(lastError);
        }
      };

      const startSecond = () => {
        if (settled || started2 || outerSignal.aborted) return;
        started2 = true;
        launchAttempt(fallbackModel, fallbackConfig, abort2)
          .then((win) => finishWin(win, abort1))
          .catch((err) => {
            attempt2Failed = true;
            maybeReject(err);
          });
      };

      const hedgeTimer = setTimeout(startSecond, hedgeDelayMs);

      launchAttempt(primaryModel, primaryConfig, abort1)
        .then((win) => finishWin(win, abort2))
        .catch((err) => {
          attempt1Failed = true;
          const msg = err instanceof Error ? err.message : String(err);
          const isNonRetryable =
            outerSignal.aborted ||
            msg.includes('API_KEY_INVALID') ||
            msg.includes('PERMISSION_DENIED') ||
            msg.includes('400') ||
            msg.includes('403') ||
            msg.includes('404');
          if (!isNonRetryable && !started2) {
            clearTimeout(hedgeTimer);
            startSecond();
            return;
          }
          maybeReject(err);
        });
    });
  }

  async function generateWithFastHedge<T>(
    runPrimary: (signal: AbortSignal) => Promise<T>,
    runFallback: (signal: AbortSignal) => Promise<T>,
    hedgeDelayMs = 2800,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let settled = false;
      const abort1 = new AbortController();
      const abort2 = new AbortController();
      let started2 = false;
      let err1 = false;
      let err2 = false;
      let lastError: unknown;

      const win = (value: T, loser: AbortController) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        loser.abort();
        resolve(value);
      };

      const startSecond = () => {
        if (settled || started2) return;
        started2 = true;
        runFallback(abort2.signal)
          .then((v) => win(v, abort1))
          .catch((e) => {
            err2 = true;
            lastError = e;
            if (err1 && !settled) {
              settled = true;
              clearTimeout(timer);
              reject(lastError);
            }
          });
      };

      const timer = setTimeout(startSecond, hedgeDelayMs);

      runPrimary(abort1.signal)
        .then((v) => win(v, abort2))
        .catch((e) => {
          err1 = true;
          lastError = e;
          const msg = e instanceof Error ? e.message : String(e);
          const isNonRetryable =
            msg.includes('API_KEY_INVALID') ||
            msg.includes('PERMISSION_DENIED') ||
            msg.includes('400') ||
            msg.includes('403') ||
            msg.includes('404');
          if (!isNonRetryable && !started2) {
            clearTimeout(timer);
            startSecond();
            return;
          }
          if (!started2 || err2) {
            settled = true;
            clearTimeout(timer);
            reject(lastError);
          }
        });
    });
  }

  function wantsDetailedExplanation(text: string): boolean {
    if (!text) return false;
    return /গল্প|কাহিনী|কাহিনি|কবিতা|রচনা|উপন্যাস|নাটক|সারাংশ|সারমর্ম|বিষয়বস্তু|মূলভাব|চরিত্র|বিস্তারিত|ভালোভাবে|ভালভাবে|ভালো করে|ভাল করে|সম্পূর্ণ|পুরোটা|পুরো|ব্যাখ্যা|বুঝিয়ে|বোঝাও|আলোচনা|প্রবন্ধ|বড়|লম্বা|ছোট|লিখে দাও|আরও|আরেকটু|৫ নম্বর|৮ নম্বর|story|stories|poem|chapter|essay|detail|detailed|elaborate|explain well|explain properly|summary|summarize|full|thorough|properly|long|longer|big|bigger|expand|write more|bistarito|bhalo kore|valo kore|boro kore|golpo|kobita/i.test(
      text,
    );
  }

  app.post('/api/teacher', async (req, res) => {
    try {
      const activeConfig = await syncConfigFromFirestore();
      if (activeConfig.maintenanceMode) {
        return res.status(503).json({ error: activeConfig.maintenanceMessage });
      }
      if (!activeConfig.enableTeacher) {
        return res.status(403).json({ error: 'AI Teacher is currently disabled by Admin.' });
      }

      const { className, question, image } = req.body as {
        className?: string;
        question?: string;
        image?: { base64?: string; mimeType?: string };
      };

      const trimmedQuestion = (question ?? '').trim();
      const base64Data = image?.base64?.trim();
      const mimeType = image?.mimeType?.trim() || 'image/jpeg';

      if (base64Data && !activeConfig.enableCamera) {
        return res.status(403).json({ error: 'Camera and image uploads are disabled by Admin.' });
      }

      if (!trimmedQuestion && !base64Data) {
        return res.status(400).json({
          error: 'Please enter a question or attach a photo of your problem.',
        });
      }

      totalAiRequests += 1;
      const targetClass = className?.trim() || activeConfig.defaultClass || 'Class 8';

      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (base64Data) {
        const cleanedBase64 = base64Data.includes(',')
          ? base64Data.split(',')[1]
          : base64Data;

        parts.push({
          inlineData: {
            mimeType,
            data: cleanedBase64,
          },
        });
      }

      const userPrompt = base64Data
        ? trimmedQuestion
          ? `${targetClass} (WBBSE) | ছবি + প্রশ্ন: "${trimmedQuestion}"`
          : `${targetClass} (WBBSE) | ছবির প্রশ্ন বা অঙ্কটি সহজ বাংলায় বুঝিয়ে দাও।`
        : `${targetClass} (WBBSE) | প্রশ্ন: "${trimmedQuestion}"`;

      parts.push({ text: userPrompt });

      const extraRule = activeConfig.customTeacherPrompt
        ? ` Admin instructions: ${activeConfig.customTeacherPrompt}`
        : '';
      const wantsDetailed = wantsDetailedExplanation(trimmedQuestion) || !activeConfig.conciseAnswers;

      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts },
        config: {
          temperature: activeConfig.temperature,
          maxOutputTokens: wantsDetailed ? 6500 : 1800,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          systemInstruction: wantsDetailed
            ? `WBBSE ${targetClass} Bengali tutor & master storyteller. The student wants a LONG, FULL, rich, detailed Bengali response (at least 550–900 words across multiple full descriptive paragraphs—NEVER a brief summary or short bullet-only note). For stories/poems/chapters (গল্প/কবিতা/অধ্যায়), write the complete narrative from start to finish with vivid scenes, characters, dialogues, step-by-step explanation, moral, and key points using clear headings and **bold** terms.${extraRule}`
            : `WBBSE ${targetClass} Bengali tutor. Answer clearly and helpfully in Bengali (বাংলা) using easy steps and **bold** key terms. If the question asks about a story or to explain well/bigger, write a long, complete multi-paragraph explanation—never give a tiny 1-2 line answer.${extraRule}`,
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        return res.status(502).json({
          error: 'No explanation was generated. Please try rephrasing or uploading a clearer photo.',
        });
      }

      return res.json({ answer });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/teacher/stream', async (req, res) => {
    const activeConfig = await syncConfigFromFirestore();
    if (activeConfig.maintenanceMode) {
      return res.status(503).json({ error: activeConfig.maintenanceMessage });
    }
    if (!activeConfig.enableTeacher) {
      return res.status(403).json({ error: 'AI Teacher is currently disabled by Admin.' });
    }

    let clientClosed = false;
    const upstreamAbort = new AbortController();
    res.on('close', () => {
      if (!res.writableEnded) {
        clientClosed = true;
        upstreamAbort.abort();
      }
    });

    try {
      const { className, messages, temperature, concise, studentName } = req.body as {
        className?: string;
        temperature?: number;
        concise?: boolean;
        studentName?: string;
        messages?: Array<{
          role: 'user' | 'model';
          text?: string;
          image?: { base64?: string; mimeType?: string };
        }>;
      };
      const safeStudentName = typeof studentName === 'string'
        ? studentName.replace(/[\r\n<>`"]/g, '').trim().slice(0, 40)
        : '';

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: 'Please enter a message or attach a photo first.',
        });
      }

      totalAiRequests += 1;
      const targetClass = className?.trim() || activeConfig.defaultClass || 'Class 8';
      const safeTemperature =
        typeof temperature === 'number' && Number.isFinite(temperature)
          ? Math.min(1, Math.max(0, temperature))
          : activeConfig.temperature;
      const useConcise =
        typeof concise === 'boolean' ? concise : activeConfig.conciseAnswers;

      const lastUserText = messages[messages.length - 1]?.text ?? '';
      const wantsPdf = /\bpdf\b|পিডিএফ/i.test(lastUserText);

      const contents = messages
        .map((msg) => {
          const parts: Array<
            | { text: string }
            | { inlineData: { mimeType: string; data: string } }
          > = [];

          const base64Data = msg.image?.base64?.trim();
          if (base64Data) {
            const cleanedBase64 = base64Data.includes(',')
              ? base64Data.split(',')[1]
              : base64Data;
            parts.push({
              inlineData: {
                mimeType: msg.image?.mimeType?.trim() || 'image/jpeg',
                data: cleanedBase64,
              },
            });
          }

          const trimmedText = (msg.text ?? '').trim();
          if (trimmedText) {
            parts.push({ text: trimmedText });
          } else if (base64Data && msg.role === 'user') {
            parts.push({
              text: 'ছবির লেখা, গল্প বা প্রশ্নটি ভালোভাবে ও ধাপে ধাপে সহজ বাংলায় বুঝিয়ে দাও।',
            });
          }

          return {
            role: msg.role === 'model' ? 'model' : 'user',
            parts,
          };
        })
        .filter((entry) => entry.parts.length > 0);

      if (contents.length === 0) {
        return res.status(400).json({
          error: 'Please enter a message or attach a photo first.',
        });
      }

      const ai = getAIClient();

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();
      res.write(': stream-start\n\n');

      const studentNameRule = safeStudentName
        ? ` HIGHEST-PRIORITY STUDENT NAME RULE: The current student using this app has entered their name as "${safeStudentName}". ALWAYS address them warmly and naturally by their own name (${safeStudentName}) at the start or while encouraging them (for example: "${safeStudentName}, ..." or "খুব সুন্দর প্রশ্ন করেছ ${safeStudentName}!"), and ignore any other single student's name written in admin notes.`
        : '';
      const extraRule =
        (activeConfig.customTeacherPrompt
          ? ` Admin instructions: ${activeConfig.customTeacherPrompt}`
          : '') + studentNameRule;

      const recentUserTexts = messages
        .filter((m) => m.role === 'user')
        .slice(-4)
        .map((m) => m.text ?? '')
        .join(' ');
      const wantsDetailed =
        wantsPdf || !useConcise || wantsDetailedExplanation(recentUserTexts);

      const teacherSystemInstruction = wantsDetailed
        ? `WBBSE ${targetClass} Bengali tutor & master storyteller. Write a LONG, COMPLETE, deeply engaging and easy-to-understand explanation in natural Bengali (বাংলা) — aim for at least 600–950 words across rich, well-developed full paragraphs. NEVER cut short, rush, or compress a story into tiny 2-line bullet points! ` +
          `When telling or explaining a story, poem, or chapter (গল্প, কবিতা বা অধ্যায়), clearly organize into: ১. মূল বিষয়বস্তু ও পটভূমি, ২. সম্পূর্ণ ও বিস্তারিত কাহিনী (শুরু থেকে শেষ পর্যন্ত সুন্দর পূর্ণাঙ্গ অনুচ্ছেদে, চরিত্রের অনুভূতি ও সংলাপসহ), ৩. গুরুত্বপূর্ণ চরিত্র বিশ্লেষণ ও মূল শিক্ষা, এবং ৪. পরীক্ষার জন্য গুরুত্বপূর্ণ প্রশ্নোত্তর ও **গুরুত্বপূর্ণ শব্দ**। ` +
          `If the student asks to make a previous answer bigger/longer ("বড় দাও", "আরও বড়", "ছোট দিচ্ছে"), expand it significantly with full scenes and deep explanations. ` +
          `For PDF requests ("PDF"/"পিডিএফ"), write clean \`# Title\` + \`##\` structured study notes directly.${extraRule}`
        : `WBBSE ${targetClass} Bengali tutor. Answer clearly and accurately in Bengali (বাংলা) using well-organized steps and **bold** key terms. ` +
          `If the student asks to explain a story, chapter, or says "ভালোভাবে বুঝিয়ে দাও" / "বড় করে দাও", switch immediately to a long, full, multi-paragraph explanation without rushing. ` +
          `For PDF requests ("PDF"/"পিডিএফ"), write clean \`# Title\` + \`##\` study notes directly.${extraRule}`;

      const teacherConfig = {
        temperature: safeTemperature,
        maxOutputTokens: wantsDetailed ? 6500 : 1800,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        systemInstruction: teacherSystemInstruction,
      };

      const { firstText, iterator } = await openFastStream({
        ai,
        primaryModel: MODEL_NAME,
        primaryConfig: teacherConfig,
        fallbackModel: MODEL_NAME,
        fallbackConfig: teacherConfig,
        contents,
        outerSignal: upstreamAbort.signal,
        hedgeDelayMs: 1300,
      });

      if (!clientClosed && firstText) {
        res.write(`data: ${JSON.stringify({ text: firstText })}\n\n`);
      }

      while (!clientClosed) {
        const next = await iterator.next();
        if (next.done) break;
        const delta = next.value?.text;
        if (delta && !clientClosed) {
          res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
        }
      }

      if (!clientClosed && !res.writableEnded) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    } catch (error) {
      if (clientClosed) return;
      const { status, message } = formatGeminiError(error);
      if (!res.headersSent) {
        return res.status(status).json({ error: message });
      }
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      }
    }
  });

  app.post('/api/teacher/quiz', async (req, res) => {
    try {
      const activeConfig = await syncConfigFromFirestore();
      if (activeConfig.maintenanceMode) {
        return res.status(503).json({ error: activeConfig.maintenanceMessage });
      }
      if (!activeConfig.enableTeacher) {
        return res.status(403).json({ error: 'AI Teacher is currently disabled by Admin.' });
      }

      const { className, topicPrompt, count, recentContext, image, studentName } = req.body as {
        className?: string;
        topicPrompt?: string;
        count?: number;
        studentName?: string;
        recentContext?: Array<{ role: 'user' | 'model'; text?: string }>;
        image?: { base64?: string; mimeType?: string };
      };
      const safeQuizStudentName = typeof studentName === 'string'
        ? studentName.replace(/[\r\n<>`"]/g, '').trim().slice(0, 40)
        : '';

      const trimmedPrompt = (topicPrompt ?? '').trim();
      const base64Data = image?.base64?.trim();
      const mimeType = image?.mimeType?.trim() || 'image/jpeg';

      if (base64Data && !activeConfig.enableCamera) {
        return res.status(403).json({ error: 'Camera and image uploads are disabled by Admin.' });
      }

      if (!trimmedPrompt && !base64Data) {
        return res.status(400).json({
          error: 'অনুগ্রহ করে যেকোনো একটি টপিক বলো যার ওপর কুইজ বানাতে চাও।',
        });
      }

      totalAiRequests += 1;
      const targetClass = className?.trim() || activeConfig.defaultClass || 'Class 8';
      const safeCount =
        typeof count === 'number' && Number.isFinite(count)
          ? Math.max(3, Math.min(15, Math.floor(count)))
          : 5;

      // Decide language: Bengali by default for Bengali or Banglish prompts; English only if pure English without Bengali/Banglish cues
      const hasBengaliScript = /[\u0980-\u09FF]/.test(trimmedPrompt);
      const hasBanglishCues =
        /\b(niye|nie|banao|banaw|baniye|banie|prosno|proshno|dao|daw|toiri|koro|amake|amar|bangla|itihas|bhugol|vugol|bigyan|gonit|onk|choto|boro|opor|upor)\b/i.test(
          trimmedPrompt,
        );
      const wantsExplicitEnglish =
        /\b(in english|english quiz|english grammar|tense|voice change|narration|preposition|article)\b/i.test(
          trimmedPrompt,
        );
      const targetLanguage: 'bn' | 'en' =
        hasBengaliScript || hasBanglishCues
          ? 'bn'
          : wantsExplicitEnglish || /^[a-zA-Z0-9\s.,?!'"()\-:/]+$/.test(trimmedPrompt)
            ? 'en'
            : 'bn';

      const contextLines = Array.isArray(recentContext)
        ? recentContext
            .slice(-4)
            .map((m) => `${m.role === 'user' ? 'Student' : 'Teacher'}: ${(m.text ?? '').trim().slice(0, 320)}`)
            .filter((line) => line.length > 10)
        : [];

      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (base64Data) {
        const cleanedBase64 = base64Data.includes(',')
          ? base64Data.split(',')[1]
          : base64Data;
        parts.push({
          inlineData: {
            mimeType,
            data: cleanedBase64,
          },
        });
      }

      const contextBlock =
        contextLines.length > 0
          ? `\nRecent conversation context (use this if the student says "this topic" / "এর ওপর"):\n${contextLines.join('\n')}\n`
          : '';

      const promptText =
        `Student Class: ${targetClass} (West Bengal Board WBBSE)\n` +
        (safeQuizStudentName ? `Student Name: ${safeQuizStudentName}\n` : '') +
        `Number of questions required: EXACTLY ${safeCount}\n` +
        `Output language: ${targetLanguage === 'bn' ? 'Natural Bengali (বাংলা)' : 'Clear English'}\n` +
        contextBlock +
        `Student quiz request: "${trimmedPrompt || 'Create a quiz from this textbook image'}"\n` +
        `Generate ${safeCount} accurate, syllabus-appropriate multiple-choice quiz questions strictly on the requested topic. ` +
        `Every question MUST have EXACTLY 4 distinct, plausible options (do NOT prefix options with A/B/C/D or ক/খ/গ/ঘ), ` +
        `a single accurate 0-based correctIndex (0, 1, 2, or 3), and a brief, helpful explanation.`;

      parts.push({ text: promptText });

      const ai = getAIClient();
      const extraRule = activeConfig.customTeacherPrompt
        ? ` Admin instructions: ${activeConfig.customTeacherPrompt}`
        : '';

      const runQuizCall = (signal: AbortSignal) =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: { parts },
          config: {
            temperature: Math.min(0.6, Math.max(0.2, activeConfig.temperature || 0.3)),
            maxOutputTokens: 3200,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            abortSignal: signal,
            systemInstruction:
              `You are an expert WBBSE ${targetClass} school teacher creating interactive 4-option MCQ quizzes. ` +
              `Always verify factual accuracy so correctIndex strictly matches the truly correct option among the 4 options. ` +
              `Keep questions clear, engaging, and well-suited for ${targetClass} students. Never include option letter prefixes like "ক)" or "A." inside option text.${extraRule}`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'Short engaging quiz title in the target language',
                },
                topic: {
                  type: Type.STRING,
                  description: 'Concise topic name in the target language',
                },
                language: {
                  type: Type.STRING,
                  enum: ['bn', 'en'],
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Exactly 4 distinct answer options without A/B/C/D or ক/খ/গ/ঘ prefixes',
                      },
                      correctIndex: {
                        type: Type.INTEGER,
                        description: '0-based index (0, 1, 2, or 3) of the correct option',
                      },
                      explanation: {
                        type: Type.STRING,
                        description: 'Short 1-2 sentence explanation of the correct answer',
                      },
                    },
                    required: ['question', 'options', 'correctIndex', 'explanation'],
                  },
                },
              },
              required: ['title', 'topic', 'language', 'questions'],
            },
          },
        });

      const response = await generateWithFastHedge(runQuizCall, runQuizCall, 4500);
      const rawJson = (response.text ?? '').trim();
      if (!rawJson) {
        return res.status(502).json({ error: 'কুইজ তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করো।' });
      }

      const parsed = JSON.parse(rawJson) as {
        title?: string;
        topic?: string;
        language?: string;
        questions?: Array<{
          question?: string;
          options?: unknown;
          correctIndex?: number;
          explanation?: string;
        }>;
      };

      const cleanOptionPrefix = (opt: string) =>
        opt
          .trim()
          .replace(/^(?:[কখগঘA-Da-d1-4]\s*[).:\-–]|\([কখগঘA-Da-d1-4]\))\s*/, '')
          .trim();

      const sanitizedQuestions = (Array.isArray(parsed.questions) ? parsed.questions : [])
        .map((q, idx) => {
          const questionText = typeof q?.question === 'string' ? q.question.trim() : '';
          const rawOpts = Array.isArray(q?.options)
            ? q.options
                .filter((o): o is string => typeof o === 'string')
                .map(cleanOptionPrefix)
                .filter(Boolean)
            : [];
          if (!questionText || rawOpts.length < 4) return null;

          const options: [string, string, string, string] = [
            rawOpts[0],
            rawOpts[1],
            rawOpts[2],
            rawOpts[3],
          ];
          const rawIdx = typeof q?.correctIndex === 'number' ? Math.floor(q.correctIndex) : 0;
          const correctIndex = rawIdx >= 0 && rawIdx <= 3 ? rawIdx : 0;
          const explanation =
            typeof q?.explanation === 'string' && q.explanation.trim()
              ? q.explanation.trim()
              : targetLanguage === 'bn'
                ? `সঠিক উত্তর হলো "${options[correctIndex]}"।`
                : `The correct answer is "${options[correctIndex]}".`;

          return {
            id: `q-${Date.now()}-${idx}`,
            question: questionText,
            options,
            correctIndex,
            explanation,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .slice(0, 15);

      if (sanitizedQuestions.length === 0) {
        return res.status(502).json({
          error: 'সঠিক ৪ অপশনের কুইজ তৈরি করা যায়নি। টপিকটি স্পষ্ট করে আবার বলো।',
        });
      }

      const quizLanguage: 'bn' | 'en' =
        parsed.language === 'en' && targetLanguage === 'en' ? 'en' : 'bn';
      const topicName =
        (typeof parsed.topic === 'string' && parsed.topic.trim()) ||
        trimmedPrompt.slice(0, 60) ||
        targetClass;
      const quizTitle =
        (typeof parsed.title === 'string' && parsed.title.trim()) ||
        (quizLanguage === 'bn' ? `${topicName} — কুইজ` : `${topicName} Quiz`);

      const quiz = {
        title: quizTitle,
        topic: topicName,
        className: targetClass,
        language: quizLanguage,
        questions: sanitizedQuestions,
        source: 'online' as const,
      };

      const summaryText =
        quizLanguage === 'bn'
          ? `**${quiz.title}** তৈরি হয়েছে! মোট **${quiz.questions.length}টি প্রশ্ন** এবং প্রতিটি প্রশ্নে **৪টি করে অপশন** আছে। নিচের কুইজ কার্ড থেকে সঠিক উত্তরটি বেছে নাও:`
          : `**${quiz.title}** is ready! It includes **${quiz.questions.length} questions** with **4 options** each. Tap an answer below to begin:`;

      return res.json({ quiz, summaryText });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const activeConfig = await syncConfigFromFirestore();
      if (activeConfig.maintenanceMode) {
        return res.status(503).json({ error: activeConfig.maintenanceMessage });
      }
      if (!activeConfig.enableVoiceOutput) {
        return res.status(403).json({ error: 'Voice playback is currently disabled by Admin.' });
      }

      const { text, voiceName } = req.body as {
        text?: string;
        voiceName?: string;
      };

      const cleaned = (text ?? '').trim();
      if (!cleaned) {
        return res.status(400).json({ error: 'Text is required for speech playback.' });
      }

      totalAiRequests += 1;
      const selectedVoice =
        voiceName && ALLOWED_VOICES.has(voiceName)
          ? voiceName
          : activeConfig.defaultVoice || 'Kore';
      const truncated = cleaned.length > 4500 ? `${cleaned.slice(0, 4500)}...` : cleaned;

      const ai = getLiveAIClient();
      const response = await ai.models.generateContent({
        model: TTS_MODEL_NAME,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: truncated,
                speechMetadata: {
                  style: 'Warm, clear, encouraging personal tutor speaking naturally',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        return res.status(502).json({
          error: 'Could not synthesize voice audio.',
        });
      }

      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/transcribe', async (req, res) => {
    try {
      const activeConfig = await syncConfigFromFirestore();
      if (activeConfig.maintenanceMode) {
        return res.status(503).json({ error: activeConfig.maintenanceMessage });
      }
      if (!activeConfig.enableVoiceInput) {
        return res.status(403).json({ error: 'Voice microphone input is currently disabled by Admin.' });
      }

      const { audioBase64, mimeType, lang } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        lang?: string;
      };

      const rawBase64 = (audioBase64 ?? '').trim();
      if (!rawBase64) {
        return res.status(400).json({ error: 'Audio recording is empty.' });
      }

      totalAiRequests += 1;

      const cleanedBase64 = rawBase64.includes(',')
        ? rawBase64.split(',')[1]
        : rawBase64;
      const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim() || 'audio/webm';

      const prompt =
        lang === 'en-IN'
          ? 'Transcribe the spoken audio accurately in English (preserve any Bengali words or academic terms like Geography, History, Science, Math). Return only the exact spoken words.'
          : 'Transcribe this audio accurately. The speaker speaks Bengali (বাংলা) about school studies and may include English subject terms like Geography, History, Science, Physics, Chemistry, Biology, Math, Chapter, or PDF, as well as common Bengali feedback words like গল্প, ছোট, বড়, ভালোভাবে, বুঝিয়ে দাও. Distinguish carefully between ছোট (short/small) and ফটো (photo) based on sentence meaning. Write Bengali words in Bengali script and English words naturally as spoken. Return only the exact spoken words.';

      const aiBeta = getLiveAIClient();
      const aiV1 = getAIClient();
      const audioParts = [
        {
          inlineData: {
            mimeType: cleanMime,
            data: cleanedBase64,
          },
        },
        { text: prompt },
      ];

      const transcript = await generateWithFastHedge(
        async (signal) => {
          const primaryRes = await aiBeta.models.generateContent({
            model: TRANSCRIBE_MODEL_NAME,
            contents: { parts: audioParts },
            config: {
              abortSignal: signal,
            },
          });
          const text = (primaryRes.text ?? '').trim();
          if (!text) {
            throw new Error('EMPTY_TRANSCRIPT');
          }
          return text;
        },
        async (signal) => {
          const fallbackRes = await aiV1.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: audioParts },
            config: {
              abortSignal: signal,
              temperature: 0,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            },
          });
          return (fallbackRes.text ?? '').trim();
        },
        800,
      );

      return res.json({ transcript });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/dictionary', async (req, res) => {
    try {
      const activeConfig = await syncConfigFromFirestore();
      if (activeConfig.maintenanceMode) {
        return res.status(503).json({ error: activeConfig.maintenanceMessage });
      }
      if (!activeConfig.enableDictionary) {
        return res.status(403).json({ error: 'Dictionary is currently disabled by Admin.' });
      }

      const { word, temperature } = req.body as {
        word?: string;
        temperature?: number;
      };
      const trimmedWord = (word ?? '').trim();

      if (!trimmedWord) {
        return res.status(400).json({
          error: 'Please enter a word to look up.',
        });
      }

      totalAiRequests += 1;
      const cacheKey = trimmedWord.toLowerCase();
      const cached = dictionaryCache.get(cacheKey);
      if (cached) {
        return res.json({ entry: cached });
      }

      const safeTemperature =
        typeof temperature === 'number' && Number.isFinite(temperature)
          ? Math.min(1, Math.max(0, temperature))
          : activeConfig.temperature;

      const dictSystemInstruction =
        'Bengali dictionary & WBBSE grammar analyzer. Reply strictly in brief, accurate Bengali JSON. For non-Bengali words, set sandhiVicched to "প্রযোজ্য নয় (বিদেশি শব্দ)".';
      const dictSchema = {
        type: Type.OBJECT,
        properties: {
          word: {
            type: Type.STRING,
            description: 'Headword.',
          },
          pronunciation: {
            type: Type.STRING,
            description: 'উচ্চারণ — Bengali phonetic pronunciation.',
          },
          meaning: {
            type: Type.STRING,
            description: 'অর্থ — Short Bengali meanings and synonyms.',
          },
          sandhiVicched: {
            type: Type.STRING,
            description: 'সন্ধি বিচ্ছেদ — Breakdown or note if not applicable.',
          },
          grammar: {
            type: Type.STRING,
            description: 'ব্যাকরণগত পরিচয় — Part of speech (পদ) and origin.',
          },
          exampleSentences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'বাক্য রচনা — 2 short Bengali example sentences.',
          },
        },
        required: [
          'word',
          'pronunciation',
          'meaning',
          'sandhiVicched',
          'grammar',
          'exampleSentences',
        ],
      };

      const ai = getAIClient();
      const response = await generateWithFastHedge(
        (signal) =>
          ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Word: "${trimmedWord}"`,
            config: {
              abortSignal: signal,
              temperature: safeTemperature,
              maxOutputTokens: 500,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
              systemInstruction: dictSystemInstruction,
              responseMimeType: 'application/json',
              responseSchema: dictSchema,
            },
          }),
        (signal) =>
          ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Word: "${trimmedWord}"`,
            config: {
              abortSignal: signal,
              temperature: safeTemperature,
              maxOutputTokens: 500,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
              systemInstruction: dictSystemInstruction,
              responseMimeType: 'application/json',
              responseSchema: dictSchema,
            },
          }),
        1800,
      );

      const jsonText = (response.text ?? '').trim();
      if (!jsonText) {
        return res.status(502).json({
          error: 'Could not generate a dictionary entry for this word.',
        });
      }

      const parsed = JSON.parse(jsonText) as Record<string, unknown>;
      if (dictionaryCache.size >= MAX_DICT_CACHE) {
        const oldestKey = dictionaryCache.keys().next().value;
        if (oldestKey) dictionaryCache.delete(oldestKey);
      }
      dictionaryCache.set(cacheKey, parsed);
      return res.json({ entry: parsed });
    } catch (error) {
      const { status, message } = formatGeminiError(error);
      return res.status(status).json({ error: message });
    }
  });

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
    maxPayload: 10 * 1024 * 1024,
  });

  httpServer.on('upgrade', (req, socket, head) => {
    try {
      const reqUrl = new URL(req.url || '/', 'http://localhost');
      if (reqUrl.pathname === '/api/live') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      }
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs, req) => {
    const sendJson = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        try {
          clientWs.send(JSON.stringify(payload));
        } catch {
          // Ignore send errors on closing socket
        }
      }
    };

    const activeConfig = await syncConfigFromFirestore();

    if (activeConfig.maintenanceMode) {
      sendJson({ type: 'error', error: activeConfig.maintenanceMessage });
      clientWs.close();
      return;
    }

    if (!activeConfig.enableLiveMode) {
      sendJson({ type: 'error', error: 'Live Voice Mode is currently disabled by Admin.' });
      clientWs.close();
      return;
    }

    activeLiveConnections += 1;
    totalAiRequests += 1;
    let decrementedLive = false;
    const releaseLiveCount = () => {
      if (!decrementedLive) {
        decrementedLive = true;
        activeLiveConnections = Math.max(0, activeLiveConnections - 1);
      }
    };

    let isAlive = true;
    clientWs.on('pong', () => {
      isAlive = true;
    });
    const pingTimer = setInterval(() => {
      if (clientWs.readyState !== WebSocket.OPEN) return;
      if (!isAlive) {
        clientWs.terminate();
        return;
      }
      isAlive = false;
      try {
        clientWs.ping();
      } catch {
        // Ignore ping errors on closing socket
      }
    }, 20000);

    try {
      const url = new URL(req.url || '/api/live', 'http://localhost');
      const className = (url.searchParams.get('className') || activeConfig.defaultClass || 'Class 8').trim();
      const rawVoice = url.searchParams.get('voiceName') || activeConfig.defaultVoice || 'Zephyr';
      const voiceName = ALLOWED_VOICES.has(rawVoice) ? rawVoice : 'Zephyr';
      const rawLiveRole = url.searchParams.get('liveRole') || activeConfig.defaultLiveRole;
      const liveRole: 'english' | 'bengali' | 'bilingual' =
        rawLiveRole === 'bengali' || rawLiveRole === 'bilingual'
          ? rawLiveRole
          : 'english';
      const voiceOnly = url.searchParams.get('voiceOnly') === '1';
      const rawStudentName = url.searchParams.get('studentName') || '';
      const safeLiveStudentName = rawStudentName
        .replace(/[\r\n<>`"]/g, '')
        .trim()
        .slice(0, 40);

      const extraLiveRule = activeConfig.customLivePrompt
        ? ` Admin instructions: ${activeConfig.customLivePrompt}`
        : '';
      const liveStudentNameRule = safeLiveStudentName
        ? ` HIGHEST-PRIORITY STUDENT NAME RULE: The current student talking to you has entered their name as "${safeLiveStudentName}". ALWAYS greet and address them warmly by their own name (${safeLiveStudentName}) naturally, and ignore any other student's name mentioned elsewhere.`
        : '';

      const isSpuriousForeignTranscript = (text: string): boolean => {
        const cleaned = text.trim();
        if (!cleaned) return true;
        // Reject hallucinated Chinese/Japanese/Korean/Arabic/Cyrillic/Thai/Devanagari/Hebrew noise frames
        if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f\u0900-\u097f\u0590-\u05ff]/.test(cleaned)) {
          return true;
        }
        return false;
      };

      const systemInstruction =
        (liveRole === 'english'
          ? `You are a friendly spoken English teacher having a DIRECT live voice conversation with a West Bengal Board (${className}) student. ` +
            'STRICT LANGUAGE LOCK & NO TRANSLATION: Speak ONLY in 100% pure, simple English. NEVER speak, switch to, or translate into Chinese, Spanish, French, Hindi, Urdu, Arabic, Japanese, Korean, Bengali, or any other language! Do NOT act as a translator—just talk directly with the student naturally. ' +
            'CLARITY RULE: Listen carefully to Indian/Bengali English pronunciation (e.g., Geography, History, Science, Physics, Chemistry, Math). If background noise or static sounds unclear, NEVER guess a foreign language—stay quiet or politely ask once in English to repeat. Never repeat the same greeting twice. ' +
            'VISION RULE: The student may show you textbook pages, handwritten notes, or photos via live camera or captured images. Read what is visible accurately and explain clearly in English. ' +
            'STORYTELLING & DEPTH RULE: Keep quick greetings conversational, but whenever the student asks for a story, chapter, or asks to "explain well" / "make it longer" / "bigger" / "tell the whole story", tell the ENTIRE full-length story vividly from start to finish across 12-20+ complete sentences.'
          : liveRole === 'bengali'
            ? `You are a warm, friendly West Bengal Board (${className}) Bengali AI Teacher having a DIRECT real-time spoken conversation with your student. ` +
              'ABSOLUTE BENGALI LANGUAGE LOCK & NO TRANSLATION RULE: The student is a Bengali speaker from West Bengal speaking Bengali (বাংলা), occasionally mixing common English school terms (Geography, History, Science, Math, Chapter, Newton, Photosynthesis, etc.). ALWAYS reply ONLY in natural, fluent West Bengal Bengali (বাংলা)! NEVER speak, switch to, or translate into Chinese (中文), Spanish (Español), Hindi (हिन्दी), Urdu, Arabic, Japanese, Korean, French, or full English sentences! You are NOT a translator—do NOT translate what the student says; have a direct, friendly, natural conversation with them in pure Bengali! Even if microphone audio has background noise or unclear words, NEVER guess Chinese, Spanish, or any foreign language—always assume the student is speaking Bengali (বাংলা) and respond warmly in Bengali (or briefly ask "আরেকবার বলো তো?" in Bengali). Never repeat the same greeting twice. ' +
              'VISION RULE: শিক্ষার্থী লাইভ ক্যামেরা বা বইয়ের ছবি তুলে পাঠাতে পারে। ছবিতে যা লেখা বা আঁকা আছে তা ভালো করে দেখে সহজ বাংলায় বুঝিয়ে বলুন। ' +
              'STORYTELLING & DEPTH RULE: সাধারণ হ্যালো/হ্যাঁ/না কথাবার্তায় স্বাভাবিক ও সংক্ষিপ্ত থাকুন। কিন্তু শিক্ষার্থী যখন কোনো গল্প, কাহিনী, কবিতা, ইতিহাস বা অধ্যায় জানতে চায়—অথবা বলে "গল্প বলো", "বড় করে বলো", "ভালোভাবে বুঝিয়ে দাও", "ছোট দিচ্ছে বড় দাও", "বিস্তারিত বলো", বা "পুরোটা বলো"—তখন শুরু থেকে শেষ পর্যন্ত ধাপে ধাপে, সুন্দর বর্ণনা, চরিত্রের সংলাপ ও সহজ উদাহরণসহ একদম বড়, পূর্ণাঙ্গ ও প্রাণবন্তভাবে (কমপক্ষে ১২–২০টি পূর্ণ বাক্যে) পুরো গল্প বা বিষয়টি বলে ও বুঝিয়ে শোনান।'
            : `You are a friendly bilingual West Bengal Board (${className}) AI Teacher having a DIRECT live conversation with a student. ` +
              'STRICT LANGUAGE LOCK: Speak ONLY Bengali (বাংলা) and English—NEVER speak, switch to, or translate into Chinese, Spanish, French, Hindi, Urdu, Arabic, Japanese, Korean, or any other language! Do NOT act as an automatic translator unless the student explicitly asks to translate something. Understand both Bengali and English academic terms accurately. Never repeat the same sentence twice. ' +
              'VISION RULE: The student may show textbook pages, math problems, or notes via live camera or captured photos. Read the image carefully and explain clearly. ' +
              'STORYTELLING & DEPTH RULE: Keep casual greetings brief, BUT whenever the student asks for a story, chapter, or asks to explain well / make it longer ("গল্প", "বড় করে বলো", "ভালোভাবে বুঝিয়ে দাও", "longer", "bigger"), tell the ENTIRE story or explanation richly from start to finish in 12-20+ full sentences without stopping early.') + extraLiveRule + liveStudentNameRule;

      const ai = getLiveAIClient();
      let isClosed = false;
      let sessionReady = false;

      const liveConnectConfig: Record<string, unknown> = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
        systemInstruction,
      };
      if (!voiceOnly) {
        liveConnectConfig.inputAudioTranscription = {};
        liveConnectConfig.outputAudioTranscription = {};
      }

      const sessionPromise = ai.live.connect({
        model: LIVE_MODEL_NAME,
        config: liveConnectConfig,
        callbacks: {
          onopen: () => {
            sendJson({ type: 'ready' });
          },
          onmessage: (message: LiveServerMessage) => {
            if (isClosed) return;
            const content = message.serverContent;
            if (!content) return;

            if (content.interrupted) {
              sendJson({ type: 'interrupted' });
            }

            if (!voiceOnly && content.interimInputTranscription?.text) {
              if (!isSpuriousForeignTranscript(content.interimInputTranscription.text)) {
                sendJson({
                  type: 'interimInput',
                  text: content.interimInputTranscription.text,
                });
              }
            }

            if (!voiceOnly && content.inputTranscription?.text) {
              if (!isSpuriousForeignTranscript(content.inputTranscription.text)) {
                sendJson({
                  type: 'inputTranscript',
                  text: content.inputTranscription.text,
                });
              }
            }

            if (!voiceOnly && content.outputTranscription?.text) {
              if (!isSpuriousForeignTranscript(content.outputTranscription.text)) {
                sendJson({
                  type: 'outputTranscript',
                  text: content.outputTranscription.text,
                });
              }
            }

            for (const part of content.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                sendJson({
                  type: 'audio',
                  data: part.inlineData.data,
                });
              }
            }

            if (content.turnComplete) {
              sendJson({ type: 'turnComplete' });
            }
          },
          onerror: (err: unknown) => {
            if (isClosed) return;
            const errMsg =
              err && typeof err === 'object' && 'message' in err
                ? String((err as { message?: unknown }).message)
                : 'Live voice session encountered an error.';
            sendJson({ type: 'error', error: errMsg });
          },
          onclose: () => {
            sessionReady = false;
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              sendJson({ type: 'closed' });
              clientWs.close();
            }
          },
        },
      });

      sessionPromise
        .then((session) => {
          if (isClosed || clientWs.readyState !== WebSocket.OPEN) {
            try {
              session.close();
            } catch {
              // Ignore
            }
            return;
          }
          sessionReady = true;
          try {
            // Prompt an immediate spoken greeting so the student hears the teacher right away
            session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [
                    {
                      text:
                        liveRole === 'english'
                          ? 'Hi teacher! Please greet me in 1 short English sentence only and ask me what I want to practice.'
                          : liveRole === 'bengali'
                            ? 'হ্যালো স্যার! শুধু বিশুদ্ধ বাংলায় ১টি ছোট বাক্যে আমাকে স্বাগত জানান এবং কী পড়তে চাই জিজ্ঞাসা করুন।'
                            : 'Hello teacher! Greet me in 1 short English sentence, then ask what I want to learn in 1 short Bengali (বাংলা) sentence.',
                    },
                  ],
                },
              ],
              turnComplete: true,
            });
          } catch {
            // Ignore if session closed immediately
          }
        })
        .catch((err) => {
          const { message } = formatGeminiError(err);
          sendJson({ type: 'error', error: message });
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        });

      clientWs.on('message', (raw) => {
        if (isClosed) return;
        let parsed: {
          type?: string;
          data?: string;
          mimeType?: string;
          text?: string;
        };
        try {
          parsed = JSON.parse(raw.toString());
        } catch {
          return;
        }

        if (!sessionReady) {
          return;
        }

        sessionPromise
          .then((session) => {
            if (isClosed || !sessionReady) return;
            try {
              if (parsed.type === 'audio' && parsed.data) {
                session.sendRealtimeInput({
                  audio: {
                    data: parsed.data,
                    mimeType: 'audio/pcm;rate=16000',
                  },
                });
              } else if (parsed.type === 'video' && parsed.data) {
                const cleanedBase64 = parsed.data.includes(',')
                  ? parsed.data.split(',')[1]
                  : parsed.data;
                const mimeType = parsed.mimeType?.trim() || 'image/jpeg';
                session.sendRealtimeInput({
                  video: {
                    data: cleanedBase64,
                    mimeType,
                  },
                });
              } else if (parsed.type === 'image' && parsed.data) {
                const cleanedBase64 = parsed.data.includes(',')
                  ? parsed.data.split(',')[1]
                  : parsed.data;
                const mimeType = parsed.mimeType?.trim() || 'image/jpeg';
                const defaultPrompt =
                  liveRole === 'english'
                    ? 'I just sent you a photo from my book. Please look at the photo carefully and explain what you see in simple English.'
                    : liveRole === 'bengali'
                      ? 'আমি এইমাত্র বইয়ের একটি ছবি তুলে পাঠালাম। ছবিটি ভালো করে দেখে সহজ বাংলায় বুঝিয়ে দিন।'
                      : 'I just sent a photo from my book. Please look at it carefully and explain it in English and Bengali (বাংলা).';
                const promptText = parsed.text?.trim() || defaultPrompt;
                session.sendClientContent({
                  turns: [
                    {
                      role: 'user',
                      parts: [
                        {
                          inlineData: {
                            mimeType,
                            data: cleanedBase64,
                          },
                        },
                        { text: promptText },
                      ],
                    },
                  ],
                  turnComplete: true,
                });
              } else if (parsed.type === 'text' && parsed.text?.trim()) {
                session.sendClientContent({
                  turns: [
                    {
                      role: 'user',
                      parts: [{ text: parsed.text.trim() }],
                    },
                  ],
                  turnComplete: true,
                });
              }
            } catch (sendErr) {
              if (!isClosed && parsed.type !== 'audio' && parsed.type !== 'video') {
                const { message } = formatGeminiError(sendErr);
                sendJson({ type: 'error', error: message });
              }
            }
          })
          .catch(() => {
            // Session error handled above
          });
      });

      clientWs.on('close', () => {
        isClosed = true;
        sessionReady = false;
        clearInterval(pingTimer);
        releaseLiveCount();
        sessionPromise
          .then((session) => {
            try {
              session.close();
            } catch {
              // Ignore
            }
          })
          .catch(() => {});
      });

      clientWs.on('error', () => {
        isClosed = true;
        sessionReady = false;
        clearInterval(pingTimer);
        releaseLiveCount();
      });
    } catch (error) {
      clearInterval(pingTimer);
      releaseLiveCount();
      const { message } = formatGeminiError(error);
      sendJson({ type: 'error', error: message });
      clientWs.close();
    }
  });

  // Direct Standalone Native Android APK Distribution (Wbsec.apk ~15 MB)
  const apkFilePath = path.resolve(__dirname, 'android-release', 'Wbsec.apk');

  app.get('/api/apk-info', (_req, res) => {
    try {
      if (fs.existsSync(apkFilePath)) {
        const stat = fs.statSync(apkFilePath);
        const sizeMB = Number((stat.size / (1024 * 1024)).toFixed(1));
        res.setHeader('Cache-Control', 'no-cache');
        res.json({
          available: true,
          filename: 'Wbsec.apk',
          packageName: 'com.wbsec.aiteacher',
          versionName: '1.6.0',
          versionCode: 16,
          sizeBytes: stat.size,
          sizeMB,
          downloadUrl: '/download/Wbsec.apk',
        });
        return;
      }
    } catch {
      // Fall through to unavailable
    }
    res.json({ available: false });
  });

  const handleServeApk = (_req: express.Request, res: express.Response) => {
    if (!fs.existsSync(apkFilePath)) {
      res.status(404).json({ error: 'Wbsec.apk is not built yet.' });
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="Wbsec.apk"');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(apkFilePath);
  };

  app.get('/download/Wbsec.apk', handleServeApk);
  app.get('/Wbsec.apk', handleServeApk);

  if (!IS_PROD) {
    app.get('/manifest.webmanifest', (_req, res) => {
      res.type('application/manifest+json').json({
        id: '/',
        name: 'Wbsec — AI Teacher',
        short_name: 'Wbsec',
        description:
          'West Bengal Board AI Teacher with live voice tutor, interactive quizzes, camera problem solving, and Bengali dictionary.',
        theme_color: '#05060d',
        background_color: '#05060d',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        prefer_related_applications: false,
        categories: ['education', 'books', 'productivity'],
        launch_handler: {
          client_mode: 'navigate-existing',
        },
        shortcuts: [
          {
            name: 'AI Live (সরাসরি কথা)',
            short_name: 'AI Live',
            url: '/?action=live',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'কুইজ তৈরি করুন (Quiz)',
            short_name: 'Quiz',
            url: '/?action=quiz',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'বাংলা অভিধান',
            short_name: 'Dictionary',
            url: '/?action=dictionary',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      });
    });
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const setNoStoreHeaders = (res: express.Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    };

    app.use(
      express.static(distPath, {
        etag: true,
        lastModified: true,
        setHeaders(res, filePath) {
          const base = path.basename(filePath);
          if (
            base === 'index.html' ||
            base === 'sw.js' ||
            base === 'registerSW.js' ||
            base === 'manifest.webmanifest' ||
            base === 'build-meta.json' ||
            base.startsWith('workbox-')
          ) {
            setNoStoreHeaders(res);
          } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      }),
    );
    app.get('*', (_req, res) => {
      setNoStoreHeaders(res);
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Wbsec server running on http://0.0.0.0:${PORT}`);
    if (process.env.GEMINI_API_KEY) {
      try {
        getAIClient();
      } catch {
        // Ignore if key unavailable at boot
      }
      fetch('https://generativelanguage.googleapis.com/', { method: 'HEAD' }).catch(
        () => {},
      );
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start Wbsec server:', err);
  process.exit(1);
});
