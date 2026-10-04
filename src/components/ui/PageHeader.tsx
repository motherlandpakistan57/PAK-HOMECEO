import React from 'react';

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  roleBadge?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  description,
  primaryAction,
  secondaryActions,
  roleBadge,
}) => {
  return (
    <div className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-stone-200/90 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {kicker && (
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              {kicker}
            </span>
          )}
          {roleBadge && (
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#4A5D52] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {roleBadge}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-[#1A2E22] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-[#4A5D52] mt-1.5 leading-relaxed font-normal">
            {description}
          </p>
        )}
      </div>

      {(primaryAction || secondaryActions) && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {secondaryActions}
          {primaryAction}
        </div>
      )}
    </div>
  );
};
