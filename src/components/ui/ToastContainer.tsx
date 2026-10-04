import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-white text-stone-900 border-[#BBF7D0]'
                : isError
                ? 'bg-white text-stone-900 border-rose-300'
                : isWarning
                ? 'bg-white text-stone-900 border-amber-300'
                : 'bg-white text-stone-900 border-stone-300'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-6 h-6 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#01411C] border border-[#BBF7D0]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {isError && (
                <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {isWarning && (
                <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              {isInfo && (
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-[#1A2E22] font-sans leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-[#4A5D52] font-sans mt-0.5 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
              className="shrink-0 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
