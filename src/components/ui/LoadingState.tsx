import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading workspace data...',
  submessage = 'Synchronizing with distributed production ledger',
  className = '',
}) => {
  return (
    <div className={`p-12 flex flex-col items-center justify-center text-center font-sans ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#01411C] mb-4 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h3 className="text-sm font-bold text-[#1A2E22]">{message}</h3>
      {submessage && (
        <p className="text-xs text-[#718579] mt-1 max-w-sm">{submessage}</p>
      )}
    </div>
  );
};
