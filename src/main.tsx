import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('wbsec:sw-update-ready'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('wbsec:offline-ready'));
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    const triggerCheck = () => {
      if (navigator.onLine) {
        registration.update().catch(() => {});
      }
    };
    // Check immediately when page loads on existing link
    triggerCheck();
    window.setInterval(triggerCheck, 30 * 1000);
    window.addEventListener('online', triggerCheck);
    window.addEventListener('focus', triggerCheck);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        triggerCheck();
      }
    });
  },
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
