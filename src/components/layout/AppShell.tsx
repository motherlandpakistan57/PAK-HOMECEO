import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { AppMobileNav } from './AppMobileNav';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { ToastContainer } from '../ui/ToastContainer';
import { GlobalConfirmDialog } from '../ui/GlobalConfirmDialog';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-[#01411C]/20 selection:text-[#01411C]">
      {/* Top Header */}
      <AppHeader />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-row relative min-h-0">
        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Scrollable Main Content */}
        <main className="flex-1 pb-20 lg:pb-12 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Ergonomic Bottom Navigation */}
        <AppMobileNav />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/90 py-5 px-4 sm:px-6 lg:px-8 shrink-0 font-sans z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            <span className="font-extrabold font-sans text-[#01411C] tracking-tight mr-2">
              PAK-HOMECEO
            </span>
            <span>· Every Home Can Become an Enterprise. Every Woman Can Become a CEO.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#1A2E22] font-medium">
              Strategically prepared by Fakhar Mushtaq
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-[#01411C] font-bold">
              Co-designed by Team StrongerTogether
            </span>
          </div>
        </div>
      </footer>

      {/* Global Overlays & Modals */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <ToastContainer />
      <GlobalConfirmDialog />
    </div>
  );
};
