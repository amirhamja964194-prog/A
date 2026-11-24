import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __wbsecDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
    WbsecNative?: {
      isNativeApp?: () => boolean;
      getAppVersion?: () => string;
      reloadApp?: () => void;
      shareText?: (title: string, text: string) => void;
      saveBase64File?: (base64Data: string, filename: string) => boolean;
    };
  }
}

function checkIsNativeApk(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.WbsecNative?.isNativeApp?.()) return true;
  } catch {
    // Ignore bridge error
  }
  const ua = window.navigator.userAgent || '';
  return ua.includes('WbsecNativeApp');
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    checkIsNativeApk() ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

function checkIsInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__wbsecDeferredInstallPrompt) {
      return window.__wbsecDeferredInstallPrompt;
    }
    return null;
  });
  const [isNativeApk, setIsNativeApk] = useState<boolean>(() => checkIsNativeApk());
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandalone());
  const [isIOS, setIsIOS] = useState(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(() => checkIsInIframe());
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsNativeApk(checkIsNativeApk());
    setIsInstalled(checkIsStandalone());
    setIsInIframe(checkIsInIframe());

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Pick up any prompt captured before React mounted
    if (window.__wbsecDeferredInstallPrompt) {
      setDeferredPrompt(window.__wbsecDeferredInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__wbsecDeferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptReady = () => {
      if (window.__wbsecDeferredInstallPrompt) {
        setDeferredPrompt(window.__wbsecDeferredInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      window.__wbsecDeferredInstallPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstalling(false);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('wbsec:installprompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('wbsec:appinstalled', handleAppInstalled);
    mediaQuery.addEventListener?.('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('wbsec:installprompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('wbsec:appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const promptEvent = deferredPrompt || window.__wbsecDeferredInstallPrompt || null;
    if (!promptEvent) return 'unavailable';

    setIsInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      // A BeforeInstallPromptEvent can only be used once
      window.__wbsecDeferredInstallPrompt = null;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setIsInstalled(true);
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      window.__wbsecDeferredInstallPrompt = null;
      setDeferredPrompt(null);
      return 'unavailable';
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isNativeApk,
    isIOS,
    isInIframe,
    isInstalling,
    install,
  };
}
