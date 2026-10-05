import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Avatar } from '../ui/Avatar';
import {
  User,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Check,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const ProfileMenu: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    demoMode,
    setDemoMode,
    resetDemo,
    openConfirmDialog,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setIsOpen(false);
    // Gracefully navigate to new role's dashboard or allowed space
    if (role === 'builder') navigate('/business-builder');
    else if (role === 'partner') navigate('/skill-partner');
    else if (role === 'connector') navigate('/community-connector');
    else navigate('/citizen');
  };

  const handleLogout = () => {
    setIsOpen(false);
    openConfirmDialog({
      title: 'Sign Out of PAK-HOMECEO',
      message: 'Are you sure you want to sign out? In Demo mode, you can easily log back in as any persona.',
      confirmLabel: 'Sign Out',
      variant: 'primary',
      onConfirm: () => {
        navigate('/login');
      },
    });
  };

  const handleResetDemoConfirm = () => {
    setIsOpen(false);
    openConfirmDialog({
      title: 'Reset Demo Data',
      message: 'This will reset all orders, batches, quality inspections, and payouts to original demonstration state.',
      confirmLabel: 'Reset Data',
      variant: 'warning',
      onConfirm: () => {
        resetDemo();
      },
    });
  };

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors border border-transparent hover:border-[#BBF7D0] cursor-pointer"
      >
        <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="sm" />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-[#1A2E22] truncate max-w-[110px] leading-tight font-sans">
            {currentUser.name}
          </p>
          <span className="text-[10px] font-semibold text-[#01411C] capitalize">
            {currentRole === 'builder'
              ? 'Business Builder'
              : currentRole === 'partner'
              ? 'Skill Partner'
              : currentRole === 'connector'
              ? 'Connector'
              : 'Citizen'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-stone-100 bg-[#FAF9F6] rounded-t-xl">
            <div className="flex items-center gap-3">
              <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#1A2E22] truncate font-sans">
                    {currentUser.name}
                  </h4>
                  {currentUser.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#01411C] text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#4A5D52] truncate font-sans">
                  {currentUser.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200 text-[#01411C] font-semibold">
                    {currentUser.code}
                  </span>
                  <span className="text-[10px] text-[#718579] font-sans">
                    {currentUser.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Section & Demo Switcher */}
          <div className="px-3 py-2 border-b border-stone-100">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                Active Role
              </span>
              {demoMode && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#01411C] bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                  Demo Switcher
                </span>
              )}
            </div>

            {demoMode ? (
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'builder', label: 'Business Builder' },
                  { id: 'partner', label: 'Skill Partner' },
                  { id: 'connector', label: 'Community Connector' },
                  { id: 'citizen', label: 'Citizen' },
                ].map((r) => {
                  const isActive = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id as UserRole)}
                      className={`flex items-center justify-between p-2 rounded-xl text-[11px] font-semibold text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#01411C] text-white shadow-xs'
                          : 'bg-stone-50 text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C]'
                      }`}
                    >
                      <span className="truncate">{r.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-2 py-1 text-xs font-semibold text-[#1A2E22] capitalize flex items-center justify-between">
                <span>{currentRole}</span>
                <span className="text-[10px] text-stone-400">Production Mode</span>
              </div>
            )}
          </div>

          {/* Navigation Links per Spec */}
          <div className="px-2 py-1.5 space-y-0.5 border-b border-stone-100 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-stone-400" />
              <span>Profile Information</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-stone-400" />
              <span>Settings & Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/how-it-works');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-stone-400" />
              <span>Platform Story & Help</span>
            </button>
          </div>

          {/* Demo Mode Toggle & Reset Action */}
          <div className="px-2 py-1.5 border-b border-stone-100 space-y-0.5">
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#4A5D52] hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Simulation Mode</span>
              </span>
              {demoMode ? (
                <ToggleRight className="w-5 h-5 text-[#01411C]" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-stone-300" />
              )}
            </button>

            {demoMode && (
              <button
                type="button"
                onClick={handleResetDemoConfirm}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-[#718579] hover:text-[#01411C] hover:bg-[#F0FDF4] rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo to Initial State</span>
              </button>
            )}
          </div>

          {/* Logout Action */}
          <div className="px-2 pt-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout / Exit Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
