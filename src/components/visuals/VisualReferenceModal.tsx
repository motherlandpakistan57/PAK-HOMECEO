import React, { useState } from 'react';
import {
  OFFICIAL_VISUAL_LIBRARY,
  OFFICIAL_MASTER_SLIDES,
  VisualReferenceItem,
} from '../../data/visualLibrary';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Info,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

interface VisualReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualReferenceModal: React.FC<VisualReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'mappings' | 'slides'>('mappings');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const libraryItems = Object.values(OFFICIAL_VISUAL_LIBRARY);
  const filteredItems =
    selectedCategory === 'ALL'
      ? libraryItems
      : libraryItems.filter((item) => item.category === selectedCategory);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200/90 bg-[#FAF9F6] flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#01411C] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                Official Reference Standard
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                PAK-HOMECEO Visual Identity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22] tracking-tight">
              Official Visual Reference Library
            </h2>
            <p className="text-xs text-[#4A5D52]">
              Strictly mapped contextually across Home → Woman → Skill → Product → Citizen → Enterprise.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs between 9 Contextual Mappings & 8 Master Slides */}
        <div className="px-6 pt-3 border-b border-stone-200 bg-white flex items-center justify-between gap-4 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('mappings')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'mappings'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              9 Contextual Mappings
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('slides')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'slides'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              8 Master Brand Slides
            </button>
          </div>

          <div className="text-[11px] text-[#01411C] font-semibold flex items-center gap-1.5 py-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Preserving Cultural Accuracy & Artisan Dignity</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-stone-50/50">
          {/* TAB 1: 9 CONTEXTUAL MAPPINGS */}
          {activeTab === 'mappings' && (
            <div className="space-y-5">
              {/* Dignity and Mapping Rules Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950">
                <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Authentic Pakistani Mapping Protocol:</p>
                  <p className="text-[#4A5D52]">
                    Photographs are never randomly reused. Each image corresponds strictly to its real craft, role, and cultural geography.
                    No poverty imagery is permitted; women are portrayed as capable entrepreneurs, creators, and knowledge holders.
                  </p>
                </div>
              </div>

              {/* Grid of Mapped Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Preview with Aspect Ratio */}
                      <div className="aspect-16/10 relative overflow-hidden bg-stone-100">
                        <img
                          src={item.imageUrl}
                          alt={item.titleEn}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#01411C]/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                          Mapping 0{idx + 1}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                          Fictional Demo Ref
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#01411C]">
                            {item.category.replace('_', ' ')}
                          </span>
                          <h3 className="font-extrabold text-sm text-[#1A2E22] mt-0.5">
                            {item.titleEn}
                          </h3>
                          <p className="text-xs text-amber-950 font-serif text-right mt-1">
                            {item.titleUr}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-[#4A5D52]">
                          <div>
                            <strong className="text-stone-700">Platform Context:</strong>
                            <p className="text-[11px] text-stone-600 mt-0.5">{item.contextUsage}</p>
                          </div>
                          <div>
                            <strong className="text-stone-700">Cultural Fidelity:</strong>
                            <p className="text-[11px] text-stone-500 italic mt-0.5">{item.culturalNotes}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-[11px] font-medium text-stone-600">
                        <span>Role Perspective:</span>
                        <strong className="text-[#01411C] capitalize">{item.mappedRole}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 8 MASTER BRAND SLIDES */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#01411C]">
                  Official Visual Identity Deck
                </span>
                <h3 className="text-lg font-extrabold text-[#1A2E22]">
                  The 8 Master Brand Narratives
                </h3>
                <p className="text-xs text-[#4A5D52]">
                  Uploaded by platform leadership as the definitive cultural, social, and operational reference.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {OFFICIAL_MASTER_SLIDES.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-[#01411C] transition-colors space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#01411C] border border-[#BBF7D0]">
                          Slide #{slide.slideNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          Master Theme
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-[#1A2E22]">
                        {slide.titleEn}
                      </h4>
                      <p className="text-xs text-amber-950 font-serif text-right -mt-1">
                        {slide.titleUr}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-2">
                        <p className="text-xs font-medium text-[#1A2E22] italic leading-relaxed">
                          "{slide.quoteEn}"
                        </p>
                        <p className="text-xs text-amber-950 font-serif text-right leading-relaxed pt-1.5 border-t border-stone-200/60">
                          "{slide.quoteUr}"
                        </p>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        <strong>Visual Composition:</strong> {slide.visualDescription}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-[#01411C] font-bold">Context Key:</span>
                      <span className="font-mono text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {slide.contextKey}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200/90 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-stone-500 font-sans">
            PAK-HOMECEO Visual Standards: Terracotta · Warm Ochre · Deep Indigo · Ivory · Forest Green
          </p>
          <Button variant="executiveGreen" size="sm" onClick={onClose}>
            Close Reference Library
          </Button>
        </div>
      </div>
    </div>
  );
};
