import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeTitleMap: Record<string, string> = {
  welcome: 'Welcome',
  'how-it-works': 'Platform Story',
  login: 'Authentication',
  dashboard: 'Dashboard',
  'skill-partner': 'Skill Partner Hub',
  'business-builder': 'Business Builder Center',
  'community-connector': 'Connector Field Operations',
  citizen: 'Citizen Marketplace',
  patron: 'Citizen Marketplace',
  products: 'Products Catalog',
  orders: 'Orders Lifecycle',
  batches: 'Production Batches',
  payments: 'Financial Ledger & Payouts',
  impact: 'Social Impact Metrics',
  messages: 'Operational Communications',
  settings: 'Enterprise Settings',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#718579] font-sans">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-[#4A5D52] hover:text-[#01411C] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const title = routeTitleMap[value] || (value.startsWith('ord-') || value.startsWith('prod-') ? `#${value}` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            {isLast ? (
              <span className="font-bold text-[#1A2E22] truncate max-w-[150px] sm:max-w-none">
                {title}
              </span>
            ) : (
              <Link
                to={to}
                className="text-[#4A5D52] hover:text-[#01411C] transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
