import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface SuccessStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl flex flex-col items-center justify-center text-center font-sans ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white border border-[#BBF7D0] flex items-center justify-center text-[#01411C] mb-3.5 shadow-2xs">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-[#01411C]">{title}</h3>
      <p className="text-xs text-[#1A2E22] mt-1 max-w-md leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
