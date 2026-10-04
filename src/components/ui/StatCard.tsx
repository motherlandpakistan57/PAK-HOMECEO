import React from 'react';
import { tokens } from '../../theme/tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
  variant?: 'default' | 'executiveGreen' | 'lightGreen' | 'terracotta' | 'forest' | 'ochre' | 'indigo';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  badge,
  variant = 'default',
  icon,
}) => {
  const borderStyles = {
    default: 'border-stone-200/90 bg-white text-[#1A2E22]',
    executiveGreen: 'border-[#002C12] bg-[#01411C] text-white shadow-[0_4px_20px_rgba(1,65,28,0.15)]',
    lightGreen: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#01411C]',
    terracotta: 'border-[#C85A32]/30 bg-[#C85A32]/5 text-[#1A2E22]',
    forest: 'border-emerald-200 bg-emerald-50/50 text-[#1A2E22]',
    ochre: 'border-amber-200 bg-amber-50/50 text-[#1A2E22]',
    indigo: 'border-blue-200 bg-blue-50/50 text-[#1A2E22]',
  };

  const valueColors = {
    default: 'text-[#1A2E22]',
    executiveGreen: 'text-white',
    lightGreen: 'text-[#01411C]',
    terracotta: 'text-[#C85A32]',
    forest: 'text-emerald-800',
    ochre: 'text-amber-800',
    indigo: 'text-blue-900',
  };

  const labelColors = {
    default: 'text-[#718579]',
    executiveGreen: 'text-emerald-100/90',
    lightGreen: 'text-[#01411C]/80',
    terracotta: 'text-stone-500',
    forest: 'text-emerald-700',
    ochre: 'text-amber-700',
    indigo: 'text-blue-700',
  };

  const sublabelColors = {
    default: 'text-[#718579]',
    executiveGreen: 'text-emerald-100/80',
    lightGreen: 'text-[#1A2E22]/70',
    terracotta: 'text-stone-500',
    forest: 'text-emerald-700/80',
    ochre: 'text-amber-700/80',
    indigo: 'text-blue-700/80',
  };

  return (
    <div className={`border rounded-xl p-4 sm:p-5 shadow-xs transition-all duration-150 ${borderStyles[variant]}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`font-sans text-[11px] font-bold uppercase tracking-wider truncate ${labelColors[variant]}`}>
          {label}
        </span>
        {icon && (
          <span className={`shrink-0 ${variant === 'executiveGreen' ? 'text-emerald-200' : 'text-[#718579]'}`}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className={`font-mono text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${valueColors[variant]}`}>
          {value}
        </span>
        {badge && (
          <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-md ${
            variant === 'executiveGreen'
              ? 'bg-white/20 text-white'
              : 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {sublabel && (
        <p className={`font-sans text-[11px] mt-1.5 leading-snug ${sublabelColors[variant]}`}>
          {sublabel}
        </p>
      )}
    </div>
  );
};
