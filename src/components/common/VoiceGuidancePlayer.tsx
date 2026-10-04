import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface VoiceGuidancePlayerProps {
  scriptText: string;
  artisanName?: string;
  urduText?: string;
  autoPlay?: boolean;
}

export const VoiceGuidancePlayer: React.FC<VoiceGuidancePlayerProps> = ({
  scriptText,
  artisanName = 'Kalsoom Bibi',
  urduText = 'السلام علیکم کلثوم بی بی! آپ کے کڑھائی والے کام کے خام مال کی ترسیل فاطمہ زہرہ کے ذریعے پہنچ چکی ہے۔ کام مکمل ہونے پر تصدیق کا بٹن دبائیں۔',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'urdu' | 'english'>('urdu');

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
    }
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = selectedLanguage === 'urdu' ? urduText : scriptText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        if (selectedLanguage === 'urdu') {
          utterance.lang = 'ur-PK';
        }
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlaying(false), 5000);
      }
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="bg-[#FAF9F6] border-2 border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#01411C]/10 text-[#01411C] flex items-center justify-center shrink-0 border border-[#01411C]/20">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold tracking-wider text-[#1A2E22] uppercase font-sans">
                Voice Guidance System · صوتی رہنمائی
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#01411C] text-white">
                Urdu Active
              </span>
            </div>
            <p className="text-xs text-[#4A5D52] mt-0.5">
              Spoken audio instruction & verbal reassurance for {artisanName}
            </p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedLanguage('urdu')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedLanguage === 'urdu'
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            اردو (Urdu)
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('english')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedLanguage === 'english'
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Script display box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-4 relative shadow-xs">
        {selectedLanguage === 'urdu' ? (
          <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed text-right font-serif dir-rtl">
            "{urduText}"
          </p>
        ) : (
          <p className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed italic">
            "{scriptText}"
          </p>
        )}

        {isPlaying && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
            <span className="text-xs font-bold text-[#01411C] uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#01411C] animate-ping" />
              <span>Voice Playback Active · صوتی رہنمائی جاری ہے</span>
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-1.5 bg-[#01411C] rounded-full animate-bounce h-3" />
              <div className="w-1.5 bg-[#01411C] rounded-full animate-bounce h-5 delay-75" />
              <div className="w-1.5 bg-[#01411C] rounded-full animate-bounce h-2 delay-150" />
              <div className="w-1.5 bg-[#01411C] rounded-full animate-bounce h-6 delay-200" />
              <div className="w-1.5 bg-[#01411C] rounded-full animate-bounce h-4 delay-300" />
            </div>
          </div>
        )}
      </div>

      {/* Action controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-extrabold transition-all shadow-sm cursor-pointer ${
            isPlaying
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : 'bg-[#01411C] text-white hover:bg-[#023517] active:scale-95'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Voice · آواز روکیں</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Aloud in Urdu · ہدایات سنیں</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="text-stone-500 hover:text-stone-900 text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-200/50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart · دوبارہ سنیں</span>
          </button>
        )}
      </div>
    </div>
  );
};
