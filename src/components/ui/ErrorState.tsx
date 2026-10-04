import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'An unexpected error occurred while fetching enterprise records. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-10 bg-white border border-rose-200 rounded-2xl flex flex-col items-center justify-center text-center font-sans ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-3.5 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-[#1A2E22]">{title}</h3>
      <p className="text-xs text-[#4A5D52] mt-1 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onRetry}
          >
            Retry Action
          </Button>
        </div>
      )}
    </div>
  );
};
