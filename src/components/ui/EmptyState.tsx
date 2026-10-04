import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-stone-50/60 rounded-2xl border border-dashed border-stone-200">
      {icon && <div className="text-3xl text-stone-400 mb-3 flex justify-center">{icon}</div>}
      <h4 className="text-sm font-bold text-stone-900 font-serif">{title}</h4>
      <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};
