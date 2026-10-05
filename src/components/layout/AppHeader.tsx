import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from './Breadcrumbs';
import { ProfileMenu } from '../profile/ProfileMenu';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AppHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleMobileSidebar }) => {
  const { language, toggleLanguage } = useLanguage();
  const {
    currentUser,
    currentRole,
    switchRole,
    demoMode,
    setIsSearchOpen,
    setIsNotificationsOpen,
    notifications,
  } = useApp();

  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleQuickChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    switchRole(newRole);
    if (newRole === 'builder') navigate('/business-builder');
    else if (newRole === 'partner') navigate('/skill-partner');
    else if (newRole === 'connector') navigate('/community-connector');
    else navigate('/citizen');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 font-sans">
        {/* Left Side: Brand Logo (on mobile) & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Brand Link (since sidebar is hidden on mobile) */}
          <Link
            to="/dashboard"
            className="lg:hidden flex items-center gap-2 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#01411C] flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
              PK
            </div>
          </Link>

          {/* Breadcrumbs for desktop and tablet */}
          <div className="min-w-0">
            <Breadcrumbs />
          </div>
        </div>

        {/* Center / Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Trigger Bar */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F0FDF4] border border-stone-200 hover:border-[#BBF7D0] rounded-xl text-xs text-[#718579] hover:text-[#1A2E22] transition-all cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#01411C]" />
            <span className="hidden md:inline font-sans">Search platform...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono text-stone-500 bg-white border border-stone-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-[#F0FDF4] hover:text-[#01411C] border border-stone-200 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            title="Switch Language / زبان تبدیل کریں"
          >
            <span className="text-[10px] uppercase font-mono text-[#01411C]">Lang:</span>
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Clear DEMO MODE Indicator & Active Role Badge */}
          {demoMode && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#01411C]">
                <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Active Role</span>
              </span>
              <div className="h-3 w-px bg-[#BBF7D0]" />
              <span className="text-xs font-bold text-[#01411C] capitalize pr-1">
                {currentRole === 'patron' || currentRole === 'citizen'
                  ? 'Citizen'
                  : currentRole === 'builder'
                  ? 'Business Builder'
                  : currentRole === 'partner'
                  ? 'Skill Partner'
                  : 'Community Connector'}
              </span>
            </div>
          )}

          {/* Notification Center Trigger */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Open notifications"
            className="relative p-2 text-[#4A5D52] hover:text-[#01411C] hover:bg-[#F0FDF4] rounded-xl border border-transparent hover:border-[#BBF7D0] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#01411C] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Menu Dropdown */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};
