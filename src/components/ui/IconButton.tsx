import React from 'react';
import { Loader2 } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Accessible aria-label
  variant?: 'primary' | 'executiveGreen' | 'lightGreen' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-150 rounded-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 shrink-0';

  const variants = {
    primary: 'bg-[#01411C] text-white hover:bg-[#035224] focus-visible:outline-[#01411C] shadow-xs',
    executiveGreen: 'bg-[#01411C] text-white hover:bg-[#035224] focus-visible:outline-[#01411C] shadow-xs',
    lightGreen: 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0] hover:bg-[#DCFCE7] focus-visible:outline-[#01411C]',
    secondary: 'bg-[#1A2E22] text-white hover:bg-[#112318] focus-visible:outline-[#1A2E22] shadow-xs',
    outline: 'border border-stone-200 bg-white text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] hover:border-[#BBF7D0] shadow-2xs',
    ghost: 'text-[#4A5D52] hover:bg-[#F0FDF4] hover:text-[#01411C]',
    danger: 'text-rose-700 hover:bg-rose-50 hover:text-rose-800',
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs p-1.5',
    md: 'w-10 h-10 text-sm p-2',
    lg: 'w-12 h-12 text-base p-2.5',
  };

  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    </button>
  );
};
