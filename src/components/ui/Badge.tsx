import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'executiveGreen' | 'lightGreen' | 'neutral' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-sans font-bold uppercase tracking-wider rounded-md transition-colors';

  const variants = {
    primary: 'bg-[#01411C] text-white',
    executiveGreen: 'bg-[#01411C] text-white border border-[#002C12]',
    lightGreen: 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]',
    neutral: 'bg-stone-100 text-[#4A5D52] border border-stone-200',
    warning: 'bg-amber-100/90 text-amber-900 border border-amber-300',
    danger: 'bg-rose-100 text-rose-900 border border-rose-300',
    info: 'bg-blue-100 text-blue-900 border border-blue-300',
    outline: 'bg-transparent text-[#1A2E22] border border-stone-300',
  };

  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2 py-0.5 gap-1.5',
  };

  const dotColors = {
    primary: 'bg-white',
    executiveGreen: 'bg-[#86EFAC]',
    lightGreen: 'bg-[#01411C]',
    neutral: 'bg-[#718579]',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-blue-600',
    outline: 'bg-[#1A2E22]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
