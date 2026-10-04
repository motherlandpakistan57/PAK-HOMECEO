import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'chips' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  className = '',
  variant = 'chips',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-stone-200 overflow-x-auto ${className}`}>
        {items.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors relative whitespace-nowrap ${
                isActive
                  ? 'text-[#01411C] font-bold border-b-2 border-[#01411C]'
                  : 'text-[#4A5D52] hover:text-[#1A2E22]'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#01411C] text-white' : 'bg-stone-100 text-[#4A5D52]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl ${className}`}>
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-[#1A2E22] hover:bg-[#DCFCE7] hover:text-[#01411C]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-[#01411C]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
