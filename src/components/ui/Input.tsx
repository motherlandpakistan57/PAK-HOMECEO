import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#4A5D52] mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#718579] pointer-events-none shrink-0">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={`w-full py-2 text-xs bg-white border rounded-xl text-[#1A2E22] placeholder-[#718579] transition-all focus:outline-none focus:ring-1 ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500'
              : 'border-stone-300 focus:border-[#01411C] focus:ring-[#01411C]'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 text-[#718579] shrink-0">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-[11px] text-rose-600 font-medium font-sans">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#718579] font-sans">{helperText}</p>
      ) : null}
    </div>
  );
};
