import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/welcome';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#01411C] flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#01411C] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                PAK-HOMECEO Platform Guard
              </span>
              <h2 className="text-xl font-extrabold text-[#1A2E22]">
                Something went wrong
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                The platform encountered an unexpected issue. Don't worry—your order data and enterprise records are safe.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-[#01411C] hover:bg-[#025927] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload & Return to Welcome</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
