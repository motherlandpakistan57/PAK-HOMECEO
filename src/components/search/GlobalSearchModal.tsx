import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Package,
  ShoppingBag,
  Layers,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Settings,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    orders,
    batches,
    skillPartners,
    currentRole,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Filter products
  const matchedProducts = q
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.producerName.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  // Filter orders
  const matchedOrders = q
    ? orders
        .filter(
          (o) =>
            o.trackingNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.productTitle.toLowerCase().includes(q) ||
            o.customerCity.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Filter batches
  const matchedBatches = q
    ? batches
        .filter(
          (b) =>
            b.batchCode.toLowerCase().includes(q) ||
            b.title.toLowerCase().includes(q) ||
            b.city.toLowerCase().includes(q) ||
            b.skillPartnerName.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Filter artisans
  const matchedArtisans = q
    ? skillPartners
        .filter(
          (sp) =>
            sp.name.toLowerCase().includes(q) ||
            sp.specialty.toLowerCase().includes(q) ||
            sp.city.toLowerCase().includes(q) ||
            sp.anonymizedCode.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  // Quick navigation destinations
  const navSuggestions = [
    { label: 'Platform Dashboard', path: '/dashboard', icon: <Compass className="w-4 h-4" /> },
    { label: 'Products Catalog', path: '/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Orders Lifecycle', path: '/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Production Batches', path: '/batches', icon: <Layers className="w-4 h-4" /> },
    { label: 'Payments & Payouts', path: '/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Enterprise Impact', path: '/impact', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Messages', path: '/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ].filter((item) => !q || item.label.toLowerCase().includes(q));

  const handleSelectRoute = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const hasResults =
    matchedProducts.length > 0 ||
    matchedOrders.length > 0 ||
    matchedBatches.length > 0 ||
    matchedArtisans.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, batches, artisans, or pages... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-[#1A2E22] placeholder:text-stone-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-stone-500 bg-stone-100 border border-stone-300 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {q && !hasResults && (
            <div className="py-8 text-center text-xs text-stone-500 font-sans">
              No matching records found for "{query}". Try searching by craft, city, tracking code, or artisan name.
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 mb-1.5 font-sans">
                Products & Crafts
              </h5>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectRoute(`/products/${p.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0FDF4] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A2E22] truncate group-hover:text-[#01411C]">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-[#4A5D52] truncate">
                          {p.city} · {p.category} · PKR {p.pricePKR.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#01411C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 mb-1.5 font-sans">
                Orders & Shipments
              </h5>
              <div className="space-y-1">
                {matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => handleSelectRoute(`/orders/${o.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0FDF4] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A2E22] truncate group-hover:text-[#01411C]">
                          {o.trackingNumber} · {o.productTitle}
                        </p>
                        <p className="text-[11px] text-[#4A5D52] truncate">
                          {o.customerName} ({o.customerCity}) · Status: {o.status.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#01411C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Batches */}
          {matchedBatches.length > 0 && (
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 mb-1.5 font-sans">
                Production Batches
              </h5>
              <div className="space-y-1">
                {matchedBatches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectRoute('/batches')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0FDF4] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#01411C] shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A2E22] truncate group-hover:text-[#01411C]">
                          {b.batchCode} · {b.title}
                        </p>
                        <p className="text-[11px] text-[#4A5D52] truncate">
                          {b.skillPartnerName} · {b.city} · {b.completedUnits}/{b.targetUnits} Units
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#01411C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Artisans */}
          {matchedArtisans.length > 0 && (
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 mb-1.5 font-sans">
                Skill Partners & Producers
              </h5>
              <div className="space-y-1">
                {matchedArtisans.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleSelectRoute('/skill-partner')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0FDF4] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A2E22] truncate group-hover:text-[#01411C]">
                          {sp.name} ({sp.anonymizedCode})
                        </p>
                        <p className="text-[11px] text-[#4A5D52] truncate">
                          {sp.skillTitle} · {sp.city}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#01411C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Destinations */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#718579] px-2 mb-1.5 font-sans">
              Quick Navigation
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {navSuggestions.slice(0, 6).map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSelectRoute(item.path)}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-[#1A2E22] hover:bg-[#F0FDF4] hover:text-[#01411C] transition-colors cursor-pointer"
                >
                  <span className="text-stone-400 group-hover:text-[#01411C]">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Navigate with click or arrow keys</span>
          <span>Role: <strong className="capitalize text-[#01411C]">{currentRole}</strong></span>
        </div>
      </div>
    </div>
  );
};
