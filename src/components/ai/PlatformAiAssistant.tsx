import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  User,
  ShieldCheck,
  HelpCircle,
  ShoppingBag,
  Clock,
  ArrowRight,
  Layers,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Radio,
  Search,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  urduText?: string;
  timestamp: string;
  isVoiceInput?: boolean;
  groundingSources?: Array<{ title?: string; uri?: string }>;
}

export const PlatformAiAssistant: React.FC = () => {
  const {
    products,
    orders,
    currentRole,
    currentUser,
    skillPartners,
    batches,
    showToast,
    sendMessage,
  } = useApp();
  const { language, setLanguage, t, isRtl } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-welcome',
      sender: 'ai',
      text:
        'As-salamu alaykum! I am the PAK-HOMECEO AI Voice & Strategic Assistant. I provide real-time guidance in English and Urdu (اردو) for artisans, business builders, connectors, and citizens.',
      urduText:
        'السلام علیکم! میں پاک-ہوم سی ای او کا باوقار مصنوعی ذہانت معاون ہوں۔ میں کاریگر ماؤں بہنوں، بزنس بلڈرز اور شہریوں کی رہنمائی اردو اور انگریزی آواز میں کرتا ہوں۔',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech synthesis / Audio playback in Urdu or English
  const speakText = (text: string) => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !voicePlaybackEnabled) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Detect if text contains Urdu characters
      const hasUrdu = /[\u0600-\u06FF]/.test(text);
      utterance.lang = hasUrdu ? 'ur-PK' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis warning:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      // ignore
    }
    setIsSpeaking(false);
  };

  // Quick suggestions based on role
  const getSuggestions = () => {
    if (currentRole === 'partner') {
      return [
        { en: 'Explain my active craft task in Urdu', ur: 'میرے کام کی تفصیل اردو میں بتائیں' },
        { en: 'When will raw materials arrive?', ur: 'میرا خام مال کب پہنچے گا؟' },
        { en: 'How are artisan earnings settled?', ur: 'میری کمائی کیسے ٹرانسفر ہوگی؟' },
      ];
    }
    if (currentRole === 'builder') {
      return [
        { en: 'Show unallocated citizen briefs', ur: 'نئے آرڈرز اور بریف دکھائیں' },
        { en: 'Batch scheduling optimization', ur: 'بیچ بنانے اور پروڈکشن کی تجاویز' },
        { en: 'Escrow payout settlement criteria', ur: 'ادائیگی ریلیز کرنے کی شرائط' },
      ];
    }
    if (currentRole === 'connector') {
      return [
        { en: '6-point doorstep QC audit checklist', ur: 'کوالٹی چیک کی 6 اہم شرائط' },
        { en: 'Record raw material drop-off', ur: 'خام مال پہنچانے کا اندراج' },
      ];
    }
    return [
      { en: 'Find authentic Multani embroidery', ur: 'ملتانی کشیدہ کاری کی شالیں دکھائیں' },
      { en: 'How does ~70% artisan payout work?', ur: 'کاریگر کا 70 فیصد معاوضہ کیسے ملتا ہے؟' },
      { en: 'Help me write an Order Brief', ur: 'آرڈر بریف لکھنے کا طریقہ' },
      { en: 'Track my recent order', ur: 'میرے آرڈر کا اسٹیٹس' },
    ];
  };

  // Human escalation
  const handleEscalateToHuman = () => {
    sendMessage({
      recipientId: 'demo-builder',
      recipientName: 'Zainab Malik',
      recipientRole: 'builder',
      topic: `AI Escalation: Inquiry from ${currentUser.name} (${currentUser.role})`,
      content: `User requested human manager intervention via AI Assistant for order or workflow support.`,
      priority: 'urgent',
    });

    const botReply: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text:
        'I have escalated your request directly to Product Manager Zainab Malik (Lahore Hub) and Field Coordinator Fatima Zehra. A team member will follow up promptly via your registered contact.',
      urduText:
        'میں نے آپ کی درخواست براہ راست پروڈکٹ منیجر زینب ملک اور فیلڈ کوآرڈینیٹر فاطمہ زہرہ کو بھیج دی ہے۔ جلد ہی آپ سے رابطہ کیا جائے گا۔',
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, botReply]);
    speakText(botReply.urduText || botReply.text);
    showToast('Inquiry escalated to human operations team.', 'info', 'Escalated');
  };

  // Submit User Message to Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const conversationHistory = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));
      conversationHistory.push({ role: 'user', content: query });

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          userRole: currentRole,
          language: language,
          useSearch: useSearchGrounding,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const botText = data.text || 'Assalamu Alaikum. How can I assist you with PAK-HOMECEO today?';

      const sources = data.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri,
      })).filter((s: any) => s.uri);

      const botMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: botText,
        timestamp: 'Just now',
        groundingSources: sources?.length ? sources : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (voicePlaybackEnabled) {
        speakText(botText);
      }
    } catch (err: any) {
      console.warn('API error, using local fallback:', err);
      // Local fallback for offline / mock support
      const fallbackReply = generateLocalFallback(query);
      setMessages((prev) => [...prev, fallbackReply]);
      if (voicePlaybackEnabled) {
        speakText(fallbackReply.urduText || fallbackReply.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalFallback = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    if (q.includes('order brief') || q.includes('بریف') || q.includes('customiz')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'The Order Brief allows citizens to submit specific custom dimensions, color choices, and delivery timelines. Once placed, it lands immediately in the Business Builder control inbox.',
        urduText: 'آرڈر بریف کے ذریعے شہری اپنی پسند کے مطابق رنگ، سائز اور تاریخ کا انتخاب کرتے ہیں، جو فوراً پروڈکٹ منیجر کو تفویض کے لیے پہنچ جاتا ہے۔',
        timestamp: 'Just now',
      };
    }
    if (q.includes('70%') || q.includes('earning') || q.includes('کمائی') || q.includes('پیسے')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'PAK-HOMECEO ensures ~70% direct payment goes straight into the woman maker’s JazzCash or Easypaisa wallet upon doorstep delivery.',
        urduText: 'پاک-ہوم سی ای او کے ذریعے 70 فیصد معاوضہ براہ راست خاتون کاریگر کے موبائل اکاؤنٹ میں شفاف طریقے سے پہنچایا جاتا ہے۔',
        timestamp: 'Just now',
      };
    }
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Assalamu Alaikum! I am here to assist your ${currentRole} operations on PAK-HOMECEO. Feel free to ask in Urdu or English.`,
      urduText: 'السلام علیکم! میں پاک-ہوم سی ای او پر آپ کی مکمل مدد کے لیے حاضر ہوں۔ آپ بلا جھجھک اردو یا انگریزی میں پوچھ سکتے ہیں۔',
      timestamp: 'Just now',
    };
  };

  // Voice recording & Speech-to-text (Web Speech Recognition + Gemini fallback)
  const startRecording = async () => {
    // Attempt Web Speech Recognition for instant zero-latency transcription
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          showToast('Listening... Speak now in Urdu or English.', 'info', 'Voice Input Active');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
          startMediaRecorderFallback();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed, falling back to MediaRecorder:', err);
      }
    }

    startMediaRecorderFallback();
  };

  const startMediaRecorderFallback = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        showToast('Microphone access is not supported in this browser context.', 'warning');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Data = reader.result as string;
            try {
              setIsLoading(true);
              const res = await fetch('/api/ai/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Data,
                  mimeType: 'audio/webm',
                }),
              });
              const data = await res.json();
              if (data.text) {
                handleSendMessage(data.text);
              }
            } catch (e) {
              console.error('Transcription error:', e);
              showToast('Voice transcription service unavailable. Type your message.', 'warning');
            } finally {
              setIsLoading(false);
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error('Audio processing error:', err);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      showToast('Listening... Speak in Urdu or English.', 'info', 'Recording Voice');
    } catch (err) {
      console.warn('Microphone access error:', err);
      showToast('Microphone access is needed for voice input.', 'warning');
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      // ignore
    }
    setIsRecording(false);
  };

  return (
    <>
      {/* Floating AI Assistant Trigger Pill */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#01411C] hover:bg-[#025927] text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border border-[#BBF7D0]/40 group"
          title="Open PAK-HOMECEO AI Voice & Strategic Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <span className="text-xs font-extrabold block tracking-tight">
              AI Voice & Guide
            </span>
            <span className="text-[10px] text-amber-200/90 font-serif">
              اردو / English Assistant
            </span>
          </div>
        </button>
      </div>

      {/* AI Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[85vh] h-[640px] bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#01411C] via-[#045025] to-[#1E3A8A] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight leading-none">
                    PAK-HOMECEO AI Assistant
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 font-bold">
                    Gemini Live
                  </span>
                </div>
                <p className="text-[10px] text-stone-200 mt-1 font-serif">
                  صوتی اور تحریری رہنمائی · Voice & Text
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice playback toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoicePlaybackEnabled(!voicePlaybackEnabled);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  voicePlaybackEnabled ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:bg-white/10'
                }`}
                title={voicePlaybackEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {voicePlaybackEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#86EFAC]" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Close Drawer */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Speaking Active Indicator */}
          {isSpeaking && (
            <div className="bg-emerald-900 text-emerald-100 text-[11px] font-bold px-4 py-1.5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>AI is speaking in Urdu/English...</span>
              </div>
              <button
                type="button"
                onClick={stopSpeaking}
                className="text-[10px] text-amber-300 hover:underline cursor-pointer"
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-[#01411C] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-[#01411C] text-white rounded-br-xs'
                      : 'bg-white text-stone-900 border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {m.urduText && m.sender === 'ai' && (
                    <div className="pt-2 border-t border-stone-100 font-serif text-right text-stone-700 text-xs leading-relaxed" dir="rtl">
                      {m.urduText}
                    </div>
                  )}

                  {/* Grounding Source Citations */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 text-[10px] space-y-1">
                      <span className="font-bold text-stone-500 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-blue-600" />
                        <span>Google Search Grounding Data:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.groundingSources.slice(0, 2).map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 hover:underline truncate max-w-[200px]"
                          >
                            {s.title || 'Verified Web Source'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 text-xs p-2">
                <div className="w-6 h-6 rounded-lg bg-[#01411C]/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#01411C] animate-spin" />
                </div>
                <span>Gemini is generating bilingual response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Urdu & English Prompt Chips */}
          <div className="p-2.5 bg-white border-t border-stone-100 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
            {getSuggestions().map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(s.ur || s.en)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#F0FDF4] hover:text-[#01411C] hover:border-[#BBF7D0] border border-stone-200 text-[11px] font-medium text-stone-700 whitespace-nowrap transition-all cursor-pointer"
              >
                {language === 'ur' ? s.ur : s.en}
              </button>
            ))}
          </div>

          {/* Search Toggle & Human Escalation Toolbar */}
          <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-600">
            <button
              type="button"
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                useSearchGrounding
                  ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Search className="w-3 h-3 text-blue-600" />
              <span>Search Grounding: {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={handleEscalateToHuman}
              className="font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Talk to Human Manager</span>
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            {/* Mic Voice Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-[#F0FDF4] hover:text-[#01411C]'
              }`}
              title={isRecording ? 'Stop Recording' : 'Voice Input (Urdu/English)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isRecording ? 'Recording voice...' : 'Type in Urdu or English (اردو میں لکھیں)...'}
              className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
            />

            <Button
              type="submit"
              variant="executiveGreen"
              size="sm"
              disabled={isLoading || !inputText.trim()}
              className="py-2 px-3"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
