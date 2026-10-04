import React from 'react';
import { Loader2 } from 'lucide-react';
import { tokens } from '../../theme/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'executiveGreen' | 'lightGreen' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'terracotta';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#01411C] text-white hover:bg-[#035224] active:bg-[#002C12] focus-visible:outline-[#01411C] shadow-sm',
      executiveGreen:
        'bg-[#01411C] text-white hover:bg-[#035224] active:bg-[#002C12] focus-visible:outline-[#01411C] shadow-sm',
      lightGreen:
        'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0] hover:bg-[#DCFCE7] active:bg-[#BBF7D0] focus-visible:outline-[#01411C]',
      secondary:
        'bg-[#1A2E22] text-white hover:bg-[#112318] active:bg-[#08120C] focus-visible:outline-[#1A2E22] shadow-sm',
      terracotta:
        'bg-[#C85A32] text-white hover:bg-[#B44C27] active:bg-[#9C3E1C] focus-visible:outline-[#C85A32] shadow-sm',
      outline:
        'border border-stone-300 bg-white text-[#1A2E22] hover:bg-stone-50 active:bg-stone-100 focus-visible:outline-stone-400 shadow-2xs',
      ghost:
        'text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] active:bg-[#DCFCE7] focus-visible:outline-stone-300',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 focus-visible:outline-rose-700 shadow-sm',
    };

    const sizes = {
      sm: `${tokens.buttonSizes.sm} min-h-[32px]`,
      md: `${tokens.buttonSizes.md} min-h-[40px]`,
      lg: `${tokens.buttonSizes.lg} min-h-[48px]`,
    };

    const disabledStyles =
      disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0 mr-1.5">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 ml-1.5">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
