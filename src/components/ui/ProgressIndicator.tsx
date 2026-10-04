import React from 'react';

export interface ProgressIndicatorProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  variant?: 'executiveGreen' | 'amber' | 'terracotta';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  label,
  showPercent = true,
  variant = 'executiveGreen',
  size = 'md',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const barColors = {
    executiveGreen: 'bg-[#01411C]',
    amber: 'bg-amber-600',
    terracotta: 'bg-[#C85A32]',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
          {label && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D52]">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="font-mono font-bold tabular-nums text-[#1A2E22]">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-stone-200/80 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${barColors[variant]} h-full transition-all duration-300 rounded-full`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
