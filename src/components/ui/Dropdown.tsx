import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  icon?: React.ReactNode;
  variant?: 'outline' | 'executiveGreen' | 'ghost';
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  icon,
  variant = 'outline',
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonStyles = {
    outline: 'bg-white border border-stone-200 text-[#1A2E22] hover:bg-stone-50',
    executiveGreen: 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#01411C] hover:bg-[#DCFCE7]',
    ghost: 'text-[#4A5D52] hover:bg-stone-100 hover:text-[#1A2E22]',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${buttonStyles[variant]}`}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 w-56 rounded-xl bg-white border border-stone-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-start gap-2.5 transition-colors cursor-pointer ${
                item.danger
                  ? 'text-rose-700 hover:bg-rose-50'
                  : 'text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C]'
              }`}
            >
              {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                <span className="block font-semibold">{item.label}</span>
                {item.description && (
                  <span className="block text-[11px] text-[#718579] truncate">{item.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
