import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  Moon,
  Sun,
  Lock,
  ShieldCheck,
  Megaphone,
  Wrench,
  ArrowUpCircle,
  Check,
  RefreshCw,
  Cpu,
  Loader2,
  Sparkles,
  BookOpen,
  NotebookText,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  auth,
  getLatestFirestoreConfig,
  sanitizeAppConfigForClient,
  subscribeLiveAppSettings,
} from './firebase';
import {
  DEFAULT_APP_CONFIG,
  DEFAULT_STUDENT_PROFILE,
  type AdminServerStats,
  type AppMode,
  type AppProgramConfig,
  type ChatMessage,
  type ClassLevel,
  type DictionaryEntry,
  type ImageAttachment,
  type QuizData,
  type StudentProfile,
  type StudyHistoryItem,
} from './types';
import { TeacherWorkspace } from './components/TeacherWorkspace';
import { StudentAvatar } from './components/StudentAvatar';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';

const AppUpdateModal = lazy(() =>
  import('./components/AppUpdateModal').then((m) => ({ default: m.AppUpdateModal })),
);
const StudentProfileModal = lazy(() =>
  import('./components/StudentProfileModal').then((m) => ({ default: m.StudentProfileModal })),
);
const DictionaryWorkspace = lazy(() =>
  import('./components/DictionaryWorkspace').then((m) => ({ default: m.DictionaryWorkspace })),
);
const HistoryDrawer = lazy(() =>
  import('./components/HistoryDrawer').then((m) => ({ default: m.HistoryDrawer })),
);
const AdminModal = lazy(() =>
  import('./components/AdminModal').then((m) => ({ default: m.AdminModal })),
);
const OfflineAiPackModal = lazy(() =>
  import('./components/OfflineAiPackModal').then((m) => ({ default: m.OfflineAiPackModal })),
);
import {
  extractPdfTitle,
  generateStudyPdf,
  makeSafeFilename,
} from './utils/pdfGenerator';
import {
  useSpeechRecognition,
  type SpeechLang,
} from './hooks/useSpeechRecognition';
import {
  PWAInstallButton,
  OfflineIndicator,
} from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  answerOfflineQuestion,
  saveOfflineTeacherAnswer,
} from './offline/offlineKnowledge';
import {
  lookupOfflineDictionary,
  saveOfflineDictionaryEntry,
} from './offline/offlineDictionary';
import {
  detectQuizRequest,
  formatQuizAsMarkdown,
  generateOfflineQuiz,
} from './offline/offlineQuiz';
import {
  abortOfflineAiGeneration,
  extractTextFromImageOffline,
  getInstalledOfflinePack,
  getOfflineAiState,
  isOfflineAiCacheName,
  isOfflineAiPackInstalled,
  isOfflineFeatureAllowed,
  lookupOfflineAiDictionary,
  streamOfflineTeacherChat,
  subscribeOfflineAiState,
} from './offline/offlineAiEngine';
import type { OfflineAiState } from './offline/offlineAiTypes';
import type { LiveTranscriptItem } from './hooks/useLiveTeacher';

const HISTORY_STORAGE_KEY = 'wbsec_study_history_v1';
const THEME_STORAGE_KEY = 'wbsec_theme_v2';
const ADMIN_TOKEN_STORAGE_KEY = 'wbsec_admin_token_v1';
const APPLIED_VERSION_STORAGE_KEY = 'wbsec_applied_config_version_v1';
const APPLIED_CONFIG_STORAGE_KEY = 'wbsec_cached_app_config_v1';
const JUST_UPDATED_SESSION_KEY = 'wbsec_just_updated_version_v1';
const AUTO_RELOAD_BUILD_KEY = 'wbsec_auto_reloaded_build_v1';
const STUDENT_PROFILE_STORAGE_KEY = 'wbsec_student_profile_v1';
const CLIENT_BUILD_VERSION =
  typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
const MAX_HISTORY_ITEMS = 20;
const FAST_API_SETTINGS = {
  maxHistoryMessages: 8,
} as const;

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Storage blocked fallback
  }
  return 'dark';
}

function getStoredAppliedVersion(): number | null {
  try {
    const raw = localStorage.getItem(APPLIED_VERSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : null;
  } catch {
    return null;
  }
}

function saveAppliedVersion(version: number): void {
  try {
    localStorage.setItem(APPLIED_VERSION_STORAGE_KEY, String(version));
  } catch {
    // Storage blocked fallback
  }
}

function getStoredAppliedConfig(): AppProgramConfig | null {
  try {
    const raw = localStorage.getItem(APPLIED_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    return sanitizeAppConfigForClient(parsed, DEFAULT_APP_CONFIG);
  } catch {
    return null;
  }
}

function saveAppliedConfig(config: AppProgramConfig): void {
  try {
    localStorage.setItem(APPLIED_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage blocked fallback
  }
}

function getStoredStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_STUDENT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<StudentProfile>;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_STUDENT_PROFILE;
    return {
      ...DEFAULT_STUDENT_PROFILE,
      ...parsed,
      name: typeof parsed.name === 'string' ? parsed.name.trim().slice(0, 40) : '',
      onboardingCompleted: Boolean(parsed.onboardingCompleted),
    };
  } catch {
    return DEFAULT_STUDENT_PROFILE;
  }
}

function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage blocked or quota exceeded fallback: retry without custom photo
    try {
      localStorage.setItem(
        STUDENT_PROFILE_STORAGE_KEY,
        JSON.stringify({ ...profile, avatarType: 'preset', customAvatarDataUrl: undefined }),
      );
    } catch {
      // Ignore storage block
    }
  }
}

function collectUniqueHighlights(lists: Array<string[] | undefined>): string[] | undefined {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const list of lists) {
    if (!list) continue;
    for (const phrase of list) {
      const clean = phrase.trim();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        result.push(clean);
      }
    }
  }
  return result.length > 0 ? result : undefined;
}

