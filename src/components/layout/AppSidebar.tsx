import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Home,
  Briefcase,
  DollarSign,
  MessageSquare,
  HelpCircle,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  TrendingUp,
  MapPin,
  Settings,
  Sparkles,
  RefreshCw,
  Compass,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    demoMode,
    resetDemo,
    openConfirmDialog,
    notifications,
  } = useApp();

  const navigate = useNavigate();
  const unreadMessagesCount = notifications.filter((n) => !n.read && n.type === 'message').length;

  // Primary navigation tailored per Role specification
  const primaryNavByRole: Record<
    UserRole,
    { label: string; to: string; icon: React.ReactNode; badge?: string }[]
  > = {
    builder: [
      { label: 'Command Overview', to: '/business-builder?tab=overview', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Orders Control', to: '/business-builder?tab=orders', icon: <ShoppingBag className="w-4 h-4" /> },
      { label: 'Skill Partners (People)', to: '/business-builder?tab=people', icon: <Users className="w-4 h-4" /> },
      { label: 'Products Catalog', to: '/business-builder?tab=products', icon: <Package className="w-4 h-4" /> },
      { label: 'Production Batches', to: '/business-builder?tab=batches', icon: <Layers className="w-4 h-4" /> },
      { label: 'Business Insights', to: '/business-builder?tab=insights', icon: <TrendingUp className="w-4 h-4" /> },
    ],
    partner: [
      { label: 'Skill Partner Hub', to: '/skill-partner?tab=dashboard', icon: <Home className="w-4 h-4" /> },
      { label: 'My Work', to: '/skill-partner?tab=work', icon: <Briefcase className="w-4 h-4" /> },
      { label: 'My Earnings', to: '/skill-partner?tab=earnings', icon: <DollarSign className="w-4 h-4" /> },
      { label: 'My Messages', to: '/skill-partner?tab=messages', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'Help & Audio', to: '/skill-partner?tab=help', icon: <HelpCircle className="w-4 h-4" /> },
    ],
    connector: [
      { label: 'Field Operations', to: '/community-connector', icon: <MapPin className="w-4 h-4" /> },
      { label: 'Artisans & Visits', to: '/community-connector', icon: <Users className="w-4 h-4" /> },
      { label: 'Material Drops', to: '/batches', icon: <Layers className="w-4 h-4" /> },
    ],
    citizen: [
      { label: 'Citizen Marketplace', to: '/citizen', icon: <Compass className="w-4 h-4" /> },
      { label: 'Explore Products', to: '/products', icon: <Package className="w-4 h-4" /> },
      { label: 'My Orders', to: '/orders', icon: <ShoppingBag className="w-4 h-4" /> },
      { label: 'Artisan Stories & Impact', to: '/impact', icon: <TrendingUp className="w-4 h-4" /> },
    ],
    patron: [
      { label: 'Citizen Marketplace', to: '/citizen', icon: <Compass className="w-4 h-4" /> },
      { label: 'Explore Products', to: '/products', icon: <Package className="w-4 h-4" /> },
      { label: 'My Orders', to: '/orders', icon: <ShoppingBag className="w-4 h-4" /> },
      { label: 'Artisan Stories & Impact', to: '/impact', icon: <TrendingUp className="w-4 h-4" /> },
    ],
  };

  // Secondary navigation links available across appropriate scopes
  const secondaryNav = [
    {
      label: 'Communications',
      to: '/messages',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
    },
    {
      label: 'Platform Story',
      to: '/how-it-works',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const primaryItems = primaryNavByRole[currentRole] || primaryNavByRole.builder;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'builder') navigate('/business-builder');
    else if (role === 'partner') navigate('/skill-partner');
    else if (role === 'connector') navigate('/community-connector');
    else if (role === 'citizen' || role === 'patron') navigate('/citizen');
  };

  const handleResetDemoClick = () => {
    openConfirmDialog({
      title: 'Restore Initial Demonstration Data',
      message: 'This will reset all production orders, active batches, verified checks, and financial records back to their baseline seed state.',
      confirmLabel: 'Restore Demo Data',
      variant: 'warning',
      onConfirm: () => {
        resetDemo();
      },
    });
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200/90 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4 font-sans select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0FDF4] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#01411C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-150">
            <span className="text-xs font-mono font-extrabold tracking-tighter">PK</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold font-sans text-[#1A2E22] tracking-tight leading-none">
              PAK-HOMECEO
            </h1>
            <p className="text-[10px] text-[#4A5D52] font-sans truncate mt-1">
              Women-Led Enterprise Platform
            </p>
          </div>
        </Link>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 block mb-1">
            Operations
          </span>
          <nav className="space-y-1">
            {primaryItems.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#01411C] text-white shadow-xs'
                      : 'text-[#4A5D52] hover:text-[#1A2E22] hover:bg-[#F0FDF4]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isActive ? 'text-white' : 'text-[#718579]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#01411C]">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 block mb-1">
            System & Support
          </span>
          <nav className="space-y-1">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#01411C] text-white shadow-xs'
                      : 'text-[#4A5D52] hover:text-[#1A2E22] hover:bg-[#F0FDF4]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={isActive ? 'text-white' : 'text-[#718579]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#01411C] text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: DEMO Role Switcher & User Profile */}
      <div className="space-y-3 pt-4 border-t border-stone-200/80">
        {/* DEMO MODE Box */}
        {demoMode && (
          <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#01411C]">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Demo Mode</span>
              </span>
              <button
                type="button"
                onClick={handleResetDemoClick}
                title="Reset demo data"
                className="text-[10px] font-bold text-[#01411C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick 4-role switcher pills */}
            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
              {[
                { id: 'builder', label: 'Builder' },
                { id: 'partner', label: 'Partner' },
                { id: 'connector', label: 'Connector' },
                { id: 'citizen', label: 'Citizen' },
              ].map((r) => {
                const isActive = currentRole === r.id || (r.id === 'citizen' && currentRole === 'patron');
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSwitch(r.id as UserRole)}
                    className={`py-1 px-1.5 rounded-lg transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-[#01411C] text-white shadow-xs'
                        : 'bg-white text-[#4A5D52] hover:bg-emerald-50 hover:text-[#01411C] border border-stone-200/60'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* User Identity Card */}
        <Link
          to="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0FDF4] transition-colors border border-transparent hover:border-[#BBF7D0] group"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#1A2E22] truncate group-hover:text-[#01411C]">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-[#718579] truncate">
              {currentUser.code} · {currentUser.city}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#01411C] shrink-0" title="Online" />
        </Link>
      </div>
    </aside>
  );
};
