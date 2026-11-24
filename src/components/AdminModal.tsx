import React, { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  X,
  LogOut,
  RotateCcw,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Sliders,
  Cpu,
  ListChecks,
  ArrowUpCircle,
  Wand2,
  Cloud,
  CloudOff,
  Smartphone,
} from 'lucide-react';
import {
  ADMIN_EMAILS,
  isAuthorizedAdminUser,
  publishAppSettingsToFirestore,
  signInAdminWithGoogle,
  signOutFirebaseAdmin,
} from '../firebase';
import {
  DEFAULT_APP_CONFIG,
  type AdminServerStats,
  type AppAccentColor,
  type AppFontScale,
  type AppPageBackground,
  type AppProgramConfig,
  type ClassLevel,
  type LiveRole,
  type VoicePersona,
} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  adminUsername: string | null;
  firebaseUser: User | null;
  currentConfig: AppProgramConfig;
  stats: AdminServerStats | null;
  onLoginSuccess: (payload: {
    token: string;
    username: string;
    config: AppProgramConfig;
    stats: AdminServerStats;
  }) => void;
  onConfigUpdated: (config: AppProgramConfig, stats?: AdminServerStats) => void;
  onLogout: () => void;
}

type AdminTab = 'publish' | 'programs' | 'ai' | 'content';

const CLASS_LEVELS: ClassLevel[] = [
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

const VOICE_OPTIONS: VoicePersona[] = [
  'Kore',
  'Puck',
  'Zephyr',
  'Charon',
  'Fenrir',
];

const LIVE_ROLE_OPTIONS: Array<{ value: LiveRole; label: string }> = [
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'english', label: 'English' },
  { value: 'bilingual', label: 'English + বাংলা' },
];

const ACCENT_OPTIONS: Array<{ value: AppAccentColor; label: string; swatch: string }> = [
  { value: 'blue', label: 'Blue', swatch: '#007AFF' },
  { value: 'emerald', label: 'Emerald', swatch: '#059669' },
  { value: 'indigo', label: 'Indigo', swatch: '#4F46E5' },
  { value: 'violet', label: 'Violet', swatch: '#7C3AED' },
  { value: 'rose', label: 'Rose', swatch: '#E11D48' },
  { value: 'amber', label: 'Amber', swatch: '#D97706' },
];