export default function App() {
  const isOnline = useOnlineStatus();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [mode, setMode] = useState<AppMode>('teacher');

  const [appConfig, setAppConfig] = useState<AppProgramConfig>(
    () => getStoredAppliedConfig() ?? DEFAULT_APP_CONFIG,
  );
  const [appliedVersion, setAppliedVersion] = useState<number>(
    () =>
      getStoredAppliedVersion() ??
      getStoredAppliedConfig()?.configVersion ??
      DEFAULT_APP_CONFIG.configVersion,
  );
  const [pendingUpdateConfig, setPendingUpdateConfig] = useState<AppProgramConfig | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [hasSwUpdate, setHasSwUpdate] = useState(false);
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateCheckStatus, setUpdateCheckStatus] = useState<{
    type: 'info' | 'warn';
    text: string;
  } | null>(null);
  const [justUpdatedNotice, setJustUpdatedNotice] = useState<number | null>(null);
  const [offlineReadyNotice, setOfflineReadyNotice] = useState(false);
  const dismissedVersionRef = useRef<number | null>(null);
  const isInitialFetchRef = useRef(true);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [offlineAiModalOpen, setOfflineAiModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(getStoredStudentProfile);

  useEffect(() => {
    if (!headerMenuOpen) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
        setHeaderMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHeaderMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [headerMenuOpen]);
  const [openLiveCounter, setOpenLiveCounter] = useState(0);
  const [offlineAiState, setOfflineAiState] = useState<OfflineAiState>(getOfflineAiState);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminServerStats | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseAuthReady, setFirebaseAuthReady] = useState(false);
  const appConfigRef = useRef(appConfig);
  appConfigRef.current = appConfig;
  const adminModalOpenRef = useRef(adminModalOpen);
  adminModalOpenRef.current = adminModalOpen;
  const isStreamingRef = useRef(false);

  useEffect(() => {
    return subscribeOfflineAiState(setOfflineAiState);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Smoothly fade out the native app launch splash screen
    const splashEl = document.getElementById('wbsec-splash');
    if (splashEl) {
      const fadeTimer = window.setTimeout(() => {
        splashEl.classList.add('wbsec-splash-hidden');
        window.setTimeout(() => splashEl.remove(), 360);
      }, 280);
      return () => window.clearTimeout(fadeTimer);
    }
  }, []);

  useEffect(() => {
    try {
      // Strip cache-busting & PWA shortcut params after reading them so URL stays spotless
      const currentUrl = new URL(window.location.href);
      const action = currentUrl.searchParams.get('action');
      if (action === 'live') {
        setMode('teacher');
        setOpenLiveCounter((c) => c + 1);
      } else if (action === 'dictionary') {
        setMode('dictionary');
      } else if (action === 'quiz') {
        setMode('teacher');
      }

      if (
        currentUrl.searchParams.has('_wbsec_upd') ||
        currentUrl.searchParams.has('source') ||
        currentUrl.searchParams.has('action')
      ) {
        currentUrl.searchParams.delete('_wbsec_upd');
        currentUrl.searchParams.delete('source');
        currentUrl.searchParams.delete('action');
        window.history.replaceState({}, '', currentUrl.pathname + currentUrl.search + currentUrl.hash);
      }
    } catch {
      // Ignore history API errors
    }

    try {
      const updatedStr = sessionStorage.getItem(JUST_UPDATED_SESSION_KEY);
      if (updatedStr) {
        sessionStorage.removeItem(JUST_UPDATED_SESSION_KEY);
        const ver = parseInt(updatedStr, 10);
        if (Number.isFinite(ver) && ver >= 1) {
          setJustUpdatedNotice(ver);
        }
      }
    } catch {
      // SessionStorage blocked fallback
    }
  }, []);

  useEffect(() => {
    if (!justUpdatedNotice) return;
    const timer = window.setTimeout(() => setJustUpdatedNotice(null), 5500);
    return () => window.clearTimeout(timer);
  }, [justUpdatedNotice]);

  useEffect(() => {
    if (!offlineReadyNotice) return;
    const timer = window.setTimeout(() => setOfflineReadyNotice(false), 6000);
    return () => window.clearTimeout(timer);
  }, [offlineReadyNotice]);

  useEffect(() => {
    if (!updateCheckStatus) return;
    const timer = window.setTimeout(() => setUpdateCheckStatus(null), 4500);
    return () => window.clearTimeout(timer);
  }, [updateCheckStatus]);

  const hardRefreshToLatestBuild = useCallback(async (targetConfigVer?: number) => {
    try {
      const ver = targetConfigVer || appConfigRef.current.configVersion || 1;
      sessionStorage.setItem(JUST_UPDATED_SESSION_KEY, String(ver));
    } catch {
      // Ignore storage block
    }

    // 1. Delete old app/HTML/JS caches while preserving the student's 1GB Offline AI Pack caches
    try {
      if ('caches' in window) {
        const keys = await Promise.race([
          caches.keys(),
          new Promise<string[]>((resolve) => setTimeout(() => resolve([]), 1500)),
        ]);
        await Promise.all(
          keys.filter((k) => !isOfflineAiCacheName(k)).map((k) => caches.delete(k)),
        );
      }
    } catch {
      // Ignore cache clear failure
    }

    // 2. Unregister stale Service Workers so the next load fetches fresh HTML/JS directly from server
    try {
      if ('serviceWorker' in navigator) {
        const regs = await Promise.race([
          navigator.serviceWorker.getRegistrations(),
          new Promise<readonly ServiceWorkerRegistration[]>((resolve) =>
            setTimeout(() => resolve([]), 1500),
          ),
        ]);
        await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
      }
    } catch {
      // Ignore SW unregister failure
    }

    // 3. Navigate with a cache-busting query param so aggressive mobile/PWA HTTP caches cannot serve stale HTML
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('_wbsec_upd', String(Date.now()));
      window.location.replace(nextUrl.toString());
    } catch {
      window.location.reload();
    }
  }, []);

  const autoApplyBuildUpdate = useCallback(
    async (reloadKey: string, targetConfigVer?: number): Promise<boolean> => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return false;
      }
      if (isStreamingRef.current || adminModalOpenRef.current) {
        setHasSwUpdate(true);
        setUpdateModalOpen(true);
        return false;
      }

      let attemptCount = 0;
      try {
        const raw = sessionStorage.getItem(AUTO_RELOAD_BUILD_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { key?: string; count?: number };
          if (parsed?.key === reloadKey && typeof parsed.count === 'number') {
            attemptCount = parsed.count;
          }
        }
      } catch {
        // Ignore legacy string or storage block
      }

      if (attemptCount >= 2) {
        setHasSwUpdate(true);
        return false;
      }

      try {
        sessionStorage.setItem(
          AUTO_RELOAD_BUILD_KEY,
          JSON.stringify({ key: reloadKey, count: attemptCount + 1 }),
        );
      } catch {
        // Ignore storage block
      }

      await hardRefreshToLatestBuild(targetConfigVer);
      return true;
    },
    [hardRefreshToLatestBuild],
  );

  const applyIncomingConfig = useCallback((incoming: AppProgramConfig, isInitial = false) => {
    const serverVersion = incoming.configVersion || 1;
    const storedVersion = getStoredAppliedVersion();
    const hasPersonalClass = Boolean(getStoredStudentProfile().className);

    if (storedVersion === null) {
      saveAppliedVersion(serverVersion);
      saveAppliedConfig(incoming);
      setAppliedVersion(serverVersion);
      setAppConfig(incoming);
      if (!hasPersonalClass) {
        setClassNameLevel(incoming.defaultClass);
      }
      return;
    }

    if (serverVersion > storedVersion) {
      // Auto-apply cloud updates immediately on student devices with zero clicks
      saveAppliedVersion(serverVersion);
      saveAppliedConfig(incoming);
      setAppliedVersion(serverVersion);
      setAppConfig(incoming);
      setPendingUpdateConfig(null);
      setUpdateModalOpen(false);
      if (isInitial && !hasPersonalClass) {
        setClassNameLevel(incoming.defaultClass);
      }
      setJustUpdatedNotice(serverVersion);
    } else if (serverVersion === storedVersion) {
      if (isInitial || (incoming.updatedAt || 0) >= (appConfigRef.current.updatedAt || 0)) {
        saveAppliedConfig(incoming);
        setAppliedVersion(storedVersion);
        setAppConfig(incoming);
        if (isInitial && !hasPersonalClass) {
          setClassNameLevel(incoming.defaultClass);
        }
      }
    }
  }, []);

  const checkServerUpdates = useCallback(
    async (isInitial = false) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }
      try {
        const ts = Date.now();
        const [cloudCfg, serverPayload, metaPayload] = await Promise.all([
          getLatestFirestoreConfig().catch(() => null),
          fetch(`/api/config?fresh=1&_t=${ts}`, { cache: 'no-store' })
            .then((res) =>
              res.ok
                ? (res.json() as Promise<{ config?: AppProgramConfig; buildVersion?: string }>)
                : null,
            )
            .catch(() => null),
          fetch(`/build-meta.json?_t=${ts}`, { cache: 'no-store' })
            .then((res) =>
              res.ok ? (res.json() as Promise<{ buildId?: string }>) : null,
            )
            .catch(() => null),
        ]);

        const serverCfg = serverPayload?.config ?? null;
        const remoteBuild =
          (serverPayload?.buildVersion && serverPayload.buildVersion !== 'dev'
            ? serverPayload.buildVersion
            : undefined) || metaPayload?.buildId;

        if (
          remoteBuild &&
          remoteBuild !== 'dev' &&
          CLIENT_BUILD_VERSION !== 'dev' &&
          remoteBuild !== CLIENT_BUILD_VERSION
        ) {
          const targetVer =
            Math.max(
              cloudCfg?.configVersion || 0,
              serverCfg?.configVersion || 0,
              appConfigRef.current.configVersion || 1,
            ) || 1;
          const reloaded = await autoApplyBuildUpdate(remoteBuild, targetVer);
          if (reloaded) {
            return;
          }
        }

        let incoming: AppProgramConfig | null = null;
        if (cloudCfg && serverCfg) {
          incoming =
            (cloudCfg.configVersion || 1) >= (serverCfg.configVersion || 1)
              ? cloudCfg
              : serverCfg;
        } else {
          incoming = cloudCfg || serverCfg;
        }

        if (incoming) {
          applyIncomingConfig(incoming, isInitial);
        }
      } catch {
        // Offline fallback: keep active config
      }
    },
    [applyIncomingConfig, autoApplyBuildUpdate],
  );

  useEffect(() => {
    if (!firebaseAuthReady) return;
    const unsubscribe = subscribeLiveAppSettings((incoming) => {
      applyIncomingConfig(incoming, false);
    });
    return () => unsubscribe();
  }, [firebaseAuthReady, applyIncomingConfig]);

  useEffect(() => {
    if (isInitialFetchRef.current) {
      isInitialFetchRef.current = false;
      void checkServerUpdates(true);
    }

    const pollTimer = window.setInterval(() => {
      void checkServerUpdates(false);
    }, 45000);

    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        void checkServerUpdates(false);
      }
    };

    const onBackOnline = () => {
      void checkServerUpdates(false);
    };

    window.addEventListener('focus', onFocusOrVisible);
    window.addEventListener('online', onBackOnline);
    document.addEventListener('visibilitychange', onFocusOrVisible);

    return () => {
      window.clearInterval(pollTimer);
      window.removeEventListener('focus', onFocusOrVisible);
      window.removeEventListener('online', onBackOnline);
      document.removeEventListener('visibilitychange', onFocusOrVisible);
    };
  }, [checkServerUpdates]);

  useEffect(() => {
    const handleAutoSwRefresh = () => {
      void autoApplyBuildUpdate(`sw-${CLIENT_BUILD_VERSION}`);
    };
    const onOfflineReadyEvent = () => {
      setOfflineReadyNotice(true);
    };

    window.addEventListener('wbsec:sw-update-ready', handleAutoSwRefresh);
    window.addEventListener('wbsec:offline-ready', onOfflineReadyEvent);

    if (!('serviceWorker' in navigator)) {
      return () => {
        window.removeEventListener('wbsec:sw-update-ready', handleAutoSwRefresh);
        window.removeEventListener('wbsec:offline-ready', onOfflineReadyEvent);
      };
    }

    let active = true;
    const hadControllerAtMount = Boolean(navigator.serviceWorker.controller);

    const onControllerChange = () => {
      if (!active || !hadControllerAtMount) return;
      handleAutoSwRefresh();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .getRegistration()
      .then((reg) => {
        if (!active || !reg) return;
        if (reg.waiting) {
          handleAutoSwRefresh();
        }
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              handleAutoSwRefresh();
            }
          });
        });
      })
      .catch(() => {});

    return () => {
      active = false;
      window.removeEventListener('wbsec:sw-update-ready', handleAutoSwRefresh);
      window.removeEventListener('wbsec:offline-ready', onOfflineReadyEvent);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, [autoApplyBuildUpdate]);

  useEffect(() => {
    if (!adminToken) {
      setAdminUsername(null);
      setAdminStats(null);
      return;
    }
    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((data: { username?: string; config?: AppProgramConfig; stats?: AdminServerStats }) => {
        setAdminUsername(data.username || 'Amir123');
        if (data.config) {
          const incomingVer = data.config.configVersion || 1;
          const currentVer = appConfigRef.current.configVersion || 1;
          if (incomingVer >= currentVer) {
            setAppConfig(data.config);
            saveAppliedConfig(data.config);
            saveAppliedVersion(incomingVer);
            setAppliedVersion(incomingVer);
          }
        }
        if (data.stats) setAdminStats(data.stats);
      })
      .catch(() => {
        setAdminToken(null);
        setAdminUsername(null);
        setAdminStats(null);
        try {
          localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        } catch {
          // Ignore storage error
        }
      });
  }, [adminToken]);

  useEffect(() => {
    document.title = `${appConfig.appName} — AI Teacher & Bengali Dictionary`;
    document.documentElement.setAttribute('data-accent', appConfig.accentColor || 'blue');
    document.documentElement.setAttribute('data-bg', appConfig.pageBackground || 'default');
    document.documentElement.setAttribute('data-font-scale', appConfig.fontScale || 'normal');
  }, [appConfig.appName, appConfig.accentColor, appConfig.pageBackground, appConfig.fontScale]);

  useEffect(() => {
    if (mode === 'teacher' && !appConfig.enableTeacher && appConfig.enableDictionary) {
      setMode('dictionary');
    } else if (mode === 'dictionary' && !appConfig.enableDictionary && appConfig.enableTeacher) {
      setMode('teacher');
    }
  }, [mode, appConfig.enableTeacher, appConfig.enableDictionary]);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#05060d' : '#ffffff');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage blocked fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // AI Teacher streaming chat state
  const [classNameLevel, setClassNameLevel] = useState<ClassLevel>(
    () =>
      getStoredStudentProfile().className ??
      (getStoredAppliedConfig() ?? DEFAULT_APP_CONFIG).defaultClass,
  );

  useEffect(() => {
    if (!isOnline && offlineAiState.installedTier === 'class8' && classNameLevel !== 'Class 8') {
      setClassNameLevel('Class 8');
    }
  }, [isOnline, offlineAiState.installedTier, classNameLevel]);

  const handleSaveStudentProfile = useCallback((nextProfile: StudentProfile) => {
    setStudentProfile(nextProfile);
    saveStudentProfile(nextProfile);
    if (nextProfile.className) {
      setClassNameLevel(nextProfile.className);
    }
  }, []);

  const handleClassLevelChange = useCallback((nextClass: ClassLevel) => {
    setClassNameLevel(nextClass);
    setStudentProfile((prev) => {
      if (!prev.onboardingCompleted) return prev;
      const updated: StudentProfile = { ...prev, className: nextClass, updatedAt: Date.now() };
      saveStudentProfile(updated);
      return updated;
    });
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftText, setDraftText] = useState('');
  const [image, setImage] = useState<ImageAttachment | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  isStreamingRef.current = isStreaming;
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [teacherValidation, setTeacherValidation] = useState<string | null>(null);
  const [latestCompletedAssistantId, setLatestCompletedAssistantId] = useState<string | null>(
    null,
  );
  const [shouldAutoSpeakLatest, setShouldAutoSpeakLatest] = useState(false);

  const streamAbortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const {
    isSupported: isSpeechSupported,
    isListening,
    isTranscribing,
    interimTranscript,
    lang: speechLang,
    setLang: setSpeechLang,
    error: speechError,
    stopListening,
    toggleListening,
  } = useSpeechRecognition({
    defaultLang: 'bn-IN',
    continuous: true,
    onFinalResult: (spokenText) => {
      setDraftText((prev) => (prev.trim() ? `${prev.trim()} ${spokenText}` : spokenText));
      setTeacherValidation(null);
    },
  });

  useEffect(() => {
    if (mode !== 'teacher' && isListening) {
      stopListening();
    }
  }, [mode, isListening, stopListening]);

  // Dictionary state
  const [dictWord, setDictWord] = useState('');
  const [dictEntry, setDictEntry] = useState<DictionaryEntry | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState<string | null>(null);
  const [dictValidation, setDictValidation] = useState<string | null>(null);
  const [dictOfflineSuggestions, setDictOfflineSuggestions] = useState<string[]>([]);

  // Study history state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<StudyHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage quota or privacy mode fallback
    }
  }, [history]);

  const pushHistory = (item: StudyHistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY_ITEMS));
  };

  const handleStopStreaming = () => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      streamAbortRef.current = null;
    }
    abortOfflineAiGeneration();
    setIsStreaming(false);
  };

  const handleSendMessage = async (options?: {
    overrideText?: string;
    speakReply?: boolean;
  }) => {
    if (isStreaming) return;
    if (isListening) stopListening();

    const textToSend = (options?.overrideText ?? draftText).trim();
    const attachedImage = image;
    const wantsPdf = /\bpdf\b|পিডিএফ/i.test(textToSend);

    if (!textToSend && !attachedImage) {
      setTeacherValidation('Please type a question, tap Talk, or attach a photo first.');
      return;
    }

    setTeacherValidation(null);
    setTeacherError(null);
    setLatestCompletedAssistantId(null);
    setShouldAutoSpeakLatest(Boolean(options?.speakReply));

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'user',
      text: textToSend,
      image: attachedImage
        ? {
            dataUrl: attachedImage.dataUrl,
            base64: attachedImage.base64,
            mimeType: attachedImage.mimeType,
            name: attachedImage.name,
          }
        : undefined,
      createdAt: Date.now(),
    };

    const assistantMsgId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'model',
      text: '',
      createdAt: Date.now(),
    };

    const conversationForApi = [...messagesRef.current, userMsg];

    const quizIntent = detectQuizRequest(textToSend);

    const finalizeAssistantMessage = (
      finalAnswer: string,
      cacheOnline = false,
      quizData?: QuizData,
    ) => {
      if (cacheOnline && textToSend) {
        saveOfflineTeacherAnswer(textToSend, finalAnswer, classNameLevel);
      }

      const historyId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const pdfMarkdown = quizData ? formatQuizAsMarkdown(quizData) : finalAnswer;
      const pdfMeta = wantsPdf
        ? (() => {
            const pdfTitle =
              quizData?.title || extractPdfTitle(finalAnswer, `${classNameLevel} Study Notes`);
            const pdfFilename = makeSafeFilename(pdfTitle);
            generateStudyPdf({
              title: pdfTitle,
              subtitle: `West Bengal Board (WBBSE) · ${classNameLevel}`,
              markdown: pdfMarkdown,
              filename: pdfFilename,
            }).catch(() => {
              // User can still retry via the Download PDF card inside the message
            });
            return { title: pdfTitle, filename: pdfFilename };
          })()
        : undefined;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text: finalAnswer,
                historyId,
                ...(pdfMeta ? { pdf: pdfMeta } : {}),
                ...(quizData ? { quiz: quizData } : {}),
              }
            : m,
        ),
      );

      const latestMessagesById = new Map(messagesRef.current.map((m) => [m.id, m]));
      const historyMessages = [
        ...conversationForApi.map((m) => {
          const current = latestMessagesById.get(m.id);
          return {
            id: m.id,
            role: m.role,
            text: m.text || (m.image ? '[Photo attached]' : ''),
            highlights: current?.highlights ?? m.highlights,
            quiz: current?.quiz ?? m.quiz,
            createdAt: m.createdAt,
          };
        }),
        {
          id: assistantMsgId,
          role: 'model' as const,
          text: finalAnswer,
          highlights: undefined as string[] | undefined,
          ...(quizData ? { quiz: quizData } : {}),
          createdAt: Date.now(),
        },
      ];

      setLatestCompletedAssistantId(assistantMsgId);
      pushHistory({
        id: historyId,
        type: 'teacher',
        className: classNameLevel,
        question: textToSend || 'Uploaded Photo Question',
        hasImage: Boolean(attachedImage),
        answer: finalAnswer,
        highlights: collectUniqueHighlights(historyMessages.map((m) => m.highlights)),
        messages: historyMessages,
        createdAt: Date.now(),
      });
    };

    setMessages([...conversationForApi, assistantMsg]);
    setDraftText('');
    setImage(null);

    if (quizIntent.isQuiz) {
      const activeStudentName = studentProfile.name.trim();
      const runOfflineQuizPipeline = () => {
        if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed('quiz')) {
          finalizeAssistantMessage(
            'অনলি ক্লাস ৮ (১০০ MB) প্যাকে কুইজ চালু নেই — এতে শুধু **Class 8-এর মেসেজ, ভয়েস এবং PDF** কাজ করে।\n\nকুইজ, AI Live, ক্যামেরা ও সব ক্লাসের সুবিধা পেতে **২৫০ MB ফাস্ট প্যাক** বা **৫০০ MB প্রো প্যাক** ডাউনলোড করো।',
            false,
          );
          return;
        }
        const offlineQuiz = generateOfflineQuiz(
          quizIntent.topic || textToSend,
          classNameLevel,
          quizIntent.count,
        );
        const namePrefixBn = activeStudentName ? `${activeStudentName}, তোমার জন্য ` : '';
        const namePrefixEn = activeStudentName ? `${activeStudentName}, ` : '';
        const summary =
          offlineQuiz.language === 'bn'
            ? `${namePrefixBn}**${offlineQuiz.title}** (অফলাইন মোড) তৈরি হয়েছে! মোট **${offlineQuiz.questions.length}টি প্রশ্ন** ও প্রতিটি প্রশ্নে **৪টি করে অপশন** আছে — নিচে সঠিক উত্তর বেছে নাও:`
            : `${namePrefixEn}**${offlineQuiz.title}** (Offline Mode) is ready with **${offlineQuiz.questions.length} questions** and **4 options** each:`;
        finalizeAssistantMessage(summary, false, offlineQuiz);
      };

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        runOfflineQuizPipeline();
        return;
      }

      setIsStreaming(true);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text: activeStudentName
                  ? `*${activeStudentName}, তোমার টপিক নিয়ে ৪ অপশনের কুইজ তৈরি করা হচ্ছে...*`
                  : '*তোমার টপিক নিয়ে ৪ অপশনের কুইজ তৈরি করা হচ্ছে...*',
              }
            : m,
        ),
      );

      const quizController = new AbortController();
      streamAbortRef.current = quizController;

      try {
        const recentContext = conversationForApi
          .slice(0, -1)
          .slice(-4)
          .map((m) => ({
            role: m.role,
            text: m.text.slice(0, 320),
          }));

        const response = await fetch('/api/teacher/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            className: classNameLevel,
            topicPrompt: textToSend,
            count: quizIntent.count,
            studentName: activeStudentName || undefined,
            recentContext,
            image: attachedImage
              ? { base64: attachedImage.base64, mimeType: attachedImage.mimeType }
              : undefined,
          }),
          signal: quizController.signal,
        });

        const payload = (await response.json().catch(() => ({}))) as {
          quiz?: QuizData;
          summaryText?: string;
          error?: string;
        };

        if (!response.ok || !payload.quiz) {
          throw new Error(payload.error || 'কুইজ তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
        }

        const baseSummary =
          payload.summaryText ||
          `**${payload.quiz.title}** তৈরি হয়েছে! প্রতিটি প্রশ্নে ৪টি অপশন আছে — নিচে উত্তর দাও:`;
        const summary = activeStudentName
          ? `${activeStudentName}, ${baseSummary}`
          : baseSummary;
        finalizeAssistantMessage(summary, false, payload.quiz);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        } else if (err instanceof TypeError || (typeof navigator !== 'undefined' && !navigator.onLine)) {
          // Network lost -> fall back smoothly to Offline WBBSE Quiz
          runOfflineQuizPipeline();
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
          setTeacherError(
            err instanceof Error
              ? err.message
              : 'কুইজ তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করো।',
          );
        }
      } finally {
        streamAbortRef.current = null;
        setIsStreaming(false);
      }
      return;
    }

    const runOfflineAnswerPipeline = async () => {
      const installedPack = getInstalledOfflinePack();
      const effectiveOfflineClass = installedPack?.capabilities.onlyClass ?? classNameLevel;
      let effectiveQuery = textToSend;
      let ocrNote = '';

      if (attachedImage) {
        if (installedPack && !installedPack.capabilities.allowCamera) {
          finalizeAssistantMessage(
            'অনলি ক্লাস ৮ (১০০ MB) প্যাকে ক্যামেরা বা বইয়ের ছবি পড়া চালু নেই — এতে শুধু **Class 8-এর মেসেজ, ভয়েস এবং PDF** কাজ করে।\n\nবইয়ের ছবি তুলে সমাধান পেতে **২৫০ MB ফাস্ট প্যাক** বা **৫০০ MB প্রো প্যাক** ডাউনলোড করো।',
            false,
          );
          return;
        }
        setIsStreaming(true);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: '*অফলাইনে বইয়ের ছবি থেকে লেখা পড়া হচ্ছে (OCR)...*' }
              : m,
          ),
        );
        const extracted = await extractTextFromImageOffline(attachedImage.dataUrl);
        if (extracted) {
          effectiveQuery = [textToSend, extracted].filter(Boolean).join('\n').trim();
          ocrNote = `\n\n*ছবি থেকে পড়া অংশ:* ${extracted.slice(0, 260)}`;
        }
      }

      const localAnswer = answerOfflineQuestion(
        effectiveQuery,
        effectiveOfflineClass,
        Boolean(attachedImage) && !effectiveQuery,
      );

      // If the student downloaded an Offline AI Pack (100MB Class 8, 250MB Fast, or 500MB Pro), stream on-device!
      if (isOfflineAiPackInstalled() && effectiveQuery) {
        setIsStreaming(true);
        const offlineController = new AbortController();
        streamAbortRef.current = offlineController;
        let streamedText = '';

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, text: '' } : m)),
        );

        try {
          const historyForOfflineAi = conversationForApi.slice(-6).map((m, idx, arr) => ({
            role: m.role,
            text:
              idx === arr.length - 1
                ? effectiveQuery
                : m.text || (m.image ? '[Photo attached]' : ''),
          }));

          const generated = await streamOfflineTeacherChat({
            className: effectiveOfflineClass,
            studentName: studentProfile.name.trim() || undefined,
            messages: historyForOfflineAi,
            contextHint: localAnswer.matchedTopicTitle ? localAnswer.answer : undefined,
            signal: offlineController.signal,
            onChunk: (chunk) => {
              streamedText += chunk;
              const snap = streamedText;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, text: snap } : m)),
              );
            },
          });

          const finalOfflineAiText = (generated || streamedText).trim();
          if (finalOfflineAiText) {
            const packFooter =
              installedPack?.tier === 'pro'
                ? 'অফলাইন AI প্রো (৫০০ MB · গুছানো উত্তর)'
                : installedPack?.tier === 'standard'
                  ? 'অফলাইন AI ফাস্ট (২৫০ MB · দ্রুত উত্তর)'
                  : 'অফলাইন AI (অনলি ক্লাস ৮ · ১০০ MB)';
            finalizeAssistantMessage(
              `${finalOfflineAiText}${ocrNote}\n\n---\n*${packFooter}*`,
              false,
            );
            return;
          }
        } catch {
          if (streamedText.trim()) {
            finalizeAssistantMessage(streamedText.trim(), false);
            return;
          }
        } finally {
          streamAbortRef.current = null;
          setIsStreaming(false);
        }
      }

      setIsStreaming(false);
      finalizeAssistantMessage(`${localAnswer.answer}${ocrNote}`, false);
    };

    // Complete Offline Mode: answer seamlessly on-device (Offline AI Brain + OCR + WBBSE Notes + Math Solver)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await runOfflineAnswerPipeline();
      return;
    }

    setIsStreaming(true);

    const controller = new AbortController();
    streamAbortRef.current = controller;

    let accumulatedText = '';

    const recentMessages = conversationForApi.slice(-FAST_API_SETTINGS.maxHistoryMessages);

    try {
      const response = await fetch('/api/teacher/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: classNameLevel,
          temperature: appConfig.temperature,
          concise: appConfig.conciseAnswers,
          studentName: studentProfile.name.trim() || undefined,
          messages: recentMessages.map((m, idx) => ({
            role: m.role,
            text: m.text,
            image:
              m.image && idx === recentMessages.length - 1
                ? { base64: m.image.base64, mimeType: m.image.mimeType }
                : undefined,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = 'Failed to get a response from AI Teacher.';
        try {
          const errJson = await response.json();
          if (errJson?.error) errMessage = errJson.error;
        } catch {
          // Non-JSON error
        }
        throw new Error(errMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming is unavailable in this browser.');
      }

      const decoder = new TextDecoder();
      let sseBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const events = sseBuffer.split(/\r?\n\r?\n/);
        sseBuffer = events.pop() ?? '';

        for (const rawEvent of events) {
          const lines = rawEvent.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            const payload = JSON.parse(jsonStr) as {
              text?: string;
              done?: boolean;
              error?: string;
            };

            if (payload.error) {
              throw new Error(payload.error);
            }

            if (payload.text) {
              accumulatedText += payload.text;
              const snapshot = accumulatedText;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, text: snapshot } : m)),
              );
            }
          }
        }
      }

      const finalAnswer = accumulatedText.trim();
      if (finalAnswer) {
        finalizeAssistantMessage(finalAnswer, true);
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        if (accumulatedText.trim()) {
          setLatestCompletedAssistantId(assistantMsgId);
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        }
      } else if (!accumulatedText.trim()) {
        // Network lost / no mobile data fallback -> answer offline automatically
        await runOfflineAnswerPipeline();
      } else {
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantMsgId && !m.text.trim())),
        );
        setTeacherError(
          err instanceof Error
            ? err.message
            : 'Network error. Please check your connection and try again.',
        );
      }
    } finally {
      streamAbortRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleOpenOfflineTopic = (questionTitle: string, fullAnswer: string) => {
    if (isStreaming) return;
    setTeacherError(null);
    setTeacherValidation(null);
    const now = Date.now();
    const historyId = `${now}-${Math.random().toString(36).slice(2, 7)}`;
    const uMsg: ChatMessage = {
      id: `u-off-${now}`,
      role: 'user',
      text: questionTitle,
      historyId,
      createdAt: now,
    };
    const mMsg: ChatMessage = {
      id: `m-off-${now + 1}`,
      role: 'model',
      text: fullAnswer,
      historyId,
      createdAt: now + 1,
    };
    const nextConversation = [...messagesRef.current, uMsg, mMsg];
    setMessages(nextConversation);
    setLatestCompletedAssistantId(mMsg.id);
    pushHistory({
      id: historyId,
      type: 'teacher',
      className: classNameLevel,
      question: questionTitle,
      hasImage: false,
      answer: fullAnswer,
      messages: nextConversation.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        highlights: m.highlights,
        createdAt: m.createdAt,
      })),
      createdAt: now,
    });
  };

  const handleDictionarySearch = async (overrideWord?: string) => {
    const targetWord = (overrideWord ?? dictWord).trim();
    if (!targetWord) {
      setDictValidation('Please enter a word to search.');
      return;
    }

    setDictValidation(null);
    setDictError(null);
    setDictOfflineSuggestions([]);

    const runOfflineLookup = async () => {
      if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed('dictionary')) {
        setDictEntry(null);
        setDictOfflineSuggestions([]);
        setDictError(
          'অনলি ক্লাস ৮ (১০০ MB) প্যাকে অফলাইন ডিকশনারি চালু নেই — এতে শুধু Class 8-এর মেসেজ, ভয়েস ও PDF কাজ করে। ডিকশনারি ও সব ফিচার পেতে ২৫০ MB ফাস্ট বা ৫০০ MB প্রো প্যাক ডাউনলোড করো।',
        );
        return;
      }

      const offlineResult = lookupOfflineDictionary(targetWord);
      if (offlineResult.entry) {
        setDictEntry(offlineResult.entry);
        setDictError(null);
        setDictOfflineSuggestions([]);
        pushHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: 'dictionary',
          word: offlineResult.entry.word || targetWord,
          entry: offlineResult.entry,
          createdAt: Date.now(),
        });
        return;
      }

      // If 250MB or 500MB Offline AI Pack is downloaded, generate full dictionary entry on-device for ANY word!
      if (isOfflineAiPackInstalled() && isOfflineFeatureAllowed('dictionary')) {
        setDictLoading(true);
        try {
          const aiEntry = await lookupOfflineAiDictionary(targetWord);
          if (aiEntry) {
            setDictEntry(aiEntry);
            setDictError(null);
            setDictOfflineSuggestions([]);
            saveOfflineDictionaryEntry(aiEntry);
            pushHistory({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: 'dictionary',
              word: aiEntry.word || targetWord,
              entry: aiEntry,
              createdAt: Date.now(),
            });
            return;
          }
        } finally {
          setDictLoading(false);
        }
      }

      setDictEntry(null);
      setDictOfflineSuggestions(offlineResult.suggestions);
      setDictError(
        `অফলাইন ডিকশনারিতে "${targetWord}" শব্দটি নেই। যেকোনো শব্দের অফলাইন অর্থ পেতে "Offline AI (250 MB / 500 MB)" প্যাক ডাউনলোড করুন, অথবা নিচের শব্দগুলো বেছে নিন।`,
      );
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await runOfflineLookup();
      return;
    }

    setDictLoading(true);

    try {
      const response = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          temperature: appConfig.temperature,
          concise: appConfig.conciseAnswers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to look up the word.');
      }

      setDictEntry(data.entry);
      saveOfflineDictionaryEntry(data.entry);
      pushHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'dictionary',
        word: data.entry.word || targetWord,
        entry: data.entry,
        createdAt: Date.now(),
      });
    } catch {
      // Seamless fallback to offline dictionary + offline AI brain when network/data is unavailable
      await runOfflineLookup();
    } finally {
      setDictLoading(false);
    }
  };

  const handleResetSession = () => {
    if (mode === 'teacher') {
      if (isListening) stopListening();
      handleStopStreaming();
      setMessages([]);
      setDraftText('');
      setImage(null);
      setTeacherError(null);
      setTeacherValidation(null);
      setLatestCompletedAssistantId(null);
      setShouldAutoSpeakLatest(false);
    } else {
      setDictWord('');
      setDictEntry(null);
      setDictError(null);
      setDictValidation(null);
    }
  };

  const handleSaveLiveTranscripts = (items: LiveTranscriptItem[]) => {
    const valid = items.filter((item) => item.text.trim().length > 0);
    if (valid.length === 0) return;

    const now = Date.now();
    const firstUser = valid.find((item) => item.role === 'user')?.text ?? 'Live Voice Session';
    const lastModel = [...valid].reverse().find((item) => item.role === 'model')?.text ?? '';
    const historyId = lastModel ? `${now}-${Math.random().toString(36).slice(2, 7)}` : undefined;

    const mapped: ChatMessage[] = valid.map((item, idx) => ({
      id: `live-${now}-${idx}`,
      role: item.role,
      text: item.text,
      ...(historyId ? { historyId } : {}),
      createdAt: now + idx,
    }));

    setMessages((prev) => [...prev, ...mapped]);

    if (lastModel && historyId) {
      pushHistory({
        id: historyId,
        type: 'teacher',
        className: classNameLevel,
        question: firstUser,
        hasImage: false,
        answer: lastModel,
        messages: mapped.map((m) => ({
          id: m.id,
          role: m.role,
          text: m.text,
          highlights: m.highlights,
          createdAt: m.createdAt,
        })),
        createdAt: now,
      });
    }
  };

  const handleSelectHistory = (item: StudyHistoryItem) => {
    if (item.type === 'teacher') {
      handleStopStreaming();
      setMode('teacher');
      setClassNameLevel(item.className);
      setDraftText('');
      setImage(null);
      setTeacherError(null);
      setTeacherValidation(null);
      setShouldAutoSpeakLatest(false);

      if (item.messages && item.messages.length > 0) {
        const lastIdx = item.messages.length - 1;
        setMessages(
          item.messages.map((m, idx) => ({
            id: m.id || `hist-${item.id}-${idx}`,
            role: m.role,
            text: m.text,
            highlights:
              m.highlights ??
              (m.role === 'model' && idx === lastIdx ? item.highlights : undefined),
            quiz: m.quiz,
            historyId: item.id,
            createdAt: m.createdAt,
          })),
        );
      } else {
        setMessages([
          {
            id: `hist-u-${item.id}`,
            role: 'user',
            text: item.question,
            historyId: item.id,
            createdAt: item.createdAt,
          },
          {
            id: `hist-m-${item.id}`,
            role: 'model',
            text: item.answer,
            highlights: item.highlights,
            historyId: item.id,
            createdAt: item.createdAt,
          },
        ]);
      }
    } else {
      setMode('dictionary');
      setDictWord(item.word);
      setDictEntry(item.entry);
      setDictError(null);
      setDictValidation(null);
    }
  };

  const handleAddHighlight = useCallback(
    (messageId: string, rawPhrase: string) => {
      const phrase = rawPhrase.trim();
      if (!phrase) return;

      const currentMessages = messagesRef.current;
      const targetIndex = currentMessages.findIndex((m) => m.id === messageId);
      const targetMsg = targetIndex >= 0 ? currentMessages[targetIndex] : undefined;
      if (!targetMsg || targetMsg.role !== 'model') return;

      const existingHistoryId = targetMsg.historyId;
      let resolvedHistoryId = existingHistoryId;

      setHistory((prevHistory) => {
        let matchedAny = false;

        const updatedHistory = prevHistory.map((item) => {
          if (item.type !== 'teacher') return item;

          const matchesById =
            (existingHistoryId && item.id === existingHistoryId) ||
            Boolean(item.messages?.some((m) => m.id === messageId));

          if (!matchesById) return item;

          matchedAny = true;
          resolvedHistoryId = item.id;

          if (item.messages && item.messages.length > 0) {
            let msgMatched = false;
            const nextMsgs = item.messages.map((m, idx) => {
              const isTarget =
                m.id === messageId ||
                (!m.id && m.role === 'model' && idx === item.messages!.length - 1);
              if (!isTarget) return m;
              msgMatched = true;
              const nextHighlights = collectUniqueHighlights([m.highlights, [phrase]]);
              return { ...m, id: m.id || messageId, highlights: nextHighlights };
            });

            return {
              ...item,
              messages: nextMsgs,
              highlights: msgMatched
                ? collectUniqueHighlights(nextMsgs.map((m) => m.highlights))
                : collectUniqueHighlights([item.highlights, [phrase]]),
            };
          }

          return {
            ...item,
            highlights: collectUniqueHighlights([item.highlights, [phrase]]),
          };
        });

        if (matchedAny) return updatedHistory;

        const newHistoryId =
          existingHistoryId || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        resolvedHistoryId = newHistoryId;

        const contextSlice = currentMessages.slice(0, targetIndex + 1);
        const lastUserBeforeTarget = [...contextSlice]
          .reverse()
          .find((m) => m.role === 'user');
        const historyMessages = contextSlice.map((m) => ({
          id: m.id,
          role: m.role,
          text: m.text || (m.image ? '[Photo attached]' : ''),
          highlights:
            m.id === messageId
              ? collectUniqueHighlights([m.highlights, [phrase]])
              : m.highlights,
          createdAt: m.createdAt,
        }));

        const createdItem: StudyHistoryItem = {
          id: newHistoryId,
          type: 'teacher',
          className: classNameLevel,
          question: lastUserBeforeTarget?.text || 'Highlighted Study Note',
          hasImage: Boolean(lastUserBeforeTarget?.image),
          answer: targetMsg.text,
          highlights: collectUniqueHighlights(historyMessages.map((m) => m.highlights)),
          messages: historyMessages,
          createdAt: targetMsg.createdAt || Date.now(),
        };

        return [createdItem, ...updatedHistory].slice(0, MAX_HISTORY_ITEMS);
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                historyId: resolvedHistoryId ?? m.historyId,
                highlights: collectUniqueHighlights([m.highlights, [phrase]]),
              }
            : m,
        ),
      );
    },
    [classNameLevel],
  );

  const handleRemoveHighlight = useCallback((messageId: string, rawPhrase: string) => {
    const phrase = rawPhrase.trim();
    if (!phrase) return;

    const targetMsg = messagesRef.current.find((m) => m.id === messageId);
    const targetHistoryId = targetMsg?.historyId;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId || !m.highlights) return m;
        const filtered = m.highlights.filter((h) => h !== phrase);
        return { ...m, highlights: filtered.length > 0 ? filtered : undefined };
      }),
    );

    setHistory((prevHistory) =>
      prevHistory.map((item) => {
        if (item.type !== 'teacher') return item;
        const matches =
          (targetHistoryId && item.id === targetHistoryId) ||
          Boolean(item.messages?.some((m) => m.id === messageId));
        if (!matches) return item;

        if (item.messages && item.messages.length > 0) {
          const nextMsgs = item.messages.map((m, idx) => {
            const isTarget =
              m.id === messageId ||
              (!m.id && m.role === 'model' && idx === item.messages!.length - 1);
            if (!isTarget || !m.highlights) return m;
            const filtered = m.highlights.filter((h) => h !== phrase);
            return { ...m, highlights: filtered.length > 0 ? filtered : undefined };
          });
          return {
            ...item,
            messages: nextMsgs,
            highlights: collectUniqueHighlights(nextMsgs.map((m) => m.highlights)),
          };
        }

        const filteredItem = item.highlights?.filter((h) => h !== phrase);
        return {
          ...item,
          highlights: filteredItem && filteredItem.length > 0 ? filteredItem : undefined,
        };
      }),
    );
  }, []);

  const handleRemoveHistoryHighlight = useCallback((historyId: string, rawPhrase: string) => {
    const phrase = rawPhrase.trim();
    if (!phrase) return;

    setHistory((prevHistory) =>
      prevHistory.map((item) => {
        if (item.type !== 'teacher' || item.id !== historyId) return item;

        const nextMsgs = item.messages?.map((m) => {
          if (!m.highlights) return m;
          const filtered = m.highlights.filter((h) => h !== phrase);
          return { ...m, highlights: filtered.length > 0 ? filtered : undefined };
        });

        const nextItemHighlights = nextMsgs
          ? collectUniqueHighlights(nextMsgs.map((m) => m.highlights))
          : (() => {
              const filtered = item.highlights?.filter((h) => h !== phrase);
              return filtered && filtered.length > 0 ? filtered : undefined;
            })();

        return {
          ...item,
          ...(nextMsgs ? { messages: nextMsgs } : {}),
          highlights: nextItemHighlights,
        };
      }),
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.historyId !== historyId || !m.highlights) return m;
        const filtered = m.highlights.filter((h) => h !== phrase);
        return { ...m, highlights: filtered.length > 0 ? filtered : undefined };
      }),
    );
  }, []);

  const handleAdminLoginSuccess = (payload: {
    token: string;
    username: string;
    config: AppProgramConfig;
    stats: AdminServerStats;
  }) => {
    const incomingVer = payload.config.configVersion || 1;
    const currentVer = appConfigRef.current.configVersion || 1;
    const chosenConfig = incomingVer >= currentVer ? payload.config : appConfigRef.current;
    const v = chosenConfig.configVersion || 1;
    setAdminToken(payload.token);
    setAdminUsername(payload.username);
    setAppConfig(chosenConfig);
    saveAppliedConfig(chosenConfig);
    saveAppliedVersion(v);
    setAppliedVersion(v);
    setPendingUpdateConfig(null);
    setUpdateModalOpen(false);
    setClassNameLevel(chosenConfig.defaultClass);
    setAdminStats(payload.stats);
    try {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, payload.token);
    } catch {
      // Storage fallback
    }
  };

  const handleAdminConfigUpdated = (
    nextConfig: AppProgramConfig,
    nextStats?: AdminServerStats,
  ) => {
    const v = nextConfig.configVersion || 1;
    setAppConfig(nextConfig);
    saveAppliedConfig(nextConfig);
    saveAppliedVersion(v);
    setAppliedVersion(v);
    setPendingUpdateConfig(null);
    setUpdateModalOpen(false);
    setClassNameLevel(nextConfig.defaultClass);
    if (nextStats) setAdminStats(nextStats);
  };

  const handleConfirmAppUpdate = async () => {
    if (isApplyingUpdate) return;
    setIsApplyingUpdate(true);

    const nextToApply = pendingUpdateConfig ?? appConfigRef.current;
    const targetVer = nextToApply.configVersion || 1;
    saveAppliedConfig(nextToApply);
    saveAppliedVersion(targetVer);
    setAppConfig(nextToApply);
    setAppliedVersion(targetVer);

    await hardRefreshToLatestBuild(targetVer);
  };

  const handleDismissAppUpdate = () => {
    if (pendingUpdateConfig?.configVersion) {
      dismissedVersionRef.current = pendingUpdateConfig.configVersion;
    }
    setUpdateModalOpen(false);
  };

  const handleManualCheckUpdate = async () => {
    if (isCheckingUpdate || isApplyingUpdate) return;

    if (pendingUpdateConfig || hasSwUpdate) {
      setUpdateModalOpen(true);
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setUpdateCheckStatus({
        type: 'warn',
        text: 'অফলাইন মোডে আছেন — নতুন আপডেট চেক করতে একবার ইন্টারনেট অন করুন।',
      });
      return;
    }

    setIsCheckingUpdate(true);
    setUpdateCheckStatus(null);
    try {
      let foundUpdate = false;

      if ('serviceWorker' in navigator) {
        const reg = await Promise.race([
          navigator.serviceWorker.getRegistration(),
          new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 2000)),
        ]).catch(() => undefined);

        if (reg) {
          await reg.update().catch(() => {});
          if (reg.waiting || reg.installing) {
            setHasSwUpdate(true);
            foundUpdate = true;
          }
        }
      }

      const ts = Date.now();
      const [cloudCfg, serverPayload, metaPayload] = await Promise.all([
        getLatestFirestoreConfig().catch(() => null),
        fetch(`/api/config?fresh=1&_t=${ts}`, { cache: 'no-store' })
          .then((res) =>
            res.ok
              ? (res.json() as Promise<{ config?: AppProgramConfig; buildVersion?: string }>)
              : null,
          )
          .catch(() => null),
        fetch(`/build-meta.json?_t=${ts}`, { cache: 'no-store' })
          .then((res) =>
            res.ok ? (res.json() as Promise<{ buildId?: string }>) : null,
          )
          .catch(() => null),
      ]);

      const serverCfg = serverPayload?.config ?? null;
      const remoteBuild =
        (serverPayload?.buildVersion && serverPayload.buildVersion !== 'dev'
          ? serverPayload.buildVersion
          : undefined) || metaPayload?.buildId;

      if (
        remoteBuild &&
        remoteBuild !== 'dev' &&
        CLIENT_BUILD_VERSION !== 'dev' &&
        remoteBuild !== CLIENT_BUILD_VERSION
      ) {
        setHasSwUpdate(true);
        foundUpdate = true;
      }

      let incoming: AppProgramConfig | null = null;
      if (cloudCfg && serverCfg) {
        incoming =
          (cloudCfg.configVersion || 1) >= (serverCfg.configVersion || 1)
            ? cloudCfg
            : serverCfg;
      } else {
        incoming = cloudCfg || serverCfg;
      }

      const currentVer = getStoredAppliedVersion() ?? appliedVersion;
      if (incoming && (incoming.configVersion || 1) > currentVer) {
        setPendingUpdateConfig(incoming);
        dismissedVersionRef.current = null;
        foundUpdate = true;
      } else if (incoming) {
        saveAppliedConfig(incoming);
        setAppConfig(incoming);
      }

      if (foundUpdate) {
        setUpdateModalOpen(true);
      } else {
        setUpdateCheckStatus({
          type: 'info',
          text: `আপনার অ্যাপটি সম্পূর্ণ আপ-টু-ডেট আছে (v1.0.${incoming?.configVersion ?? appliedVersion}) ✓`,
        });
      }
    } catch {
      setUpdateCheckStatus({
        type: 'warn',
        text: 'এই মুহূর্তে আপডেট সার্ভারের সাথে কানেক্ট করা যায়নি। একটু পর আবার চেষ্টা করুন।',
      });
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUsername(null);
    setAdminStats(null);
    try {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    } catch {
      // Storage fallback
    }
  };

  const openAdminConsole = () => {
    setAdminModalOpen(true);
    if (adminToken) {
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { stats?: AdminServerStats; config?: AppProgramConfig } | null) => {
          if (data?.stats) setAdminStats(data.stats);
          if (data?.config) {
            const incomingVer = data.config.configVersion || 1;
            const currentVer = appConfigRef.current.configVersion || 1;
            if (incomingVer >= currentVer) {
              setAppConfig(data.config);
              saveAppliedConfig(data.config);
              saveAppliedVersion(incomingVer);
              setAppliedVersion(incomingVer);
            }
          }
        })
        .catch(() => {});
    }
  };

  const showBothDisabled = !appConfig.enableTeacher && !appConfig.enableDictionary;

  return (
    <div className="relative z-10 h-dvh flex flex-col bg-transparent text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Single-Line Compact Header: Keeps Maximum Space for Chat Replies */}
      <header
        ref={headerMenuRef}
        className="relative shrink-0 z-30 wbsec-safe-top bg-[var(--app-header-bg)] backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-5 lg:px-8 h-11 sm:h-12 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Left: Brand + New Chat + Desktop Mode Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                if (appConfig.enableTeacher) setMode('teacher');
                else if (appConfig.enableDictionary) setMode('dictionary');
              }}
              className="flex items-center gap-1.5 shrink-0"
            >
              <img
                src="/pwa-192x192.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 rounded-lg shrink-0 shadow-xs"
              />
              <span className="text-[15px] sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                {appConfig.appName}
              </span>
              <span className="hidden xl:inline text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {appConfig.attributionText}
              </span>
            </a>

            <button
              type="button"
              onClick={handleResetSession}
              aria-label="New Chat"
              title="New Chat"
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 active:scale-[0.97] inline-flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>New</span>
              <span className="hidden sm:inline">Chat</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 ml-1 text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">
              {appConfig.enableTeacher && (
                <button
                  type="button"
                  onClick={() => setMode('teacher')}
                  className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    mode === 'teacher'
                      ? 'text-slate-900 dark:text-white border-[var(--app-accent)] dark:border-sky-400'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  AI Teacher
                </button>
              )}
              {appConfig.enableDictionary && (
                <button
                  type="button"
                  onClick={() => setMode('dictionary')}
                  className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    mode === 'dictionary'
                      ? 'text-slate-900 dark:text-white border-[var(--app-accent)] dark:border-sky-400'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Dictionary
                </button>
              )}
            </nav>
          </div>

          {/* Right: Desktop Single-Line Utilities + Mobile Compact Get App, Menu & Profile */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Desktop-only inline actions (all neatly on ONE line) */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-[var(--app-accent)] hover:text-[var(--app-accent)] dark:hover:border-sky-400 dark:hover:text-sky-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <NotebookText className="w-3.5 h-3.5 shrink-0" />
                <span>Notes ({history.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setOfflineAiModalOpen(true)}
                aria-label="Offline AI Pack Manager (100 MB, 250 MB, 500 MB)"
                title="Download or manage Offline AI Packs (100 MB / 250 MB / 500 MB)"
                className={`h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  offlineAiState.status === 'downloading'
                    ? 'border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300'
                    : offlineAiState.installedTier
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                      : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950'
                }`}
              >
                {offlineAiState.status === 'downloading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>AI {offlineAiState.progress.percent}%</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {offlineAiState.installedTier === 'pro'
                        ? '500MB AI ✓'
                        : offlineAiState.installedTier === 'standard'
                          ? '250MB AI ✓'
                          : offlineAiState.installedTier === 'class8'
                            ? 'Class 8 AI ✓'
                            : 'Offline AI'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => void handleManualCheckUpdate()}
                disabled={isCheckingUpdate || isApplyingUpdate}
                aria-label="Check for app updates"
                title={
                  pendingUpdateConfig || hasSwUpdate
                    ? 'New update ready — tap to update'
                    : 'Check for app updates'
                }
                className={`relative h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 ${
                  pendingUpdateConfig || hasSwUpdate
                    ? 'border-[var(--app-accent)] bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent-hover)] shadow-xs'
                    : 'border-cyan-400/50 dark:border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/50'
                }`}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 shrink-0 ${isCheckingUpdate ? 'animate-spin' : ''}`}
                />
                <span>{isCheckingUpdate ? 'Checking...' : 'Update'}</span>
                {(pendingUpdateConfig || hasSwUpdate) && (
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={openAdminConsole}
                aria-label={adminToken ? 'Open Admin Control Panel' : 'Admin Login'}
                title={adminToken ? `Admin Console (${adminUsername || 'Amir123'})` : 'Admin Login'}
                className={`h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                  adminToken
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {adminToken ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center justify-center transition-colors shrink-0"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <PWAInstallButton apkDownloadUrl={appConfig.apkDownloadUrl} variant="header" />
            </div>

            {/* Mobile/Tablet Compact More Menu Toggle (keeps extra buttons neatly below in 1 tap) */}
            <button
              type="button"
              onClick={() => setHeaderMenuOpen((prev) => !prev)}
              aria-expanded={headerMenuOpen}
              aria-label="More options (Offline AI, Update, Theme, Admin)"
              title="আরও অপশন (Offline AI, Update, Theme, Admin)"
              className={`lg:hidden relative h-8 px-2 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors shrink-0 ${
                headerMenuOpen
                  ? 'border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-cyan-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {headerMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {(pendingUpdateConfig || hasSwUpdate || offlineAiState.status === 'downloading') && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900 animate-pulse"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              aria-label={
                studentProfile.name
                  ? `${studentProfile.name} — প্রোফাইল ও অ্যাভাটার পরিবর্তন করো`
                  : 'প্রোফাইল ও নাম সেট করো'
              }
              title={
                studentProfile.name
                  ? `${studentProfile.name} (প্রোফাইল বদলাও)`
                  : 'আমার প্রোফাইল'
              }
              className="shrink-0 h-8 pl-0.5 pr-0.5 sm:pr-2 rounded-full border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 hover:border-cyan-400 dark:hover:border-cyan-400 inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <StudentAvatar profile={studentProfile} size="xs" />
              <span className="hidden sm:inline max-w-[88px] truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                {studentProfile.name || 'Profile'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Floating Utility Drawer (Only visible when Menu is tapped) */}
        {headerMenuOpen && (
          <div
            className="lg:hidden absolute left-0 right-0 top-full z-40 border-b border-slate-200 dark:border-white/15 bg-white/98 dark:bg-[#0d1020]/98 backdrop-blur-xl shadow-xl px-3 py-2.5"
            aria-label="Extra options menu"
          >
            <div className="max-w-xl mx-auto grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHeaderMenuOpen(false);
                  setOfflineAiModalOpen(true);
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  offlineAiState.status === 'downloading'
                    ? 'border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300'
                    : offlineAiState.installedTier
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200'
                }`}
              >
                {offlineAiState.status === 'downloading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>AI {offlineAiState.progress.percent}%</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {offlineAiState.installedTier === 'pro'
                        ? '500MB AI ✓'
                        : offlineAiState.installedTier === 'standard'
                          ? '250MB AI ✓'
                          : offlineAiState.installedTier === 'class8'
                            ? 'Class 8 AI ✓'
                            : 'Offline AI প্যাক'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeaderMenuOpen(false);
                  void handleManualCheckUpdate();
                }}
                disabled={isCheckingUpdate || isApplyingUpdate}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 ${
                  pendingUpdateConfig || hasSwUpdate
                    ? 'border-[var(--app-accent)] bg-[var(--app-accent)] text-white shadow-xs'
                    : 'border-cyan-400/50 dark:border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200'
                }`}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 shrink-0 ${isCheckingUpdate ? 'animate-spin' : ''}`}
                />
                <span>{isCheckingUpdate ? 'Checking...' : 'App Update'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setHeaderMenuOpen(false);
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 shrink-0" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 shrink-0" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeaderMenuOpen(false);
                  openAdminConsole();
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  adminToken
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {adminToken ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin Panel</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin Login</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Announcement Banner */}
      {appConfig.announcementBanner && (
        <div className="shrink-0 bg-[var(--app-accent-soft)] border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2 text-center">
          <Megaphone className="w-3.5 h-3.5 text-[var(--app-accent)] dark:text-sky-400 shrink-0" />
          <span>{appConfig.announcementBanner}</span>
        </div>
      )}

      {/* Subtle Bar if User Dismissed Pending Update Earlier */}
      {(pendingUpdateConfig || hasSwUpdate) && !updateModalOpen && (
        <div className="shrink-0 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-900 px-3 py-1.5 flex items-center justify-center gap-3 text-xs">
          <span className="font-medium text-emerald-900 dark:text-emerald-200">
            Update v1.0.{pendingUpdateConfig?.configVersion ?? appliedVersion} is ready
          </span>
          <button
            type="button"
            onClick={() => setUpdateModalOpen(true)}
            className="min-h-[28px] px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            Update &amp; Restart
          </button>
        </div>
      )}

      {/* Post-Restart Update Confirmation */}
      {justUpdatedNotice && (
        <div className="shrink-0 bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>অ্যাপ আপডেট হয়ে গেছে (v1.0.{justUpdatedNotice}) — এখন অফলাইনেও ব্যবহার করা যাবে।</span>
        </div>
      )}

      {/* Offline Precache Ready Confirmation */}
      {offlineReadyNotice && !justUpdatedNotice && (
        <div className="shrink-0 bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>অফলাইন পড়াশোনার জন্য অ্যাপ সেভ হয়ে গেছে — এখন রিচার্জ ছাড়াই চলবে!</span>
        </div>
      )}

      {/* Manual Update Check Status Feedback */}
      {updateCheckStatus && !justUpdatedNotice && (
        <div
          className={`shrink-0 px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 ${
            updateCheckStatus.type === 'warn'
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{updateCheckStatus.text}</span>
        </div>
      )}

      {/* Main Content — Full-Bleed on Mobile for Maximum Reply Reading Space */}
      <main
        id="top"
        className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-0 sm:px-5 lg:px-8 py-0 sm:py-2 flex flex-col"
      >
        {appConfig.maintenanceMode || showBothDisabled ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {appConfig.maintenanceMode ? 'App Maintenance Active' : 'Programs Paused by Admin'}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {appConfig.maintenanceMode
                    ? appConfig.maintenanceMessage
                    : 'All study modules are currently disabled by Admin.'}
                </p>
              </div>
              <button
                type="button"
                onClick={openAdminConsole}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {adminToken ? 'Open Admin Console' : 'Admin Login'}
              </button>
            </div>
          </div>
        ) : mode === 'teacher' && appConfig.enableTeacher ? (
          <div className="flex-1 min-h-0 flex flex-col">
            <TeacherWorkspace
              classNameLevel={classNameLevel}
              onClassChange={handleClassLevelChange}
              messages={messages}
              draftText={draftText}
              onDraftTextChange={(val) => {
                setDraftText(val);
                if (teacherValidation) setTeacherValidation(null);
              }}
              image={image}
              onImageChange={(img) => {
                setImage(img);
                if (teacherValidation) setTeacherValidation(null);
              }}
              isStreaming={isStreaming}
              error={teacherError}
              validationError={teacherValidation}
              onSendMessage={handleSendMessage}
              onStopStreaming={handleStopStreaming}
              onReset={handleResetSession}
              latestCompletedAssistantId={latestCompletedAssistantId}
              shouldAutoSpeakLatest={shouldAutoSpeakLatest}
              onHandledAutoSpeak={() => setShouldAutoSpeakLatest(false)}
              isSpeechSupported={isSpeechSupported}
              isListening={isListening}
              isTranscribing={isTranscribing}
              interimTranscript={interimTranscript}
              speechLang={speechLang}
              onSpeechLangChange={(nextLang: SpeechLang) => setSpeechLang(nextLang)}
              speechError={speechError}
              onToggleListening={toggleListening}
              onStopListening={stopListening}
              onSaveLiveTranscripts={handleSaveLiveTranscripts}
              onAddHighlight={handleAddHighlight}
              onRemoveHighlight={handleRemoveHighlight}
              isOnline={isOnline}
              offlineAiReady={Boolean(offlineAiState.installedTier)}
              offlineAiTier={offlineAiState.installedTier}
              onOpenOfflineAiPack={() => setOfflineAiModalOpen(true)}
              openLiveCounter={openLiveCounter}
              onOpenOfflineTopic={handleOpenOfflineTopic}
              studentProfile={studentProfile}
              onOpenProfile={() => setProfileModalOpen(true)}
              appConfig={appConfig}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pb-4">
            <Suspense fallback={null}>
              <DictionaryWorkspace
                word={dictWord}
                onWordChange={(val) => {
                  setDictWord(val);
                  if (dictValidation) setDictValidation(null);
                }}
                entry={dictEntry}
                isLoading={dictLoading}
                error={dictError}
                validationError={dictValidation}
                onSearch={handleDictionarySearch}
                isOnline={isOnline}
                offlineSuggestions={dictOfflineSuggestions}
                appConfig={appConfig}
              />
            </Suspense>
          </div>
        )}
      </main>

      {/* Compact Native Mobile Bottom App Navigation Bar (Includes Install Button at Bottom) */}
      {(appConfig.enableTeacher || appConfig.enableDictionary) && !appConfig.maintenanceMode && !showBothDisabled && (
        <nav
          aria-label="Mobile app navigation"
          className="lg:hidden shrink-0 z-30 wbsec-safe-bottom bg-[var(--app-header-bg)] backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10"
        >
          <div className="grid grid-flow-col auto-cols-fr h-11 max-w-xl mx-auto px-1">
            {appConfig.enableTeacher && (
              <button
                type="button"
                onClick={() => setMode('teacher')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  mode === 'teacher'
                    ? 'text-fuchsia-600 dark:text-cyan-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Teacher</span>
              </button>
            )}

            {appConfig.enableDictionary && (
              <button
                type="button"
                onClick={() => setMode('dictionary')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  mode === 'dictionary'
                    ? 'text-fuchsia-600 dark:text-cyan-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Dictionary</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
            >
              <NotebookText className="w-4 h-4" />
              <span>Notes ({history.length})</span>
            </button>

            <PWAInstallButton apkDownloadUrl={appConfig.apkDownloadUrl} variant="bottom-nav" />
          </div>
        </nav>
      )}

      {historyOpen && (
        <Suspense fallback={null}>
          <HistoryDrawer
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            items={history}
            onSelect={handleSelectHistory}
            onClearAll={() => setHistory([])}
            onRemoveHighlight={handleRemoveHistoryHighlight}
          />
        </Suspense>
      )}

      {adminModalOpen && (
        <Suspense fallback={null}>
          <AdminModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            token={adminToken}
            adminUsername={adminUsername}
            firebaseUser={firebaseUser}
            currentConfig={appConfig}
            stats={adminStats}
            onLoginSuccess={handleAdminLoginSuccess}
            onConfigUpdated={handleAdminConfigUpdated}
            onLogout={handleAdminLogout}
          />
        </Suspense>
      )}

      {offlineAiModalOpen && (
        <Suspense fallback={null}>
          <OfflineAiPackModal
            isOpen={offlineAiModalOpen}
            onClose={() => setOfflineAiModalOpen(false)}
            isOnline={isOnline}
            onOpenLiveOffline={() => {
              setMode('teacher');
              setOpenLiveCounter((c) => c + 1);
            }}
          />
        </Suspense>
      )}

      {updateModalOpen && (
        <Suspense fallback={null}>
          <AppUpdateModal
            isOpen={updateModalOpen}
            currentVersion={appliedVersion}
            pendingConfig={pendingUpdateConfig}
            hasSwUpdate={hasSwUpdate}
            isApplying={isApplyingUpdate}
            onConfirmUpdate={handleConfirmAppUpdate}
            onDismiss={handleDismissAppUpdate}
          />
        </Suspense>
      )}

      <StudentOnboardingModal
        isOpen={!studentProfile.onboardingCompleted && !appConfig.maintenanceMode && !showBothDisabled}
        appName={appConfig.appName}
        initialClass={classNameLevel}
        onComplete={handleSaveStudentProfile}
      />

      {profileModalOpen && (
        <Suspense fallback={null}>
          <StudentProfileModal
            isOpen={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            profile={studentProfile}
            currentClass={classNameLevel}
            onSave={handleSaveStudentProfile}
          />
        </Suspense>
      )}

      <OfflineIndicator />
    </div>
  );
}
