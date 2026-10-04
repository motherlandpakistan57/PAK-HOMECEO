import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Layers,
  HeartHandshake,
  Compass,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  Sparkle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { VisualReferenceModal } from '../visuals/VisualReferenceModal';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';
import { PlatformMediaUploader } from '../media/PlatformMediaUploader';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics } = useApp();
  const { language, toggleLanguage } = useLanguage();
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);

  // The 4 Official PAK-HOMECEO Enterprise Pillars with approved palette
  const enterprisePillars = [
    {
      id: 'hunar',
      code: 'HOMECEO HUNAR',
      titleEn: 'Handicrafts & Textiles',
      titleUr: 'ہنر',
      descriptionEn: 'Kashidakari counted resham silk, Cholistani ralli quilts, and northern woolens.',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.hunza_handicrafts.imageUrl,
      accentColor: 'text-[#C05638]',
      badgeBg: 'bg-[#C05638]/10 text-[#C05638] border-[#C05638]/30',
      borderColor: 'hover:border-[#C05638]',
      tag: 'Heritage Crafts',
    },
    {
      id: 'menue',
      code: 'HOMECEO MENUE',
      titleEn: 'Food Enterprise & Preserves',
      titleUr: 'مینو',
      descriptionEn: 'Sun-cured Sargodha mango achar, raw Potohar Sidr honey, and natural Swat confections.',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.pakistani_food.imageUrl,
      accentColor: 'text-[#D9822B]',
      badgeBg: 'bg-[#D9822B]/10 text-[#D9822B] border-[#D9822B]/30',
      borderColor: 'hover:border-[#D9822B]',
      tag: 'Culinary Enterprise',
    },
    {
      id: 'knowledge',
      code: 'HOMECEO KNOWLEDGE',
      titleEn: 'Generational Wisdom & Craft',
      titleUr: 'علم',
      descriptionEn: 'Ancestral needlecraft pattern blueprints and slow-cooked culinary heritage recipes.',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.sindhi_ajrak.imageUrl,
      accentColor: 'text-[#1E293B]',
      badgeBg: 'bg-[#1E293B]/10 text-[#1E293B] border-[#1E293B]/30',
      borderColor: 'hover:border-[#1E293B]',
      tag: 'Heritage Knowledge',
    },
    {
      id: 'services',
      code: 'HOMECEO SERVICES',
      titleEn: 'Doorstep Community Finishing',
      titleUr: 'خدمات',
      descriptionEn: 'Doorstep physical measurement pickup, boutique garment finishing, and trusted local care.',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.bazaar_commerce.imageUrl,
      accentColor: 'text-[#01411C]',
      badgeBg: 'bg-[#01411C]/10 text-[#01411C] border-[#01411C]/30',
      borderColor: 'hover:border-[#01411C]',
      tag: 'Community Services',
    },
  ];

  // The 4 Core Roles
  const closedLoopPillars = [
    {
      role: 'Skill Partner',
      urdu: 'ہنرمند ساتھی',
      title: 'Master Artisan',
      description: 'Women with decades of mastery turning home skills into income and lifelong purpose.',
      icon: <Users className="w-5 h-5 text-[#01411C]" />,
    },
    {
      role: 'Business Builder',
      urdu: 'کاروباری منتظم',
      title: 'Product Manager',
      description: 'Young women entrepreneurs coordinating catalog intake, batching, and operations.',
      icon: <Layers className="w-5 h-5 text-[#01411C]" />,
    },
    {
      role: 'Community Connector',
      urdu: 'مقامی رابطہ کار',
      title: 'Field Coordinator',
      description: 'Doorstep raw material drops, physical 6-point verification, and human trust.',
      icon: <HeartHandshake className="w-5 h-5 text-[#D9822B]" />,
    },
    {
      role: 'Citizen',
      urdu: 'باشعور شہری',
      title: 'Conscious Buyer',
      description: 'Citizens investing in authentic heritage stories with ~70% direct-to-maker payout.',
      icon: <Compass className="w-5 h-5 text-[#C05638]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] font-sans selection:bg-[#01411C]/20 selection:text-[#01411C]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#01411C] flex items-center justify-center text-white shadow-xs">
              <span className="font-mono font-extrabold text-xs tracking-tighter">PK</span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1A2E22] block font-sans">
                PAK-HOMECEO
              </span>
              <span className="text-[10px] text-[#4A5D52] font-sans block -mt-0.5">
                Pakistan Women-Led Enterprise Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsVisualModalOpen(true)}
              className="text-xs font-bold text-[#01411C] hover:text-[#01411C]/80 px-2.5 py-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Open Official Visual Reference Library"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#01411C]" />
              <span className="hidden sm:inline">Visual Library</span>
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-bold text-stone-700 hover:text-[#01411C] px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="text-[10px] text-[#01411C] font-mono uppercase">Lang:</span>
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/citizen')}
              className="text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-100 cursor-pointer hidden md:block"
            >
              Citizen Marketplace
            </button>

            <Button
              onClick={() => navigate('/login')}
              variant="executiveGreen"
              size="sm"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC MASTER HERO: Authentic Pakistani Landscape & Vision         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-[#0F172A] text-white border-b border-stone-200/80">
        {/* Pakistani Landscape Hero Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl}
            alt="Historic Pakistan Heritage Landscape"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/80 to-[#0F172A]" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#01411C]/35 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C05638]/25 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#01411C]/70 border border-[#BBF7D0]/40 text-xs font-semibold text-[#BBF7D0] shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pakistan Women-Led Domestic Enterprise Ecosystem</span>
          </div>

          {/* Master Vision Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-sans">
              Every Home Can Become an Enterprise.{' '}
              <span className="text-[#86EFAC] block mt-1">
                Every Woman Can Become a CEO.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto font-medium leading-relaxed pt-2">
              Transforming domestic skill into household enterprise, financial independence, and lasting social dignity across Pakistan.
            </p>
          </div>

          {/* Core Call to Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              variant="executiveGreen"
              size="lg"
              className="w-full sm:w-auto font-bold shadow-xl bg-[#01411C] hover:bg-[#025927] text-white border border-[#BBF7D0]/40 px-8 py-3.5 text-sm"
            >
              <span>Enter Platform & Select Role</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={() => navigate('/citizen')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-semibold border-white/25 text-white hover:bg-white/10 px-6 py-3.5 text-sm backdrop-blur-xs"
            >
              <ShoppingBag className="w-4 h-4 mr-2 text-[#86EFAC]" />
              <span>Explore Citizen Marketplace</span>
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#86EFAC]" />
              <span>~70% Direct Payout to Woman Maker</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
              <span>Doorstep 6-Point Quality Checks</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#86EFAC]" />
              <span>Multan · Swat · Sargodha · Hala Clusters</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 4 HOMECEO ENTERPRISE PILLARS (Clean, Cinematic, Authentic Visuals) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#01411C]">
                Enterprise Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22] mt-1">
                The 4 HOMECEO Enterprise Pillars
              </h2>
            </div>
            <Button
              onClick={() => navigate('/citizen')}
              variant="outline"
              size="sm"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* 4 Clean Cinematic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterprisePillars.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => navigate('/citizen')}
                className={`bg-[#FAF9F6] rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group ${pillar.borderColor}`}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {pillar.tag}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-bold">{pillar.code}</span>
                    <span className="text-xs font-serif font-bold text-amber-200">{pillar.titleUr}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors">
                      {pillar.titleEn}
                    </h3>
                    <p className="text-xs text-[#4A5D52] leading-relaxed">
                      {pillar.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-bold text-[#01411C]">
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLOSED-LOOP OPERATING ROLES (Four Roles, One Ecosystem)               */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF9F6] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#01411C]">
              Closed-Loop Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22]">
              Different Strengths. One Ecosystem.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52]">
              Every role operates with clear responsibilities, structured dignity, and direct economic empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {closedLoopPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-[#01411C] transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shadow-2xs">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#01411C] uppercase tracking-wider">
                        Role 0{idx + 1}
                      </span>
                      <span className="text-xs font-serif font-bold text-amber-950">
                        {p.urdu}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#1A2E22] mt-0.5">{p.role}</h3>
                    <p className="text-xs font-semibold text-[#01411C]">{p.title}</p>
                  </div>
                  <p className="text-xs text-[#4A5D52] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs"
                >
                  <span>Select {p.role}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL PLATFORM METRICS                                                 */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-[#718579] uppercase tracking-wider block">
              Active Women Artisans
            </span>
            <span className="text-3xl font-extrabold text-[#1A2E22] font-mono tabular-nums mt-1 block">
              {metrics.womenEngaged}+
            </span>
            <span className="text-xs text-[#4A5D52] mt-1 block">Multan, Swat, Sargodha & Hala</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-xs">
            <span className="text-[11px] font-bold text-[#01411C] uppercase tracking-wider block">
              Direct Household Pay
            </span>
            <span className="text-3xl font-extrabold text-[#01411C] font-mono tabular-nums mt-1 block">
              PKR {(metrics.totalIncomeGeneratedPKR / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-[#01411C]/80 mt-1 block">~70% directly to makers</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-[#718579] uppercase tracking-wider block">
              Delivered Orders
            </span>
            <span className="text-3xl font-extrabold text-[#1A2E22] font-mono tabular-nums mt-1 block">
              {metrics.ordersCompleted}
            </span>
            <span className="text-xs text-[#4A5D52] mt-1 block">100% Doorstep QC Pass</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-[#718579] uppercase tracking-wider block">
              Repeat Citizens
            </span>
            <span className="text-3xl font-extrabold text-[#1A2E22] font-mono tabular-nums mt-1 block">
              {metrics.repeatCitizensRate || metrics.repeatPatronsRate}%
            </span>
            <span className="text-xs text-[#4A5D52] mt-1 block">Sustained organic trust</span>
          </div>
        </div>

        {/* Video Settings & Platform Visual Assets Studio */}
        <div className="mt-8">
          <PlatformMediaUploader />
        </div>

        {/* Clean Call to Action */}
        <div className="mt-16 text-center space-y-4 max-w-xl mx-auto">
          <h3 className="text-2xl font-extrabold text-[#1A2E22]">
            Ready to Enter PAK-HOMECEO?
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5D52]">
            Select your role to explore the live operational closed-loop system, or discover authentic artisan collections on the marketplace.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate('/login')}
              variant="executiveGreen"
              size="lg"
              className="font-bold shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <span>Get Started & Choose Role</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => setIsVisualModalOpen(true)}
              variant="outline"
              size="lg"
              className="font-semibold w-full sm:w-auto"
            >
              <ImageIcon className="w-4 h-4 mr-2 text-[#01411C]" />
              <span>View Visual Reference Library</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 font-sans">
        PAK-HOMECEO · Transforming Home Skills into Dignity, Income, and Purpose across Pakistan.
      </footer>

      {/* Official Visual Reference Modal */}
      <VisualReferenceModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
      />
    </div>
  );
};
