import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, AlertCircle, HelpCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

export const GlobalConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useApp();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmDialog) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          confirmDialog.onCancel?.();
          closeConfirmDialog();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [confirmDialog, closeConfirmDialog]);

  if (!confirmDialog) return null;

  const {
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    onConfirm,
    onCancel,
  } = confirmDialog;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      closeConfirmDialog();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    closeConfirmDialog();
  };

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';
  const isSuccess = variant === 'success';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {isDanger && (
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {isWarning && (
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              {isSuccess && (
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#01411C]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {!isDanger && !isWarning && !isSuccess && (
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#01411C]">
                  <HelpCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  id="confirm-dialog-title"
                  className="text-base font-bold text-[#1A2E22] tracking-tight font-sans"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label="Close"
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-[#4A5D52] leading-relaxed font-sans">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-[#4A5D52] hover:text-[#1A2E22] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <Button
              ref={confirmBtnRef}
              onClick={handleConfirm}
              variant={isDanger ? 'danger' : isWarning ? 'secondary' : 'executiveGreen'}
              size="sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
