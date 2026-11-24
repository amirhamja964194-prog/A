import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Share2,
  Check,
  Copy,
  X,
  WifiOff,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const DIRECT_APP_URL =
  'https://ais-pre-gnsfryy7ffvuw7nefvpvq7-452431280303.asia-east1.run.app';

function sanitizeHttpsUrl(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

interface ApkMeta {
  available: boolean;
  filename?: string;
  packageName?: string;
  versionName?: string;
  sizeMB?: number;
  downloadUrl?: string;
}

interface PWAInstallButtonProps {
  apkDownloadUrl?: string;
  variant?: 'header' | 'bottom-nav';
}

export function PWAInstallButton({
  apkDownloadUrl,
  variant = 'header',
}: PWAInstallButtonProps = {}) {
  const { isNativeApk, isIOS, isInIframe } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apkMeta, setApkMeta] = useState<ApkMeta>({
    available: true,
    filename: 'Wbsec.apk',
    packageName: 'com.wbsec.aiteacher',
    versionName: '1.6.0',
    sizeMB: 14.7,
    downloadUrl: '/download/Wbsec.apk',
  });
  const [downloadStarted, setDownloadStarted] = useState(false);

  const customAdminApkUrl = useMemo(() => sanitizeHttpsUrl(apkDownloadUrl), [apkDownloadUrl]);

  const appOpenUrl =
    typeof window !== 'undefined' &&
    window.location.origin.startsWith('https://') &&
    !isInIframe
      ? window.location.origin
      : DIRECT_APP_URL;

  const builtInApkHref = isInIframe
    ? `${DIRECT_APP_URL}/download/Wbsec.apk`
    : '/download/Wbsec.apk';

  const finalApkHref = customAdminApkUrl || builtInApkHref;

  useEffect(() => {
    if (!showGuide || customAdminApkUrl) return;
    let active = true;
    fetch('/api/apk-info', { cache: 'no-store' })
      .then((res) => (res.ok ? (res.json() as Promise<ApkMeta>) : null))
      .then((data) => {
        if (active && data?.available) {
          setApkMeta(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [showGuide, customAdminApkUrl]);

  const handleShareOrCopy = async () => {
    if (isNativeApk && window.WbsecNative?.shareText) {
      window.WbsecNative.shareText(
        'Wbsec — AI Teacher Android App',
        `Wbsec AI Teacher (WBBSE Class 5–10) সম্পূর্ণ নিজস্ব Android অ্যাপ ডাউনলোড করো: ${DIRECT_APP_URL}/download/Wbsec.apk`,
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(appOpenUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const input = document.createElement('input');
        input.value = appOpenUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard unavailable
      }
    }
  };

  if (isNativeApk) {
    if (variant === 'bottom-nav') {
      return (
        <button
          type="button"
          onClick={() => void handleShareOrCopy()}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 active:scale-95 transition-transform"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => void handleShareOrCopy()}
        className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </>
        )}
      </button>
    );
  }

  return (
    <>
      {variant === 'bottom-nav' ? (
        <button
          type="button"
          onClick={() => {
            setDownloadStarted(false);
            setShowGuide(true);
          }}
          aria-label="Install Wbsec Android App"
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 active:scale-95 transition-transform"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Install</span>
        </button>
      ) : (
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              setDownloadStarted(false);
              setShowGuide(true);
            }}
            aria-label="Install Wbsec Android App"
            className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white hover:brightness-110 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Install</span>
          </button>
        </div>
      )}

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 dark:bg-slate-950/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Download Wbsec Android APK"
          onClick={() => setShowGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0d1124] border border-slate-200 dark:border-white/15 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header with App Icon */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="Wbsec App Icon"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-2xl shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Wbsec Android App (.apk)
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                    {apkMeta.sizeMB ? `${apkMeta.sizeMB} MB` : '15 MB'} · v{apkMeta.versionName || '1.6.0'} · Android 15 Ready
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close download dialog"
                className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Native APK Download Card (Android & Desktop) */}
            {!isIOS ? (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    কোনো Google/Chrome বার বা Site settings থাকবে না
                  </p>
                  <p className="text-xs text-emerald-950/90 dark:text-emerald-100/90 leading-relaxed">
                    এটি <strong>~15 MB</strong>-এর সম্পূর্ণ স্বাধীন <strong>Android APK</strong> (Facebook/YouTube-এর মতো নিজস্ব অ্যাপ · Package: <code className="font-mono text-[11px]">com.wbsec.aiteacher</code>)। সরাসরি ডাউনলোড করে ইনস্টল করো।
                  </p>
                </div>

                <a
                  href={finalApkHref}
                  download="Wbsec.apk"
                  target={isInIframe || Boolean(customAdminApkUrl) ? '_blank' : undefined}
                  rel={isInIframe || Boolean(customAdminApkUrl) ? 'noopener noreferrer' : undefined}
                  onClick={() => setDownloadStarted(true)}
                  className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>
                    Wbsec.apk ডাউনলোড করো ({apkMeta.sizeMB ? `${apkMeta.sizeMB} MB` : '15 MB'})
                  </span>
                </a>

                {downloadStarted && (
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center">
                    ডাউনলোড শুরু হয়েছে — নোটিফিকেশন বার বা Downloads ফোল্ডার থেকে Wbsec.apk ট্যাপ করে Install করুন!
                  </p>
                )}

                <ol className="text-xs text-slate-700 dark:text-slate-200 space-y-1.5 list-decimal pl-5 leading-relaxed pt-1 border-t border-emerald-200/80 dark:border-emerald-800/50">
                  <li>
                    উপরের <strong>Wbsec.apk ডাউনলোড করো</strong> বাটনে চাপ দাও (~15 MB ফাইল ডাউনলোড হবে)।
                  </li>
                  <li>
                    ডাউনলোড শেষে ফাইলটিতে ট্যাপ করে <strong>Install</strong> চাপো (Play Store-এর বাইরের অ্যাপ হলে প্রথমবার <strong>Install unknown apps → Allow</strong> বা Play Protect-এ <strong>Install anyway</strong> দেখালে ট্যাপ করো)।
                  </li>
                  <li>
                    নতুন Android 15 নিরাপত্তা মানদণ্ডে (API 35) তৈরি—আগের সংস্করণ থাকলে সেটি Update/Install হয়ে যাবে।
                  </li>
                </ol>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 space-y-2.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 shrink-0" />
                  iPhone / iPad-এ অ্যাপ ইনস্টল করার নিয়ম:
                </p>
                <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal pl-5 leading-relaxed">
                  <li>
                    লিংকটি <strong>Safari</strong>-তে খুলো এবং নিচের <strong>Share (□↑)</strong> বাটনে চাপো।
                  </li>
                  <li>
                    <strong>Add to Home Screen</strong> সিলেক্ট করে <strong>Add</strong> চাপো।
                  </li>
                </ol>
              </div>
            )}

            {/* Direct APK Download Link Copy Bar for WhatsApp Sharing to Students */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                ছাত্রদের WhatsApp-এ সরাসরি APK ডাউনলোড লিংক পাঠাও
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-3 py-2">
                <span className="text-xs text-slate-800 dark:text-slate-200 truncate flex-1 font-mono">
                  {customAdminApkUrl || `${DIRECT_APP_URL}/download/Wbsec.apk`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const link = customAdminApkUrl || `${DIRECT_APP_URL}/download/Wbsec.apk`;
                    navigator.clipboard?.writeText(link).then(
                      () => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      },
                      () => void handleShareOrCopy(),
                    );
                  }}
                  className="min-h-[34px] px-3 py-1 rounded-lg bg-[var(--app-accent)] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[var(--app-accent-hover)] transition-colors whitespace-nowrap shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full min-h-[42px] rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-16 lg:bottom-3 left-3 z-40 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/95 border border-amber-300 dark:border-amber-800 px-3 py-1.5 text-xs font-medium text-amber-950 dark:text-amber-200 shadow-md"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>অফলাইন মোড — রিচার্জ ছাড়াই পড়াশোনা চালু আছে</span>
    </div>
  );
}
