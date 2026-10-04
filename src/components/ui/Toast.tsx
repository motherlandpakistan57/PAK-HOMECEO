import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  className = '',
}) => {
  const typeConfigs = {
    success: {
      bg: 'bg-[#01411C] text-white border-[#002C12]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#86EFAC] shrink-0" />,
    },
    error: {
      bg: 'bg-rose-900 text-white border-rose-950',
      icon: <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />,
    },
    info: {
      bg: 'bg-[#1A2E22] text-white border-stone-800',
      icon: <Info className="w-4 h-4 text-emerald-300 shrink-0" />,
    },
  };

  const config = typeConfigs[type];

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${config.bg} text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 ${className}`}
    >
      {config.icon}
      <span className="font-sans leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
