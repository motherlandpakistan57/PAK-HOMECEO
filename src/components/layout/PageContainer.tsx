import React from 'react';
import { PageHeader } from '../ui/PageHeader';

interface PageContainerProps {
  kicker?: string;
  title?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  roleBadge?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  kicker,
  title,
  description,
  primaryAction,
  secondaryActions,
  roleBadge,
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans animate-in fade-in duration-150 ${className}`}>
      {title && (
        <div className="mb-6 sm:mb-8">
          <PageHeader
            kicker={kicker}
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryActions={secondaryActions}
            roleBadge={roleBadge}
          />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
