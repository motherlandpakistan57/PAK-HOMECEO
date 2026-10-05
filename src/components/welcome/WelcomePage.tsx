import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Trash2,
  Check,
  ShieldCheck,
  Globe,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Edit3,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { VisualReferenceModal } from '../visuals/VisualReferenceModal';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';
import { triggerWelcomeToLoginCelebration } from '../../utils/celebration';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    triggerWelcomeToLoginCelebration();
    navigate('/login');
  };
  const {
    metrics,
    customImages,
    hiddenSlideIds,
    addCustomImage,
    updateCustomImage,
    removeCustomImage,
    clearCustomImages,
    toggleHideSlide,
    restoreAllSlides,
    showToast,
  } = useApp();
  const { language, toggleLanguage } = useLanguage();
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [galleryCategory, setGalleryCategory] = useState<
    'artisan' | 'menue' | 'hunar' | 'landscape' | 'community'
  >('artisan');
  const [galleryCaption, setGalleryCaption] = useState('');

  // ---------------------------------------------------------------------------
  // 5-Second Automatic Image Slideshow Carousel State & Full-Screen Lightbox
  // ---------------------------------------------------------------------------
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editCaptionValue, setEditCaptionValue] = useState('');

  // Platform Heritage Slides for Carousel
  const baseHeritageSlides = [
    {
      id: 'slide-1',
      title: 'Historic Sandstone & Pakistani Architecture',
      category: 'Pakistani Heritage & Landscapes',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl,
      caption: 'Historic Mughal sandstone architecture showcasing rich Pakistani civic heritage.',
      isCustom: false,
    },
    {
      id: 'slide-2',
      title: 'Multani Kashikari Hand-Glazed Pottery',
      category: 'HOMECEO HUNAR Crafts',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.pakistani_pottery.imageUrl,
      caption: 'Cobalt blue and turquoise earthenware fired by Multan ceramics master artisans.',
      isCustom: false,
    },
    {
      id: 'slide-3',
      title: 'Sargodha Sun-Cured Chaunsa Mango Preserves',
      category: 'HOMECEO MENUE Artisanal Food',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.pakistani_food.imageUrl,
      caption: 'Sun-matured green mangoes in cold-pressed mustard oil with kalonji and fennel.',
      isCustom: false,
    },
    {
      id: 'slide-4',
      title: 'Sindhi Natural Indigo Block-Printed Ajrak',
      category: 'Ancestral Block Printing',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.sindhi_ajrak.imageUrl,
      caption: '14-stage natural dye Ajrak cloth crafted using river mud and indigo in Sindh.',
      isCustom: false,
    },
    {
      id: 'slide-5',
      title: 'Lahore Old City Community Commerce & Spice Bazaars',
      category: 'Community Enterprise',
      imageUrl: OFFICIAL_VISUAL_LIBRARY.bazaar_commerce.imageUrl,
      caption: 'Grassroots community exchange connecting domestic enterprise households to wider city markets.',
      isCustom: false,
    },
  ];

  // Format clean title for custom uploaded slides
  const formatCleanTitle = (rawName: string, caption?: string) => {
    if (caption && !caption.toLowerCase().includes('screenshot')) return caption;
    if (rawName && rawName.toLowerCase().includes('screenshot')) {
      return 'Pakistani Heritage & Intergenerational Network Asset';
    }
    return rawName ? rawName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Pakistani Heritage Asset';
  };

  // Raw pool of all platform slides
  const fullSlidesPool = [
    ...customImages.map((img) => ({
      id: img.id,
      title: formatCleanTitle(img.name, img.caption),
      category: `Custom Saved · ${img.category.toUpperCase()}`,
      imageUrl: img.dataUrl,
      caption: img.caption && !img.caption.toLowerCase().includes('screenshot')
        ? img.caption
        : 'Community-led companion network empowering Pakistani elder women through dignified enterprise.',
      isCustom: true,
    })),
    ...baseHeritageSlides,
  ];

  // Active slides selected to remain in the 5-second rotation loop
  const activeSlides = fullSlidesPool.filter((slide) => !hiddenSlideIds.includes(slide.id));
  const allSlides = activeSlides.length > 0 ? activeSlides : fullSlidesPool;

  // 5-Second Slide Transition Timer
  useEffect(() => {
    if (!isAutoPlaying || allSlides.length === 0 || isLightboxOpen) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % allSlides.length);
    }, 5000); // 5-second slide view timer

    return () => clearInterval(timer);
  }, [isAutoPlaying, allSlides.length, isLightboxOpen]);

  const activeSlide = allSlides[currentSlideIndex] || allSlides[0];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % allSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  };

  // Image Upload with Client-Side HTML5 Canvas Compression
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onerror = () => {
        showToast(`Could not read file ${file.name}.`, 'warning');
      };
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        const img = new Image();
        img.onerror = () => {
          addCustomImage({
            name: file.name,
            dataUrl: rawDataUrl,
            category: galleryCategory,
            caption: galleryCaption.trim() || `${file.name.replace(/\.[^/.]+$/, '')} · Pakistani Asset`,
          });
        };

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 900;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            addCustomImage({
              name: file.name,
              dataUrl: compressedDataUrl,
              category: galleryCategory,
              caption: galleryCaption.trim() || `${file.name.replace(/\.[^/.]+$/, '')} · Pakistani Asset`,
            });
          } else {
            addCustomImage({
              name: file.name,
              dataUrl: rawDataUrl,
              category: galleryCategory,
              caption: galleryCaption.trim() || `${file.name.replace(/\.[^/.]+$/, '')} · Pakistani Asset`,
            });
          }
        };

        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });

    setGalleryCaption('');
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = '';
    }
    showToast('Platform visual asset uploaded & added to 5-second slideshow!', 'success', 'Asset Saved');
  };

  // 4 Core Pillars in PAK-HOMECEO Palette (Terracotta #C05638, Ochre #D9822B, Indigo #1E293B, Forest Green #01411C)
  const enterprisePillars = [
    {
      id: 'hunar',
      code: 'HOMECEO HUNAR',
      titleEn: 'Crafts & Heritage Textiles',
      titleUr: 'دستکاری اور ہنر',
      colorAccent: 'border-[#C05638] text-[#C05638] hover:bg-[#C05638]/5',
      badgeBg: 'bg-[#C05638]/10 text-[#C05638] border-[#C05638]/30',
      tag: 'Craft Mastery',
    },
    {
      id: 'menue',
      code: 'HOMECEO MENUE',
      titleEn: 'Natural Food Preserves',
      titleUr: 'گھریلو غذائی کاروبار',
      colorAccent: 'border-[#D9822B] text-[#D9822B] hover:bg-[#D9822B]/5',
      badgeBg: 'bg-[#D9822B]/10 text-[#D9822B] border-[#D9822B]/30',
      tag: 'Culinary Enterprise',
    },
    {
      id: 'knowledge',
      code: 'HOMECEO KNOWLEDGE',
      titleEn: 'Generational Craft Knowledge',
      titleUr: 'حکمت اور علم',
      colorAccent: 'border-[#1E293B] text-[#1E293B] hover:bg-[#1E293B]/5',
      badgeBg: 'bg-stone-200 text-[#1E293B] border-stone-300',
      tag: 'Living Heritage',
    },
    {
      id: 'services',
      code: 'HOMECEO SERVICES',
      titleEn: 'Doorstep Community Finishing',
      titleUr: 'کمیونٹی خدمات',
      colorAccent: 'border-[#01411C] text-[#01411C] hover:bg-[#01411C]/5',
      badgeBg: 'bg-emerald-100 text-[#01411C] border-emerald-300',
      tag: 'Field Trust',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] font-sans selection:bg-[#01411C]/20 selection:text-[#01411C]">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC MINIMALIST HERO: Pakistani Landscape Photography              */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0F172A] text-white">
        {/* Pakistani Landscape Photography Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl}
            alt="Pakistani Landscape Photography"
            className="w-full h-full object-cover object-center scale-105 filter brightness-70 contrast-110"
          />
          {/* Executive Gradients (Terracotta, Indigo, Emerald) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/75 to-[#0F172A]/85 backdrop-blur-[0.5px]" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#01411C]/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#C05638]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D9822B]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Header */}
        <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] border border-[#BBF7D0]/40 flex items-center justify-center text-white shadow-lg backdrop-blur-md">
              <span className="font-mono font-extrabold text-sm tracking-tighter">PK</span>
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block leading-none font-sans">
                PAK-HOMECEO
              </span>
              <span className="text-[10px] text-stone-300 font-sans tracking-wide block mt-1">
                Women-Led Domestic Enterprise Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-bold text-stone-200 hover:text-white px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              <span className="text-[10px] text-[#86EFAC] font-mono mr-1">LANG:</span>
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            <Button
              onClick={handleEnterPlatform}
              variant="executiveGreen"
              size="sm"
              className="font-bold bg-[#01411C] hover:bg-[#025927] text-white border border-[#BBF7D0]/40 shadow-md py-1.5 cursor-pointer"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </header>

        {/* Minimalist Centered Vision Statement */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8 my-auto">
          {/* Streamlined Core Vision */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans text-balance">
              Every Home Can Become an Enterprise.{' '}
              <span className="text-[#86EFAC] block sm:inline">
                Every Woman Can Become a CEO.
              </span>
            </h1>

            <p className="text-base sm:text-2xl font-serif text-amber-200/95 font-medium tracking-wide pt-2">
              ہر گھر ایک باوقار کاروبار بن سکتا ہے۔ ہر خاتون ایک بااختیار سربراہ بن سکتی ہے۔
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleEnterPlatform}
              variant="executiveGreen"
              size="lg"
              className="font-bold shadow-2xl bg-[#01411C] hover:bg-[#025927] text-white px-8 py-3.5 border border-[#BBF7D0]/40 text-sm sm:text-base w-full sm:w-auto cursor-pointer"
            >
              <span>Get Started & Choose Role</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="relative z-20 pb-6 text-center text-[10px] text-stone-400 font-mono tracking-widest uppercase">
          <span>PAKISTAN domestic ENTERPRISE OPERATING SYSTEM</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* RESEARCH NARRATIVE: THE QUIET PROBLEM & THE CORE IDEA                     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center font-sans">
          
          {/* Header Badge */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#C05638] bg-[#C05638]/10 px-3.5 py-1 rounded-full border border-[#C05638]/30 inline-block">
              Deep Research & Human Reality · پاکستان میں ہماری ماؤں کا مسئلہ
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1A2E22] tracking-tight font-sans">
              The Quiet Problem
            </h2>
          </div>

          {/* Core Narrative Prose */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-stone-200/90 shadow-2xs space-y-5 text-left max-w-4xl mx-auto font-sans leading-relaxed">
            <p className="text-base sm:text-lg text-[#1A2E22] font-medium leading-relaxed font-serif italic border-l-4 border-[#01411C] pl-4 sm:pl-6 py-1">
              "Think of a woman who has spent decades cooking, stitching, teaching and holding a family together. Then her husband passes away. Her children love her, but they are busy building lives of their own. The house grows quiet, and so do the questions: <span className="not-italic font-bold text-[#01411C]">What do you know? What could you teach us?</span>"
            </p>

            <p className="text-sm sm:text-base text-[#4A5D52] leading-relaxed">
              Her skill has not gone anywhere. Neither has her need to belong, to matter and to feel useful. When all three fade at once, loneliness is not just a feeling — it is a gap in her everyday life.
            </p>
          </div>

          {/* Key Demographic Research Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 text-center space-y-2 shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#01411C] font-mono block">
                ~7%
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22]">
                14 to 17 Million People
              </h4>
              <p className="text-[11px] text-[#4A5D52]">
                About 7% of Pakistanis are over 60 years old.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 text-center space-y-2 shadow-2xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#C05638] font-mono block">
                ~2.3%
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22]">
                Pension Coverage
              </h4>
              <p className="text-[11px] text-[#4A5D52]">
                Only ~2.3% pension coverage for older citizens.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-5 text-center space-y-2 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D9822B] font-mono block">
                More Alone
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22]">
                Demographic Shift
              </h4>
              <p className="text-[11px] text-[#4A5D52]">
                Smaller families and city moves mean more women will age alone.
              </p>
            </div>
          </div>

          {/* The Core Idea Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#01411C] text-white border-2 border-[#86EFAC]/40 shadow-xl max-w-4xl mx-auto space-y-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#86EFAC] bg-black/40 px-3 py-1 rounded-full border border-[#86EFAC]/30">
                The Solution Bridge
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-sans">
                The Core Idea
              </h3>
            </div>
            <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-sans font-medium">
              Two groups hold value the other needs. Experienced women have skill, time and knowledge. Young women have digital ability, energy and ambition. <strong className="text-[#86EFAC] font-extrabold">PAK-HOMECEO joins them in one business.</strong>
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 4 HOMECEO ENTERPRISE PILLARS (CLOSED CYCLIC INTERCONNECTED LOOP)   */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#01411C] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
              Closed-Loop Operating Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22] tracking-tight">
              The 4 HOMECEO Enterprise Pillars
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52]">
              A self-sustaining domestic cycle where every pillar feeds directly into the next without intermediary value leakage.
            </p>
          </div>

          {/* Interconnected Closed Cyclic Loop Diagram */}
          <div className="relative p-6 sm:p-10 bg-[#FAF9F6] rounded-3xl border border-stone-200 shadow-xs max-w-5xl mx-auto">
            {/* Desktop 2x2 Cyclic Quadrant Grid with Directional Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
              {/* Step 1: HUNAR (Top Left) */}
              <div className="bg-white rounded-2xl border-2 border-[#C05638] p-5 shadow-xs space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C05638]/10 text-[#C05638] border border-[#C05638]/30">
                    Step 1 · Craft Mastery
                  </span>
                  <span className="text-xs font-serif font-bold text-stone-800">
                    دستکاری اور ہنر
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    HOMECEO HUNAR
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1A2E22] mt-0.5">
                    Crafts & Heritage Textiles
                  </h3>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Cyclic Process Phase</span>
                  <span className="text-[#C05638] font-mono text-xs">➔ Loop 1</span>
                </div>
              </div>

              {/* Step 2: MENUE (Top Right) */}
              <div className="bg-white rounded-2xl border-2 border-[#D9822B] p-5 shadow-xs space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D9822B]/10 text-[#D9822B] border border-[#D9822B]/30">
                    Step 2 · Culinary Enterprise
                  </span>
                  <span className="text-xs font-serif font-bold text-stone-800">
                    گھریلو غذائی کاروبار
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    HOMECEO MENUE
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1A2E22] mt-0.5">
                    Natural Food Preserves
                  </h3>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Cyclic Process Phase</span>
                  <span className="text-[#D9822B] font-mono text-xs">➔ Loop 2</span>
                </div>
              </div>

              {/* Step 4: SERVICES (Bottom Left) */}
              <div className="bg-white rounded-2xl border-2 border-[#01411C] p-5 shadow-xs space-y-4 relative group md:order-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-[#01411C] border border-emerald-300">
                    Step 4 · Field Trust
                  </span>
                  <span className="text-xs font-serif font-bold text-stone-800">
                    کمیونٹی خدمات
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    HOMECEO SERVICES
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1A2E22] mt-0.5">
                    Doorstep Community Finishing
                  </h3>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Cyclic Process Phase</span>
                  <span className="text-[#01411C] font-mono text-xs">➔ Loop 4</span>
                </div>
              </div>

              {/* Step 3: KNOWLEDGE (Bottom Right) */}
              <div className="bg-white rounded-2xl border-2 border-[#1E293B] p-5 shadow-xs space-y-4 relative group md:order-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-200 text-[#1E293B] border border-stone-300">
                    Step 3 · Living Heritage
                  </span>
                  <span className="text-xs font-serif font-bold text-stone-800">
                    حکمت اور علم
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    HOMECEO KNOWLEDGE
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1A2E22] mt-0.5">
                    Generational Craft Knowledge
                  </h3>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Cyclic Process Phase</span>
                  <span className="text-[#1E293B] font-mono text-xs">➔ Loop 3</span>
                </div>
              </div>
            </div>

            {/* Central Closed Loop Ecosystem Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center w-40 h-40 rounded-full bg-white border-4 border-[#01411C] shadow-2xl text-center p-3 z-20">
              <span className="text-xs font-mono font-extrabold text-[#01411C] uppercase tracking-wider">
                CLOSED LOOP
              </span>
              <span className="text-[10px] font-bold text-stone-700 leading-tight mt-1">
                Domestic Ecosystem
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1.5">
                100% Interconnected
              </span>
            </div>

            {/* Interconnected Directional Flow Arrows */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-10">
              {/* Top Horizontal Arrow: Step 1 ➔ Step 2 */}
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 text-[#D9822B] font-extrabold text-xl font-mono flex items-center gap-1 bg-white/90 px-3 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                <span>➔</span>
              </div>
              {/* Right Vertical Arrow: Step 2 ➔ Step 3 */}
              <div className="absolute top-1/2 right-[12%] -translate-y-1/2 text-[#1E293B] font-extrabold text-xl font-mono rotate-90 bg-white/90 px-2.5 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                <span>➔</span>
              </div>
              {/* Bottom Horizontal Arrow: Step 3 ➔ Step 4 */}
              <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-[#01411C] font-extrabold text-xl font-mono flex items-center gap-1 bg-white/90 px-3 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                <span>➔</span>
              </div>
              {/* Left Vertical Arrow: Step 4 ➔ Step 1 (Loop Re-enters) */}
              <div className="absolute top-1/2 left-[12%] -translate-y-1/2 text-[#C05638] font-extrabold text-xl font-mono -rotate-90 bg-white/90 px-2.5 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                <span>➔</span>
              </div>
            </div>

            {/* Sequence Pill Bar */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 text-center text-xs font-mono text-[#01411C] font-bold tracking-wide uppercase flex flex-wrap items-center justify-center gap-2 bg-white/80 p-3 rounded-2xl border border-stone-200">
              <span>HUNAR (CRAFTS)</span>
              <span>➔</span>
              <span>MENUE (FOOD)</span>
              <span>➔</span>
              <span>KNOWLEDGE (PEDAGOGY)</span>
              <span>➔</span>
              <span>SERVICES (FINISHING)</span>
              <span className="text-[#C05638]">➔ (LOOP RE-ENTERS)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CINEMATIC COMMUNITY GALLERY & 5-SECOND SLIDESHOW TRANSITION AT BOTTOM  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-2xl space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#01411C] flex items-center justify-center text-[#86EFAC]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  PAK-HOMECEO Heritage Visual Gallery
                </h2>
              </div>
              <p className="text-xs text-stone-400">
                Click any visual to inspect in default full-screen view. Manage, edit captions, or upload custom photos to the 5-second rotation loop.
              </p>
            </div>

            {/* Upload & Manage Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsManageModalOpen(true)}
                className="text-xs text-stone-200 border-stone-700 hover:bg-stone-800"
              >
                <span>Select & Manage Images ({allSlides.length} Active)</span>
              </Button>
              <Button
                size="sm"
                variant="executiveGreen"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => galleryFileInputRef.current?.click()}
                className="text-xs"
              >
                Upload Photo
              </Button>
            </div>
          </div>

          {/* 5-SECOND AUTOMATIC CINEMATIC SLIDESHOW PLAYER */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 min-h-[480px] sm:min-h-[560px] shadow-2xl group flex flex-col justify-between p-4 sm:p-6 cursor-pointer"
          >
            {/* Pure Image in Default Full View (No Overlays, 100% Readable Text inside Image) */}
            {activeSlide && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center p-2 sm:p-4 bg-stone-950">
                <img
                  key={activeSlide.id}
                  src={activeSlide.imageUrl}
                  alt={activeSlide.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl;
                  }}
                  className="max-h-full max-w-full object-contain brightness-100 transition-transform duration-500 ease-in-out rounded-2xl shadow-2xl"
                />
              </div>
            )}

            {/* Top Slide Badge & Fullscreen Controls */}
            <div className="relative z-10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 border border-white/20 text-[#86EFAC] backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{activeSlide?.category || 'Pakistani Visual Asset'}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-2.5 rounded-xl bg-black/70 border border-white/20 text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-md"
                  title="Expand Full-Screen View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2.5 rounded-xl bg-black/70 border border-white/20 text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-md"
                  title={isAutoPlaying ? 'Pause Timer' : 'Play Timer'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-[10px] font-mono font-bold text-stone-300 bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                  {currentSlideIndex + 1} / {allSlides.length}
                </span>
              </div>
            </div>

            {/* Bottom Controls: Prev / Next Navigation ONLY (No Text Box Overlay) */}
            <div className="relative z-10 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="p-3 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="p-3 rounded-xl bg-[#01411C] hover:bg-[#025927] border border-[#86EFAC]/40 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          </div>

        {/* Clean Call to Action */}
        <div className="text-center space-y-4 max-w-xl mx-auto pt-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22]">
            Ready to Enter PAK-HOMECEO?
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5D52]">
            Select your role to explore the live closed-loop domestic enterprise system.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleEnterPlatform}
              variant="executiveGreen"
              size="lg"
              className="font-bold shadow-md hover:shadow-lg w-full sm:w-auto cursor-pointer"
            >
              <span>Get Started & Choose Role</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FULL-SCREEN LIGHTBOX MODAL FOR CLICKED GALLERY IMAGES                   */}
      {/* ========================================================================= */}
      {isLightboxOpen && activeSlide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 font-sans"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col justify-between space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Close Button */}
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#86EFAC] px-2.5 py-0.5 rounded bg-[#01411C] border border-[#86EFAC]/30">
                  {activeSlide.category}
                </span>
                <h3 className="text-lg font-extrabold mt-1">{activeSlide.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Close Full Screen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* High-Resolution Centered Image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = OFFICIAL_VISUAL_LIBRARY.pakistan_landscape.imageUrl;
                }}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Prev / Next Floating Navigation */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Caption & Action Bar */}
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
              <div className="space-y-1 max-w-2xl font-sans w-full">
                {isEditingCaption && activeSlide.isCustom ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editCaptionValue}
                      onChange={(e) => setEditCaptionValue(e.target.value)}
                      placeholder="Enter new image title/caption..."
                      className="flex-1 px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl focus:outline-none focus:border-[#86EFAC]"
                    />
                    <Button
                      size="sm"
                      variant="executiveGreen"
                      className="text-xs"
                      onClick={() => {
                        if (editCaptionValue.trim()) {
                          updateCustomImage(activeSlide.id, { caption: editCaptionValue.trim() });
                          setIsEditingCaption(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCaption(false)}
                      className="text-xs text-stone-400 hover:text-white px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {activeSlide.caption}
                    </p>
                    {activeSlide.isCustom && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditCaptionValue(activeSlide.caption || '');
                          setIsEditingCaption(true);
                        }}
                        className="text-[11px] font-bold text-[#86EFAC] hover:underline flex items-center gap-1 shrink-0 bg-stone-800 px-2 py-1 rounded-lg border border-stone-700"
                        title="Edit Caption"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Title</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {activeSlide.isCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      removeCustomImage(activeSlide.id);
                      setIsEditingCaption(false);
                      if (allSlides.length <= 1) {
                        setIsLightboxOpen(false);
                      } else {
                        handleNextSlide();
                      }
                    }}
                    className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Delete Saved Image"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Image</span>
                  </button>
                )}

                <Button
                  onClick={() => {
                    setIsLightboxOpen(false);
                    navigate('/login');
                  }}
                  variant="executiveGreen"
                  size="sm"
                  className="font-bold"
                >
                  <span>Enter Ecosystem</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 font-sans">
        PAK-HOMECEO · Transforming Home Skills into Dignity, Income, and Purpose across Pakistan.
      </footer>

      {/* ========================================================================= */}
      {/* 5. MANAGE GALLERY & IMAGE SELECTION MODAL                                 */}
      {/* ========================================================================= */}
      {isManageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans"
          onClick={() => setIsManageModalOpen(false)}
        >
          <div
            className="relative bg-stone-900 border border-stone-800 text-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col justify-between p-6 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#86EFAC] px-2.5 py-0.5 rounded bg-[#01411C] border border-[#86EFAC]/30">
                  Gallery Asset Manager
                </span>
                <h3 className="text-xl font-extrabold mt-1">Select & Manage Platform Images</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Toggle selection to keep or hide images in the 5-second rotation slideshow loop, or permanently delete custom uploaded images.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Selection Grid */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fullSlidesPool.map((slide) => {
                  const isHidden = hiddenSlideIds.includes(slide.id);
                  return (
                    <div
                      key={slide.id}
                      className={`relative rounded-2xl border p-3 flex flex-col justify-between space-y-3 transition-all ${
                        isHidden
                          ? 'bg-stone-950/80 border-stone-800 opacity-60'
                          : 'bg-stone-800/80 border-[#01411C] ring-1 ring-[#86EFAC]/30'
                      }`}
                    >
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-black">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2 left-2 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded backdrop-blur-md ${
                            slide.isCustom
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                              : 'bg-black/70 text-stone-300 border border-white/20'
                          }`}
                        >
                          {slide.isCustom ? 'Custom Uploaded' : 'Platform Heritage'}
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-white truncate">{slide.title}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed font-sans">
                          {slide.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleHideSlide(slide.id)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isHidden
                              ? 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                              : 'bg-[#01411C] text-[#86EFAC] border border-[#86EFAC]/40'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isHidden ? 'Hidden (Click to Keep)' : 'Active in Loop'}</span>
                        </button>

                        {slide.isCustom && (
                          <button
                            type="button"
                            onClick={() => removeCustomImage(slide.id)}
                            className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 transition-all cursor-pointer"
                            title="Permanently Delete Custom Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
              <div className="flex flex-wrap items-center gap-3">
                <span>{allSlides.length} active slide(s) in rotation loop</span>
                {customImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      clearCustomImages();
                      showToast('Cleared non-heritage custom uploads. Gallery reset to pure authentic Pakistani visual assets.', 'info', 'Gallery Cleaned');
                    }}
                    className="text-amber-400 hover:text-amber-300 hover:underline font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30 cursor-pointer"
                  >
                    Reset & Remove Custom Uploads ({customImages.length})
                  </button>
                )}
                {hiddenSlideIds.length > 0 && (
                  <button
                    type="button"
                    onClick={restoreAllSlides}
                    className="text-[#86EFAC] hover:underline font-bold"
                  >
                    Restore Hidden Slides
                  </button>
                )}
              </div>

              <Button
                variant="executiveGreen"
                size="sm"
                onClick={() => setIsManageModalOpen(false)}
                className="font-bold shrink-0"
              >
                <span>Done & Save Selection</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Official Visual Reference Modal */}
      <VisualReferenceModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
      />
    </div>
  );
};
