import React from 'react';

interface ProductIconGraphicProps {
  iconType: 'embroidery' | 'pickle' | 'recipe' | 'tailoring' | 'shawl' | 'honey' | 'sweets' | 'ralli' | 'pottery';
  title?: string;
  className?: string;
}

export const ProductIconGraphic: React.FC<ProductIconGraphicProps> = ({ iconType, title, className = 'w-full h-48' }) => {
  // Curated, domain-specific artisanal vector artwork for each craft category
  switch (iconType) {
    case 'pottery':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#0284C7] to-[#0F766E] flex items-center justify-center p-6 ${className}`}>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 border-2 border-cyan-200/50 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🏺</span>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-cyan-100">
              Multani Kashikari Blue Pottery
            </span>
          </div>
        </div>
      );
    case 'shawl':
    case 'embroidery':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#431407] flex items-center justify-center p-6 ${className}`}>
          {/* Artisanal textile pattern background */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="kashida-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx="20" cy="20" r="4" fill="#FDE047" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#kashida-grid)" />
            </svg>
          </div>
          {/* Main Motif: Handcrafted Multani Pashmina & Mirror work */}
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-300/40 flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-amber-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3" fill="#FEF08A" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-amber-100">
              Multani Kashidakari · Silk & Mirror
            </span>
          </div>
        </div>
      );

    case 'ralli':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#991B1B] via-[#B91C1C] to-[#78350F] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ralli-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="24" height="24" fill="#F59E0B" />
                  <rect x="24" y="24" width="24" height="24" fill="#DC2626" />
                  <path d="M 0 0 L 24 24 M 24 0 L 0 24" stroke="#FAF5FF" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ralli-pattern)" />
            </svg>
          </div>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-lg bg-red-900/40 border border-amber-400/50 flex items-center justify-center shadow-lg transform -rotate-3">
              <svg className="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
                <path d="M15 15l4-4" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-amber-100">
              Cholistan Folk Ralli Appliqué
            </span>
          </div>
        </div>
      );

    case 'pickle':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#854D0E] via-[#A16207] to-[#451A03] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(#FDE047_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-900/40 border border-yellow-400/40 flex items-center justify-center shadow-md">
              <svg className="w-10 h-10 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 6h10v14a2 2 0 01-2 2H9a2 2 0 01-2-2V6z" />
                <path d="M6 3h12a1 1 0 011 1v2H5V4a1 1 0 011-1z" />
                <path d="M10 11h4M10 15h4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-yellow-100">
              Sun-Cured Chaunsa Mango Achar
            </span>
          </div>
        </div>
      );

    case 'honey':
    case 'sweets':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#B45309] via-[#D97706] to-[#78350F] flex items-center justify-center p-6 ${className}`}>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-950/40 border border-amber-300/40 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-amber-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
                <path d="M12 7v10M8 12h8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-amber-100">
              Pure Village Desi Ghee & Halwa
            </span>
          </div>
        </div>
      );

    case 'recipe':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#172554] flex items-center justify-center p-6 ${className}`}>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-xl bg-blue-950/50 border border-blue-300/40 flex items-center justify-center shadow-md">
              <svg className="w-10 h-10 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M9 7h6M9 11h6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-blue-100">
              Ancestral Craft Pattern Manual
            </span>
          </div>
        </div>
      );

    case 'tailoring':
    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#065F46] via-[#047857] to-[#064E3B] flex items-center justify-center p-6 ${className}`}>
          <div className="relative text-center z-10">
            <div className="w-20 h-20 mx-auto rounded-xl bg-emerald-950/50 border border-emerald-300/40 flex items-center justify-center shadow-md">
              <svg className="w-10 h-10 text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
            </div>
            <span className="block mt-3 text-xs tracking-wider uppercase font-semibold text-emerald-100">
              Bespoke Heritage Tailoring
            </span>
          </div>
        </div>
      );
  }
};
