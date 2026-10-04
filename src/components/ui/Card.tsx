import React from 'react';
import { tokens } from '../../theme/tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'highlight' | 'interactive' | 'executiveGreen' | 'lightGreen';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: tokens.cardStyles.standard,
    subtle: 'bg-[#FAF9F6] border border-stone-200/80 shadow-2xs',
    highlight: 'bg-white border-2 border-[#01411C]/30 shadow-sm',
    interactive: tokens.cardStyles.interactive,
    executiveGreen: tokens.cardStyles.executiveGreen,
    lightGreen: tokens.cardStyles.lightGreenAccent,
  };

  return (
    <div
      className={`overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 pb-3 border-b border-stone-100 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-sans font-bold text-[#1A2E22] tracking-tight leading-snug ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 pt-3 border-t border-stone-100 bg-[#F0FDF4]/30 flex items-center justify-between gap-2 ${className}`} {...props}>
    {children}
  </div>
);
