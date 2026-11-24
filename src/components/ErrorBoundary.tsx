import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const rawMsg = error instanceof Error ? error.message : String(error);
    return {
      hasError: true,
      message: rawMsg,
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    let displayDetail = this.state.message;
    try {
      const parsed = JSON.parse(this.state.message) as { error?: string; path?: string };
      if (parsed?.error) {
        displayDetail = parsed.path ? `${parsed.error} (${parsed.path})` : parsed.error;
      }
    } catch {
      // Plain error message
    }

    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F5F7FA] dark:bg-slate-950 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6 text-center space-y-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {displayDetail || 'An unexpected error occurred while loading the app.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload App
          </button>
        </div>
      </div>
    );
  }
}
