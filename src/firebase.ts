import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  initializeFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  DEFAULT_APP_CONFIG,
  type AppAccentColor,
  type AppFontScale,
  type AppPageBackground,
  type AppProgramConfig,
  type ClassLevel,
  type LiveRole,
  type VoicePersona,
} from './types';

export const ADMIN_EMAIL = 'mursalimmondal630@gmail.com';
export const SECONDARY_ADMIN_EMAIL = 'k40242412@gmail.com';
export const ADMIN_EMAILS: readonly string[] = [ADMIN_EMAIL, SECONDARY_ADMIN_EMAIL];
export const APP_SETTINGS_COLLECTION = 'appSettings';
export const APP_SETTINGS_DOC_ID = 'live';
export const APP_SETTINGS_PATH = `${APP_SETTINGS_COLLECTION}/${APP_SETTINGS_DOC_ID}`;

const app = initializeApp(firebaseConfig);

function createResilientFirestore(): Firestore {
  try {
    return initializeFirestore(
      app,
      { experimentalAutoDetectLongPolling: true },
      firebaseConfig.firestoreDatabaseId,
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createResilientFirestore();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const code = (error as { code?: string } | null)?.code || '';
    if (
      code !== 'unavailable' &&
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();

const ALLOWED_CLASSES = new Set<ClassLevel>([
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
]);
const ALLOWED_VOICES = new Set<VoicePersona>(['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir']);
const ALLOWED_LIVE_ROLES = new Set<LiveRole>(['english', 'bengali', 'bilingual']);
const ALLOWED_ACCENT_COLORS = new Set<AppAccentColor>([
  'blue',
  'emerald',
  'indigo',
  'violet',
  'rose',
  'amber',
]);
const ALLOWED_PAGE_BACKGROUNDS = new Set<AppPageBackground>([
  'default',
  'yellow',
  'blue',
  'emerald',
  'rose',
  'violet',
]);
const ALLOWED_FONT_SCALES = new Set<AppFontScale>(['normal', 'large']);

function toEpochMillis(val: unknown, fallback: number): number {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (val && typeof val === 'object' && 'toMillis' in val && typeof (val as Timestamp).toMillis === 'function') {
    return (val as Timestamp).toMillis();
  }
  return fallback;
}

export function sanitizeAppConfigForClient(
  raw: Record<string, unknown> | Partial<AppProgramConfig> | undefined,
  base: AppProgramConfig = DEFAULT_APP_CONFIG,
): AppProgramConfig {
  const src = raw ?? {};
  const str = (val: unknown, fallback: string, maxLen: number) =>
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
  const defaultClass = ALLOWED_CLASSES.has(rawClass as ClassLevel)
    ? (rawClass as ClassLevel)
    : base.defaultClass;

  const rawVoice = typeof src.defaultVoice === 'string' ? src.defaultVoice : base.defaultVoice;
  const defaultVoice = ALLOWED_VOICES.has(rawVoice as VoicePersona)
    ? (rawVoice as VoicePersona)
    : base.defaultVoice;

  const rawRole = typeof src.defaultLiveRole === 'string' ? src.defaultLiveRole : base.defaultLiveRole;
  const defaultLiveRole = ALLOWED_LIVE_ROLES.has(rawRole as LiveRole)
    ? (rawRole as LiveRole)
    : base.defaultLiveRole;

  const rawAccent = typeof src.accentColor === 'string' ? src.accentColor : base.accentColor;
  const accentColor = ALLOWED_ACCENT_COLORS.has(rawAccent as AppAccentColor)
    ? (rawAccent as AppAccentColor)
    : base.accentColor;

  const rawPageBg = typeof src.pageBackground === 'string' ? src.pageBackground : base.pageBackground;
  const pageBackground = ALLOWED_PAGE_BACKGROUNDS.has(rawPageBg as AppPageBackground)
    ? (rawPageBg as AppPageBackground)
    : base.pageBackground;

  const rawScale = typeof src.fontScale === 'string' ? src.fontScale : base.fontScale;
  const fontScale = ALLOWED_FONT_SCALES.has(rawScale as AppFontScale)
    ? (rawScale as AppFontScale)
    : base.fontScale;

  const rawVersion =
    typeof src.configVersion === 'number' && Number.isFinite(src.configVersion) && src.configVersion >= 1
      ? Math.min(1000000, Math.floor(src.configVersion))
      : base.configVersion || 1;

  const rawTemp =
    typeof src.temperature === 'number' && Number.isFinite(src.temperature)
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
    updateTitle: str(src.updateTitle, base.updateTitle, 80) || DEFAULT_APP_CONFIG.updateTitle,
    updateNotes: str(src.updateNotes, base.updateNotes, 600),
    appName: str(src.appName, base.appName, 40) || DEFAULT_APP_CONFIG.appName,
    attributionText:
      str(src.attributionText, base.attributionText, 50) || DEFAULT_APP_CONFIG.attributionText,
    welcomeTitle: str(src.welcomeTitle, base.welcomeTitle, 100),
    welcomeSubtitle:
      str(src.welcomeSubtitle, base.welcomeSubtitle, 280) || DEFAULT_APP_CONFIG.welcomeSubtitle,
    dictionaryTitle:
      str(src.dictionaryTitle, base.dictionaryTitle, 60) || DEFAULT_APP_CONFIG.dictionaryTitle,
    dictionarySubtitle:
      str(src.dictionarySubtitle, base.dictionarySubtitle, 240) ||
      DEFAULT_APP_CONFIG.dictionarySubtitle,
    accentColor,
    pageBackground,
    fontScale,
    announcementBanner: str(src.announcementBanner, base.announcementBanner, 240),
    apkDownloadUrl: sanitizeApkUrl(src.apkDownloadUrl, base.apkDownloadUrl || ''),
    maintenanceMode: bool(src.maintenanceMode, base.maintenanceMode),
    maintenanceMessage:
      str(src.maintenanceMessage, base.maintenanceMessage, 240) ||
      DEFAULT_APP_CONFIG.maintenanceMessage,
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
    customTeacherPrompt: str(src.customTeacherPrompt, base.customTeacherPrompt, 600),
    customLivePrompt: str(src.customLivePrompt, base.customLivePrompt, 600),
    samplePrompts: sanitizeList(src.samplePrompts, base.samplePrompts, 6, 160),
    sampleWords: sanitizeList(src.sampleWords, base.sampleWords, 10, 60),
    updatedAt: toEpochMillis(src.updatedAt, base.updatedAt || Date.now()),
  };
}

export function isAuthorizedAdminUser(user: User | null): boolean {
  if (!user || !user.emailVerified || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export async function signInAdminWithGoogle(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;
  if (!isAuthorizedAdminUser(user)) {
    const signedEmail = user.email || 'unknown account';
    await signOut(auth).catch(() => {});
    throw new Error(
      `Signed in as ${signedEmail}, but only authorized Admin accounts (${ADMIN_EMAILS.join(' or ')}) can publish updates.`,
    );
  }
  await ensureAdminDirectoryRecord(user);
  return user;
}

export async function signOutFirebaseAdmin(): Promise<void> {
  await signOut(auth);
}

async function ensureAdminDirectoryRecord(user: User): Promise<void> {
  const adminPath = `admins/${user.uid}`;
  const adminRef = doc(db, 'admins', user.uid);
  try {
    const snap = await getDoc(adminRef);
    if (!snap.exists()) {
      await setDoc(adminRef, {
        uid: user.uid,
        email: user.email || ADMIN_EMAIL,
        role: 'admin',
        displayName: (user.displayName || 'Amir').slice(0, 100),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        adminRef,
        {
          uid: user.uid,
          email: user.email || ADMIN_EMAIL,
          role: 'admin',
          displayName: (user.displayName || 'Amir').slice(0, 100),
          createdAt: snap.data().createdAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, adminPath);
  }
}

export async function getLatestFirestoreConfig(): Promise<AppProgramConfig | null> {
  const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
  try {
    const snap = await getDocFromServer(ref);
    if (!snap.exists()) return null;
    return sanitizeAppConfigForClient(snap.data() as Record<string, unknown>, DEFAULT_APP_CONFIG);
  } catch (error) {
    // Only surface structured errors for permission failures; allow offline startup fallback
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
      handleFirestoreError(error, OperationType.GET, APP_SETTINGS_PATH);
    }
    return null;
  }
}

export function subscribeLiveAppSettings(
  onUpdate: (config: AppProgramConfig) => void,
  onPermissionError?: (err: Error) => void,
): Unsubscribe {
  const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) return;
      const sanitized = sanitizeAppConfigForClient(
        snapshot.data() as Record<string, unknown>,
        DEFAULT_APP_CONFIG,
      );
      onUpdate(sanitized);
    },
    (error) => {
      const code = (error as { code?: string } | null)?.code || '';
      const msg = error instanceof Error ? error.message : String(error);
      if (
        code === 'permission-denied' ||
        msg.includes('permission') ||
        msg.includes('PERMISSION_DENIED')
      ) {
        try {
          handleFirestoreError(error, OperationType.GET, APP_SETTINGS_PATH);
        } catch (structuredErr) {
          if (onPermissionError && structuredErr instanceof Error) {
            onPermissionError(structuredErr);
          }
        }
      }
    },
  );
}

export async function publishAppSettingsToFirestore(
  config: AppProgramConfig,
  requestedVersion: number,
): Promise<AppProgramConfig> {
  const user = auth.currentUser;
  if (!user || !isAuthorizedAdminUser(user)) {
    throw new Error(
      `Please connect an authorized Admin Google account (${ADMIN_EMAILS.join(' or ')}) before publishing cloud updates to students.`,
    );
  }

  const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
  let remoteVersion = 0;

  try {
    const existingSnap = await getDocFromServer(ref);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as Record<string, unknown>;
      if (typeof existingData.configVersion === 'number' && Number.isFinite(existingData.configVersion)) {
        remoteVersion = Math.floor(existingData.configVersion);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
      handleFirestoreError(error, OperationType.GET, APP_SETTINGS_PATH);
    }
  }

  const nextVersion = Math.min(1000000, Math.max(requestedVersion, remoteVersion + 1, 1));
  const clean = sanitizeAppConfigForClient(
    { ...config, configVersion: nextVersion },
    DEFAULT_APP_CONFIG,
  );

  // Strictly match all 33 keys & volumetric constraints declared in firebase-blueprint.json
  const firestorePayload = {
    configVersion: clean.configVersion,
    updateTitle: clean.updateTitle,
    updateNotes: clean.updateNotes,
    appName: clean.appName,
    attributionText: clean.attributionText,
    welcomeTitle: clean.welcomeTitle,
    welcomeSubtitle: clean.welcomeSubtitle,
    dictionaryTitle: clean.dictionaryTitle,
    dictionarySubtitle: clean.dictionarySubtitle,
    accentColor: clean.accentColor,
    pageBackground: clean.pageBackground,
    fontScale: clean.fontScale,
    announcementBanner: clean.announcementBanner,
    apkDownloadUrl: clean.apkDownloadUrl,
    maintenanceMode: clean.maintenanceMode,
    maintenanceMessage: clean.maintenanceMessage,
    enableTeacher: clean.enableTeacher,
    enableLiveMode: clean.enableLiveMode,
    enableDictionary: clean.enableDictionary,
    enableVoiceInput: clean.enableVoiceInput,
    enableVoiceOutput: clean.enableVoiceOutput,
    enablePdfExport: clean.enablePdfExport,
    enableCamera: clean.enableCamera,
    defaultClass: clean.defaultClass,
    defaultVoice: clean.defaultVoice,
    defaultLiveRole: clean.defaultLiveRole,
    temperature: clean.temperature,
    conciseAnswers: clean.conciseAnswers,
    customTeacherPrompt: clean.customTeacherPrompt,
    customLivePrompt: clean.customLivePrompt,
    samplePrompts: clean.samplePrompts,
    sampleWords: clean.sampleWords,
    updatedAt: serverTimestamp(),
    updatedByUid: user.uid,
  };

  try {
    await setDoc(ref, firestorePayload);
    return {
      ...clean,
      updatedAt: Date.now(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, APP_SETTINGS_PATH);
  }
}
