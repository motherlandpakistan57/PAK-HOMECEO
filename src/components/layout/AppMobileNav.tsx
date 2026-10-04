import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Home,
  Briefcase,
  DollarSign,
  MessageSquare,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  MapPin,
  Compass,
  Search,
  Package,
  Users,
} from 'lucide-react';

export const AppMobileNav: React.FC = () => {
  const { currentRole, setIsSearchOpen } = useApp();

  // Mobile specific actions per role
  const mobileNavByRole: Record<
    UserRole,
    { label: string; to: string; icon: React.ReactNode }[]
  > = {
    builder: [
      { label: 'Overview', to: '/business-builder?tab=overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Orders', to: '/business-builder?tab=orders', icon: <ShoppingBag className="w-5 h-5" /> },
      { label: 'People', to: '/business-builder?tab=people', icon: <Users className="w-5 h-5" /> },
      { label: 'Products', to: '/business-builder?tab=products', icon: <Package className="w-5 h-5" /> },
    ],
    partner: [
      { label: 'Home', to: '/skill-partner?tab=dashboard', icon: <Home className="w-5 h-5" /> },
      { label: 'My Work', to: '/skill-partner?tab=work', icon: <Briefcase className="w-5 h-5" /> },
      { label: 'Earnings', to: '/skill-partner?tab=earnings', icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Messages', to: '/skill-partner?tab=messages', icon: <MessageSquare className="w-5 h-5" /> },
    ],
    connector: [
      { label: 'Visits', to: '/community-connector', icon: <MapPin className="w-5 h-5" /> },
      { label: 'Batches', to: '/batches', icon: <Layers className="w-5 h-5" /> },
      { label: 'Messages', to: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    ],
    citizen: [
      { label: 'Marketplace', to: '/citizen', icon: <Compass className="w-5 h-5" /> },
      { label: 'Products', to: '/products', icon: <Package className="w-5 h-5" /> },
      { label: 'My Orders', to: '/orders', icon: <ShoppingBag className="w-5 h-5" /> },
      { label: 'Messages', to: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    ],
    patron: [
      { label: 'Marketplace', to: '/citizen', icon: <Compass className="w-5 h-5" /> },
      { label: 'Products', to: '/products', icon: <Package className="w-5 h-5" /> },
      { label: 'My Orders', to: '/orders', icon: <ShoppingBag className="w-5 h-5" /> },
      { label: 'Messages', to: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    ],
  };

  const navItems = mobileNavByRole[currentRole] || mobileNavByRole.builder;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg font-sans safe-bottom"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              isActive
                ? 'text-[#01411C]'
                : 'text-[#718579] hover:text-[#1A2E22]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-[#F0FDF4] scale-110' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="truncate mt-0.5">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Floating/Quick Search Action */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold text-[#718579] hover:text-[#01411C] cursor-pointer"
      >
        <div className="p-1 rounded-lg">
          <Search className="w-5 h-5" />
        </div>
        <span className="truncate mt-0.5">Search</span>
      </button>
    </nav>
  );
};