const PAGE_BACKGROUND_OPTIONS: Array<{
  value: AppPageBackground;
  label: string;
  swatch: string;
}> = [
  { value: 'default', label: 'Default', swatch: '#F5F7FA' },
  { value: 'yellow', label: 'Yellow', swatch: '#FEF08A' },
  { value: 'blue', label: 'Blue', swatch: '#DBEAFE' },
  { value: 'emerald', label: 'Green', swatch: '#D1FAE5' },
  { value: 'rose', label: 'Rose', swatch: '#FFE4E6' },
  { value: 'violet', label: 'Purple', swatch: '#EDE9FE' },
];

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function AdminModal({
  isOpen,
  onClose,
  token,
  adminUsername,
  firebaseUser,
  currentConfig,
  stats,
  onLoginSuccess,
  onConfigUpdated,
  onLogout,
}: AdminModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('publish');
  const [draft, setDraft] = useState<AppProgramConfig>(currentConfig);
  const [changeDescription, setChangeDescription] = useState('');
  const [interpreting, setInterpreting] = useState(false);
  const [cloudConnecting, setCloudConnecting] = useState(false);
  const [promptsText, setPromptsText] = useState(currentConfig.samplePrompts.join('\n'));
  const [wordsText, setWordsText] = useState(currentConfig.sampleWords.join(', '));
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const wasOpenRef = useRef(false);
  const lastInterpretedDescRef = useRef('');

  const cloudConnected = isAuthorizedAdminUser(firebaseUser);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setDraft(currentConfig);
      setPromptsText(currentConfig.samplePrompts.join('\n'));
      setWordsText(currentConfig.sampleWords.join(', '));
      setAuthError(null);
      setActionErr(null);
      setActionMsg(null);
      lastInterpretedDescRef.current = '';
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, currentConfig]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setAuthError('Please enter both username and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json()) as {
        token?: string;
        username?: string;
        config?: AppProgramConfig;
        stats?: AdminServerStats;
        error?: string;
      };
      if (!res.ok || !data.token || !data.config || !data.stats) {
        throw new Error(data.error || 'Invalid credentials.');
      }
      setPassword('');
      onLoginSuccess({
        token: data.token,
        username: data.username || username.trim(),
        config: data.config,
        stats: data.stats,
      });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const buildPayloadFromDraft = (): AppProgramConfig => {
    const parsedPrompts = promptsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const parsedWords = wordsText
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter(Boolean);

    return {
      ...draft,
      samplePrompts: parsedPrompts.length > 0 ? parsedPrompts : DEFAULT_APP_CONFIG.samplePrompts,
      sampleWords: parsedWords.length > 0 ? parsedWords : DEFAULT_APP_CONFIG.sampleWords,
    };
  };

  const interpretDescriptionForPayload = async (
    desc: string,
    basePayload: AppProgramConfig,
  ): Promise<{ suggestedConfig: AppProgramConfig; changedFields: string[] }> => {
    if (!token) {
      throw new Error('Admin session expired. Please sign in again.');
    }
    const res = await fetch('/api/admin/interpret-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: desc,
        currentConfig: basePayload,
      }),
    });
    const data = (await res.json()) as {
      suggestedConfig?: AppProgramConfig;
      changedFields?: string[];
      error?: string;
    };
    if (res.status === 401) {
      onLogout();
      throw new Error('Admin session expired. Please sign in again.');
    }
    if (!res.ok || !data.suggestedConfig) {
      throw new Error(data.error || 'Could not apply description automatically.');
    }
    return {
      suggestedConfig: data.suggestedConfig,
      changedFields: Array.isArray(data.changedFields) ? data.changedFields : [],
    };
  };

  const handleInterpretDescription = async () => {
    if (!token || interpreting || saving) return;
    const desc = changeDescription.trim();
    if (!desc) {
      setActionErr('Please write what you want to change in the app first.');
      return;
    }

    setInterpreting(true);
    setActionErr(null);
    setActionMsg(null);

    try {
      const currentPayload = buildPayloadFromDraft();
      const { suggestedConfig, changedFields } = await interpretDescriptionForPayload(
        desc,
        currentPayload,
      );
      lastInterpretedDescRef.current = desc;
      setDraft(suggestedConfig);
      setPromptsText(suggestedConfig.samplePrompts.join('\n'));
      setWordsText(suggestedConfig.sampleWords.join(', '));
      setActionMsg(
        changedFields.length > 0
          ? `Applied: ${changedFields.join(', ')}. Now click "Publish Update" to send to all phones.`
          : 'Updated Update Notes. You can also adjust exact toggles, colors, or headings below before publishing.',
      );
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Failed to interpret changes.');
    } finally {
      setInterpreting(false);
    }
  };

  const handleConnectGoogle = async () => {
    if (cloudConnecting || saving) return;
    setCloudConnecting(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      const user = await signInAdminWithGoogle();
      setActionMsg(
        `Cloud Sync connected (${user.email}). Now click "Publish Update" to send changes to all students' phones.`,
      );
    } catch (err) {
      setActionErr(
        err instanceof Error ? err.message : 'Google Admin sign-in failed. Please try again.',
      );
    } finally {
      setCloudConnecting(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (cloudConnecting || saving) return;
    setCloudConnecting(true);
    try {
      await signOutFirebaseAdmin();
      setActionMsg('Disconnected Google Cloud Sync.');
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Failed to disconnect.');
    } finally {
      setCloudConnecting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!token || saving || interpreting) return;
    setSaving(true);
    setActionErr(null);
    setActionMsg(null);

    try {
      let payload = buildPayloadFromDraft();
      let appliedSummary: string[] = [];
      const pendingDesc = changeDescription.trim();

      if (pendingDesc && pendingDesc !== lastInterpretedDescRef.current) {
        const interpreted = await interpretDescriptionForPayload(pendingDesc, payload);
        payload = interpreted.suggestedConfig;
        appliedSummary = interpreted.changedFields;
        lastInterpretedDescRef.current = pendingDesc;
        setDraft(payload);
        setPromptsText(payload.samplePrompts.join('\n'));
        setWordsText(payload.sampleWords.join(', '));
      }

      if (!payload.updateNotes.trim() && pendingDesc) {
        payload.updateNotes = pendingDesc;
      }

      if (!isAuthorizedAdminUser(firebaseUser)) {
        await signInAdminWithGoogle();
      }

      const publishedCloudConfig = await publishAppSettingsToFirestore(
        payload,
        (currentConfig.configVersion || 1) + 1,
      );

      let latestStats: AdminServerStats | undefined;
      try {
        const res = await fetch('/api/admin/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ config: publishedCloudConfig, publishUpdate: false }),
        });
        if (res.ok) {
          const data = (await res.json()) as { stats?: AdminServerStats };
          latestStats = data.stats;
        }
      } catch {
        // Server cache will auto-sync from Firestore
      }

      setDraft(publishedCloudConfig);
      setPromptsText(publishedCloudConfig.samplePrompts.join('\n'));
      setWordsText(publishedCloudConfig.sampleWords.join(', '));
      setChangeDescription('');
      lastInterpretedDescRef.current = '';
      onConfigUpdated(publishedCloudConfig, latestStats);
      setActionMsg(
        appliedSummary.length > 0
          ? `Published v1.0.${publishedCloudConfig.configVersion} (${appliedSummary.join(', ')})! Students will get Update & Restart immediately.`
          : `Published v1.0.${publishedCloudConfig.configVersion} to Cloud! Students opening your app link will get the Update & Restart prompt immediately.`,
      );
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Publish failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    if (!token || saving) return;
    setSaving(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/cache/clear', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { stats?: AdminServerStats; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to clear cache.');
      onConfigUpdated(draft, data.stats);
      setActionMsg('Dictionary cache cleared.');
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Cache clear failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!token || saving) return;
    setSaving(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      if (!isAuthorizedAdminUser(firebaseUser)) {
        await signInAdminWithGoogle();
      }

      const resetPayload: AppProgramConfig = {
        ...DEFAULT_APP_CONFIG,
        configVersion: (currentConfig.configVersion || 1) + 1,
        updateNotes: 'Restored default app settings.',
        updatedAt: Date.now(),
      };

      const publishedCloudConfig = await publishAppSettingsToFirestore(
        resetPayload,
        resetPayload.configVersion,
      );

      let latestStats: AdminServerStats | undefined;
      try {
        const res = await fetch('/api/admin/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ config: publishedCloudConfig, publishUpdate: false }),
        });
        if (res.ok) {
          const data = (await res.json()) as { stats?: AdminServerStats };
          latestStats = data.stats;
        }
      } catch {
        // Server cache will auto-sync from Firestore
      }

      setDraft(publishedCloudConfig);
      setPromptsText(publishedCloudConfig.samplePrompts.join('\n'));
      setWordsText(publishedCloudConfig.sampleWords.join(', '));
      setChangeDescription('');
      onConfigUpdated(publishedCloudConfig, latestStats);
      setActionMsg(
        `Restored defaults and published v1.0.${publishedCloudConfig.configVersion} to Cloud.`,
      );
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (
    key: keyof Pick<
      AppProgramConfig,
      | 'enableTeacher'
      | 'enableLiveMode'
      | 'enableDictionary'
      | 'enableVoiceInput'
      | 'enableVoiceOutput'
      | 'enablePdfExport'
      | 'enableCamera'
      | 'maintenanceMode'
      | 'conciseAnswers'
    >,
  ) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
    setActionMsg(null);
  };

  const programSwitches: Array<{
    key: keyof Pick<
      AppProgramConfig,
      | 'enableTeacher'
      | 'enableLiveMode'
      | 'enableDictionary'
      | 'enableVoiceInput'
      | 'enableVoiceOutput'
      | 'enablePdfExport'
      | 'enableCamera'
    >;
    title: string;
    desc: string;
  }> = [
    {
      key: 'enableTeacher',
      title: 'AI Teacher Chat',
      desc: 'WBBSE Classes 5–10 streaming subject tutor',
    },
    {
      key: 'enableLiveMode',
      title: 'Live Voice & HD Camera Mode',
      desc: 'Real-time Bengali / English / Bilingual audio teacher',
    },
    {
      key: 'enableDictionary',
      title: 'Bengali Dictionary & Grammar',
      desc: '5-part pronunciation, Sandhi Vicched & examples lookup',
    },
    {
      key: 'enableVoiceInput',
      title: 'Voice Microphone Dictation',
      desc: 'High-accuracy Bengali + English speech transcription',
    },
    {
      key: 'enableVoiceOutput',
      title: 'AI Voice Playback (TTS)',
      desc: 'Spoken answers and word pronunciation audio',
    },
    {
      key: 'enablePdfExport',
      title: 'Study Notes PDF Export',
      desc: 'Download chat notes and dictionary sheets as PDF',
    },
    {
      key: 'enableCamera',
      title: 'Camera & Photo Attachments',
      desc: 'Capture or upload textbook pages and handwritten problems',
    },
  ];

  const currentVer = currentConfig.configVersion || 1;
  const nextVer = currentVer + 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={token ? 'Admin Control Panel' : 'Admin Login'}
    >
      {!token ? (
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-sky-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Admin Login Mode
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sign in to control app programs and publish updates
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin Login"
              className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Admin Username
              </label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full min-h-[44px] pl-3.5 pr-11 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div
                className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-60"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl h-[92vh] max-h-[94vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  Admin Control Console
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono tabular-nums">
                  {adminUsername || 'Amir123'} · Live v1.0.{currentVer} → Next v1.0.{nextVer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onLogout}
                className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Admin Panel"
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Server Stats Strip */}
          {stats && (
            <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Server Uptime</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {formatUptime(stats.uptimeSeconds)}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Total AI Requests</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {stats.totalAiRequests}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Live Sessions</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.activeLiveConnections}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Cached Words</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {stats.dictionaryCacheSize}
                </span>
              </div>
            </div>
          )}

          {/* Cloud Sync Authorization Strip */}
          <div
            className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
              cloudConnected
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {cloudConnected ? (
                <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <CloudOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span className="truncate">
                {cloudConnected
                  ? `Cloud Live Push Active (${firebaseUser?.email}) — Students on shared link get updates automatically.`
                  : `সব স্টুডেন্টের ফোনে আপডেট পাঠাতে Google (${ADMIN_EMAILS.join(' / ')}) কানেক্ট করুন।`}
              </span>
            </div>

            {cloudConnected ? (
              <button
                type="button"
                onClick={handleDisconnectGoogle}
                disabled={cloudConnecting || saving}
                className="min-h-[30px] px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60 shrink-0"
              >
                Switch Google Account
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={cloudConnecting || saving}
                className="min-h-[32px] px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 disabled:opacity-60 shrink-0"
              >
                {cloudConnecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5" />
                    Connect Google Sync
                  </>
                )}
              </button>
            )}
          </div>

          {/* Console Navigation Tabs */}
          <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('publish')}
              className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'publish'
                  ? 'border-[var(--app-accent)] dark:border-sky-400 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Publish Update
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('programs')}
              className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'programs'
                  ? 'border-[var(--app-accent)] dark:border-sky-400 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Programs &amp; Access
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'ai'
                  ? 'border-[var(--app-accent)] dark:border-sky-400 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              AI &amp; Defaults
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'content'
                  ? 'border-[var(--app-accent)] dark:border-sky-400 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              Prompts &amp; Cache
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'publish' && (
              <div className="space-y-6">
                {/* Describe What to Change in the App */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="space-y-1">
                    <label
                      htmlFor="cfg-describe-change"
                      className="block text-sm font-bold text-slate-900 dark:text-white"
                    >
                      Write What You Want to Change in the App (অ্যাপের ভেতর কী পরিবর্তন করবেন লিখুন)
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Write your changes in Bengali, Banglish, or English—then tap Apply to automatically update app settings, or edit fields directly below.
                    </p>
                  </div>

                  <textarea
                    id="cfg-describe-change"
                    rows={3}
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    placeholder="উদাহরণ: অ্যাপের নাম দাও Amir Academy, কালার সবুজ করো, লেখা বড় করো, ওয়েলকাম হেডিং লেখো মাধ্যমিক ২০২৬ প্রস্তুতি, এবং ইতিহাসের গুরুত্বপূর্ণ প্রশ্ন বাটন যোগ করো।"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Users who open your link will get an Update &amp; Restart prompt.
                    </span>
                    <button
                      type="button"
                      onClick={handleInterpretDescription}
                      disabled={interpreting || saving || !changeDescription.trim()}
                      className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                      {interpreting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" />
                          Apply Description to Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Update Prompt Shown to Users */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Update Notice Shown on Users&apos; Phones
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-update-title"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Update Dialog Title
                      </label>
                      <input
                        id="cfg-update-title"
                        type="text"
                        value={draft.updateTitle}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, updateTitle: e.target.value }))
                        }
                        placeholder="New App Update Available"
                        className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-update-notes"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        What Changed (Shown inside Update Popup)
                      </label>
                      <textarea
                        id="cfg-update-notes"
                        rows={3}
                        value={draft.updateNotes}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, updateNotes: e.target.value }))
                        }
                        placeholder="e.g., নতুন ইতিহাস ও ভূগোল প্রশ্ন যোগ করা হয়েছে এবং উত্তর আরও সহজ করা হয়েছে।"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Android APK Download Link (For Full Standalone Android App) */}
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <label
                        htmlFor="cfg-apk-url"
                        className="text-sm font-bold text-slate-900 dark:text-white inline-flex items-center gap-1.5"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Android APK Download Link (আসল Android অ্যাপ .apk লিংক)
                      </label>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Median / WebIntoApp / Appilix দিয়ে বানানো আসল <strong>Wbsec.apk</strong> ফাইল Google Drive বা GitHub-এ আপলোড করে তার <code>https://</code> লিংক এখানে বসিয়ে <strong>Publish</strong> করলে ছাত্ররা <strong>Get App</strong> বাটনে ক্লিক করে সরাসরি আসল Android অ্যাপ ডাউনলোড করতে পারবে। খালি রাখলে সাধারণ ১-ক্লিক Web App ইনস্টল চলবে।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="cfg-apk-url"
                      type="url"
                      value={draft.apkDownloadUrl || ''}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, apkDownloadUrl: e.target.value }))
                      }
                      placeholder="https://drive.google.com/... বা https://.../Wbsec.apk"
                      className="flex-1 min-w-0 min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                    />
                    {draft.apkDownloadUrl?.trim() && (
                      <button
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, apkDownloadUrl: '' }))}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {draft.apkDownloadUrl?.trim() &&
                    !/^https:\/\/\S+/i.test(draft.apkDownloadUrl.trim()) && (
                      <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        লিংকটি অবশ্যই <code>https://</code> দিয়ে শুরু হতে হবে।
                      </p>
                    )}
                </div>

                {/* App Identity, Theme & Copy */}
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    App Branding, Colors &amp; Text
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-app-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        App Name
                      </label>
                      <input
                        id="cfg-app-name"
                        type="text"
                        value={draft.appName}
                        onChange={(e) => setDraft((prev) => ({ ...prev, appName: e.target.value }))}
                        className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-attribution"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Header Attribution
                      </label>
                      <input
                        id="cfg-attribution"
                        type="text"
                        value={draft.attributionText}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, attributionText: e.target.value }))
                        }
                        className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-welcome-title"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Home Welcome Heading (blank = automatic)
                      </label>
                      <input
                        id="cfg-welcome-title"
                        type="text"
                        value={draft.welcomeTitle}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, welcomeTitle: e.target.value }))
                        }
                        placeholder="Ask your Class 8 AI Teacher"
                        className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="cfg-banner"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Top Announcement Banner
                      </label>
                      <input
                        id="cfg-banner"
                        type="text"
                        value={draft.announcementBanner}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, announcementBanner: e.target.value }))
                        }
                        placeholder="Leave blank to hide"
                        className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-welcome-subtitle"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Home Welcome Description
                    </label>
                    <textarea
                      id="cfg-welcome-subtitle"
                      rows={2}
                      value={draft.welcomeSubtitle}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, welcomeSubtitle: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      App Background Color
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {PAGE_BACKGROUND_OPTIONS.map((opt) => {
                        const selected = (draft.pageBackground || 'default') === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setDraft((prev) => ({ ...prev, pageBackground: opt.value }))
                            }
                            aria-pressed={selected}
                            className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                              selected
                                ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-sm border border-slate-300 dark:border-slate-600 shrink-0"
                              style={{ backgroundColor: opt.swatch }}
                              aria-hidden="true"
                            />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Button Accent Color
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {ACCENT_OPTIONS.map((opt) => {
                          const selected = draft.accentColor === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setDraft((prev) => ({ ...prev, accentColor: opt.value }))
                              }
                              aria-pressed={selected}
                              className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                                selected
                                  ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: opt.swatch }}
                                aria-hidden="true"
                              />
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        App Text Size
                      </span>
                      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {(['normal', 'large'] as AppFontScale[]).map((scale) => (
                          <button
                            key={scale}
                            type="button"
                            onClick={() =>
                              setDraft((prev) => ({ ...prev, fontScale: scale }))
                            }
                            className={`min-h-[34px] px-4 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              draft.fontScale === scale
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            {scale === 'normal' ? 'Normal' : 'Large (Readable)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-5">
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {programSwitches.map((item) => {
                    const enabled = draft[item.key];
                    return (
                      <div
                        key={item.key}
                        className="px-4 py-3.5 flex items-center justify-between gap-4 bg-white dark:bg-slate-900"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => toggleField(item.key)}
                          className={`min-h-[34px] min-w-[68px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            enabled
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                          }`}
                        >
                          {enabled ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Maintenance Mode Control */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pause student access across all AI endpoints while updating the app
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.maintenanceMode}
                      onClick={() => toggleField('maintenanceMode')}
                      className={`min-h-[34px] min-w-[68px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        draft.maintenanceMode
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {draft.maintenanceMode ? 'On' : 'Off'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="maintenance-msg"
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      Maintenance Notice Message
                    </label>
                    <input
                      id="maintenance-msg"
                      type="text"
                      value={draft.maintenanceMessage}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, maintenanceMessage: e.target.value }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-default-class"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Default Class
                    </label>
                    <select
                      id="cfg-default-class"
                      value={draft.defaultClass}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          defaultClass: e.target.value as ClassLevel,
                        }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    >
                      {CLASS_LEVELS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-default-voice"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Default Voice
                    </label>
                    <select
                      id="cfg-default-voice"
                      value={draft.defaultVoice}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          defaultVoice: e.target.value as VoicePersona,
                        }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    >
                      {VOICE_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-default-live-role"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Default Live Language
                    </label>
                    <select
                      id="cfg-default-live-role"
                      value={draft.defaultLiveRole}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          defaultLiveRole: e.target.value as LiveRole,
                        }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    >
                      {LIVE_ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <label htmlFor="cfg-temp">AI Temperature</label>
                      <span className="font-mono tabular-nums">{draft.temperature.toFixed(2)}</span>
                    </div>
                    <input
                      id="cfg-temp"
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={draft.temperature}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          temperature: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-[var(--app-accent)]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:pl-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Concise Answers
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Short, fast steps by default
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.conciseAnswers}
                      onClick={() => toggleField('conciseAnswers')}
                      className={`min-h-[34px] min-w-[64px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        draft.conciseAnswers
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {draft.conciseAnswers ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cfg-teacher-prompt"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Custom AI Teacher System Instructions (optional)
                  </label>
                  <textarea
                    id="cfg-teacher-prompt"
                    rows={3}
                    value={draft.customTeacherPrompt}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, customTeacherPrompt: e.target.value }))
                    }
                    placeholder="e.g., Always mention WBBSE board exam marks tips at the end."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cfg-live-prompt"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Custom Live Teacher Instructions (optional)
                  </label>
                  <textarea
                    id="cfg-live-prompt"
                    rows={2}
                    value={draft.customLivePrompt}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, customLivePrompt: e.target.value }))
                    }
                    placeholder="e.g., Ask a quick follow-up quiz question after explaining."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-dict-title"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Dictionary Heading
                    </label>
                    <input
                      id="cfg-dict-title"
                      type="text"
                      value={draft.dictionaryTitle}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, dictionaryTitle: e.target.value }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cfg-dict-subtitle"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Dictionary Subtitle
                    </label>
                    <input
                      id="cfg-dict-subtitle"
                      type="text"
                      value={draft.dictionarySubtitle}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, dictionarySubtitle: e.target.value }))
                      }
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cfg-prompts"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    AI Teacher Quick Question Buttons (one per line, up to 6)
                  </label>
                  <textarea
                    id="cfg-prompts"
                    rows={4}
                    value={promptsText}
                    onChange={(e) => setPromptsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cfg-words"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Dictionary Sample Words (comma-separated, up to 10)
                  </label>
                  <textarea
                    id="cfg-words"
                    rows={3}
                    value={wordsText}
                    onChange={(e) => setWordsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:border-[var(--app-accent)] focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    disabled={saving}
                    className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Dictionary Cache
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    disabled={saving}
                    className="min-h-[40px] px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All &amp; Publish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Publish Bar */}
          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1 text-xs">
              {actionErr && (
                <p className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionErr}</span>
                </p>
              )}
              {actionMsg && !actionErr && (
                <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{actionMsg}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving || interpreting}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-60 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing v1.0.{nextVer}...
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    Publish Update (v1.0.{nextVer})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
