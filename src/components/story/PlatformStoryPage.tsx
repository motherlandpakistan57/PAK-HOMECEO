import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Layers,
  ShoppingBag,
  TrendingUp,
  HeartHandshake,
  DollarSign,
  ChevronRight,
  Quote,
  Award,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';

export const PlatformStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useApp();
  const [currentStage, setCurrentStage] = useState(0);

  // The 5 Transformation Narrative Stages
  // Strictly mapped to the PAK-HOMECEO Official Visual Reference Library:
  // 1. Skill Exists → Experienced Pakistani woman/artisan (Dignity & Mastery)
  // 2. Business Is Built → Women Food Enterprise (HOMECEO MENUE & Kitchen Enterprise Scaling)
  // 3. Products Reach Customers → Lahore Bazaar (Community Commerce & Citizen Discovery)
  // 4. Women Earn → Karachi Textile Market (Commercial Textile Trade & Direct Mobile Wallet Settlements)
  // 5. The Enterprise Grows → Lahore Fort & Pakistan Landscape (Civic Heritage & Local-to-National Scale)
  const stages = [
    {
      id: 1,
      tag: 'STAGE 1',
      title: 'Skill Exists',
      kicker: 'Heirloom Capability Inside the Household',
      summary: 'Centuries of refined craft, counted resham threadwork, and ancestral spice recipes already thrive inside millions of Pakistani homes.',
      details: [
        'Over 12 million Pakistani women possess unmonetized master-level culinary and textile skills.',
        'Domestic responsibilities and cultural boundaries prevent traditional 9-to-5 factory employment.',
        'Skill does not need to be taught from scratch; it requires formal recognition and dignified valuation.',
      ],
      image: OFFICIAL_VISUAL_LIBRARY.artisan_dignity.imageUrl,
      imageCaption: 'Experienced Pakistani Woman Artisan · Dignity, mastery, and generational craft (Demo Reference).',
      stat: '148+ Home Producers',
      statLabel: 'Active in Punjab & Sindh Clusters',
      roleFocus: 'Skill Partner (Master Artisan)',
    },
    {
      id: 2,
      tag: 'STAGE 2',
      title: 'Business Is Built',
      kicker: 'Batch Architecture & Quality Standards',
      summary: 'Educated young Business Builders bridge the gap by packaging home crafts into standardized production batches with verified materials.',
      details: [
        'Community Connectors drop standardized raw silk skeins, jars, and patterns right at the artisan’s doorstep.',
        'Rigorous 6-point physical quality audit checklists guarantee institutional-grade consistency.',
        'Artisans track progress using voice guidance and large-touch interfaces, eliminating literacy barriers.',
      ],
      image: OFFICIAL_VISUAL_LIBRARY.food_enterprise.imageUrl,
      imageCaption: 'Women Food Enterprise (HOMECEO MENUE) · Intergenerational domestic kitchen scaled with digital tablets (Demo Reference).',
      stat: '19 Batches Formed',
      statLabel: 'Managed with doorstep raw material drops',
      roleFocus: 'Business Builder (Product Manager)',
    },
    {
      id: 3,
      tag: 'STAGE 3',
      title: 'Products Reach Customers',
      kicker: 'Marketplace Reach Built on Pride, Not Pity',
      summary: 'Conscious citizens purchase authentic items with radical transparency—celebrating human stories and certified craft heritage.',
      details: [
        'Every product display card breaks down the exact cost: materials, logistics, builder margin, and artisan pay.',
        'Live 6-stage order tracking lets citizens follow their item from allocation to doorstep delivery.',
        'Citizens receive a personalized card with the artisan’s anonymized code, creating a deep human bond.',
      ],
      image: OFFICIAL_VISUAL_LIBRARY.bazaar_commerce.imageUrl,
      imageCaption: 'Lahore Old City Community Commerce · Grassroots trade connecting households to conscious citizens (Demo Reference).',
      stat: '394 Completed Orders',
      statLabel: '46.8% Repeat Citizen Purchasing Rate',
      roleFocus: 'Citizen (Conscious Buyer)',
    },
    {
      id: 4,
      tag: 'STAGE 4',
      title: 'Women Earn',
      kicker: 'Instant Escrow Settlement Directly to Mobile Wallets',
      summary: '70%+ of the retail price is disbursed directly to the woman artisan upon verified delivery, with zero predatory middleman cuts.',
      details: [
        'Funds are held securely in escrow and released directly into JazzCash, EasyPaisa, or mobile wallets.',
        'Immediate settlement eliminates the customary 90-day retail payment delays that choke small makers.',
        'Direct financial access gives women autonomous purchasing power within their households.',
      ],
      image: OFFICIAL_VISUAL_LIBRARY.textile_market.imageUrl,
      imageCaption: 'Karachi Wholesale Textile Market · Commercial trade, batch scaling, and direct cashless payouts (Demo Reference).',
      stat: 'PKR 2.84M Disbursed',
      statLabel: 'Directly into women-held mobile accounts',
      roleFocus: 'Financial Autonomy',
    },
    {
      id: 5,
      tag: 'STAGE 5',
      title: 'The Enterprise Grows',
      kicker: 'Scaling From Lone Artisan to Cluster CEO',
      summary: 'Reliable income fuels sustainable reinvestment: upgrading wooden looms, financing daughter education, and hiring neighboring women.',
      details: [
        'Top-performing Skill Partners evolve into Master Producers, mentoring 5 to 10 apprentice neighbors.',
        'Household micro-factories aggregate into regional economic clusters across Multan, Bahawalpur, and Sargodha.',
        'Every home transforms into a productive enterprise, and every skilled woman emerges as a CEO.',
      ],
      image: OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl,
      imageCaption: 'Historic Lahore Mughal Architecture · Civic pride and national economic transformation (Demo Reference).',
      stat: '100% Retained Assets',
      statLabel: 'Reinvested in household education and tools',
      roleFocus: 'Enterprise Leadership',
    },
  ];

  const current = stages[currentStage];

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    } else {
      navigate('/welcome');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-[#01411C]/20 selection:text-[#01411C] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#01411C] flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
              PK
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1A2E22] tracking-tight block">
                PAK-HOMECEO
              </span>
              <span className="text-[10px] text-[#4A5D52] block -mt-0.5">
                Interactive Platform Story
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-[#718579] hover:text-[#01411C] px-3 py-1.5 transition-colors cursor-pointer"
            >
              Skip to Login
            </button>
            <Button
              onClick={() => navigate('/login')}
              variant="executiveGreen"
              size="sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Interactive Story Experience */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Stage Progress Stepper Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-2">
            {stages.map((stage, idx) => {
              const isPassed = idx < currentStage;
              const isCurrent = idx === currentStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setCurrentStage(idx)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#01411C] shadow-sm ring-2 ring-[#01411C]/15'
                      : isPassed
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                      : 'bg-stone-50 border-stone-200 text-[#718579] hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block">
                    {stage.tag}
                  </span>
                  <span className="text-xs font-extrabold line-clamp-1 mt-0.5">
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Presentation Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left: Content Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#01411C] border border-[#BBF7D0]">
                  {current.tag} · {current.roleFocus}
                </span>
                <span className="text-xs text-[#718579] font-medium">
                  Stage {currentStage + 1} of 5
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A2E22] tracking-tight font-sans">
                  {current.title}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#01411C] mt-1 font-sans">
                  {current.kicker}
                </p>
              </div>

              <p className="text-xs sm:text-base text-[#4A5D52] font-normal leading-relaxed">
                {current.summary}
              </p>

              <div className="space-y-2 pt-2">
                {current.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[#1A2E22]">
                    <CheckCircle2 className="w-4 h-4 text-[#01411C] shrink-0 mt-0.5" />
                    <span className="leading-normal">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Proof Point Stat */}
            <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-base sm:text-xl font-extrabold text-[#01411C] font-mono tabular-nums block">
                  {current.stat}
                </span>
                <span className="text-[11px] text-[#718579] font-medium">
                  {current.statLabel}
                </span>
              </div>

              <span className="text-xs font-semibold text-[#01411C] bg-[#F0FDF4] px-3 py-1 rounded-lg border border-[#BBF7D0]">
                Verified Process
              </span>
            </div>
          </div>

          {/* Right: Authentic Visual Column */}
          <div className="lg:col-span-5 relative bg-stone-100 min-h-[260px] lg:min-h-full">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">
                Authentic Household Enterprise
              </span>
              <p className="text-xs text-stone-100 leading-snug">
                {current.imageCaption}
              </p>
            </div>
          </div>
        </div>

        {/* Stakeholder Triangular Relationship: Skill Partner ↔ Business Builder ↔ Customer */}
        <div className="mt-10 p-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#01411C]">
              Ecosystem Relationship
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1A2E22] mt-0.5">
              Skill Partner ↔ Business Builder ↔ Customer
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="text-[10px] font-bold uppercase text-[#01411C]">MEMBER 1</span>
              <h4 className="text-sm font-bold text-[#1A2E22] mt-1">Skill Partner (Artisan)</h4>
              <p className="text-xs text-[#4A5D52] mt-1 leading-relaxed">
                Applies craft expertise inside her domestic courtyard. Receives doorstep materials and direct, fair remuneration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-300 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-emerald-700">MEMBER 2</span>
              <h4 className="text-sm font-bold text-[#1A2E22] mt-1">Business Builder (Manager)</h4>
              <p className="text-xs text-[#4A5D52] mt-1 leading-relaxed">
                Aggregates orders into standardized production batches, conducts 6-point QC, and scales commercial market channels.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="text-[10px] font-bold uppercase text-[#01411C]">MEMBER 3</span>
              <h4 className="text-sm font-bold text-[#1A2E22] mt-1">Citizen (Customer)</h4>
              <p className="text-xs text-[#4A5D52] mt-1 leading-relaxed">
                Purchases authenticated heirlooms with 100% price transparency, knowing 70%+ directly supports the woman creator.
              </p>
            </div>
          </div>
        </div>

        {/* Human-Centered Manifest Message per prompt */}
        <div className="mt-8 p-6 rounded-2xl bg-[#01411C] text-white text-center shadow-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-2 relative z-10">
            <Quote className="w-8 h-8 text-emerald-300/40 mx-auto" />
            <p className="text-base sm:text-xl font-bold font-sans tracking-tight text-white leading-relaxed">
              “We do not treat women as beneficiaries. We connect existing capability with real opportunity.”
            </p>
            <p className="text-xs text-emerald-200 font-medium">
              PAK-HOMECEO Operating Philosophy · Team StrongerTogether
            </p>
          </div>
        </div>

        {/* Navigation Controls: Back / Next / Skip / Get Started */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleBack}
              variant="outline"
              size="md"
              className="w-1/2 sm:w-auto font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-[#718579] hover:text-[#01411C] px-3 py-2 transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentStage < stages.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="executiveGreen"
                size="md"
                className="w-full sm:w-auto font-bold"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : null}

            <Button
              onClick={() => navigate('/login')}
              variant={currentStage === stages.length - 1 ? 'executiveGreen' : 'secondary'}
              size="md"
              className="w-full sm:w-auto font-bold"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/90 py-4 px-4 text-center text-xs text-stone-500 font-sans">
        PAK-HOMECEO · Every Home Can Become an Enterprise. Every Woman Can Become a CEO.
      </footer>
    </div>
  );
};
