import React from 'react';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-[#4A5D52] hover:text-[#1A2E22] hover:bg-stone-200/60'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={`ml-1.5 text-[10px] font-mono tabular-nums ${isSelected ? 'text-emerald-100' : 'text-[#718579]'}`}>
                ({opt.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
