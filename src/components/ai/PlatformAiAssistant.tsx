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
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  urduText?: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; action: () => void }>;
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
    setCurrentView,
  } = useApp();
  const { language, setLanguage, t, isRtl } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-welcome',
      sender: 'ai',
      text:
        'As-salamu alaykum! I am the PAK-HOMECEO Enterprise Assistant. I can help you find products, understand authentic artisan stories, check order statuses, prepare your order brief, or escalate directly to our human Product Managers.',
      urduText:
        'السلام علیکم! میں پاک-ہوم سی ای او کا باوقار معاون ہوں۔ میں دستکاری مصنوعات کی تلاش، کاریگر خواتین کی کہانیاں سمجھنے، آرڈر بریف تیار کرنے یا پروڈکٹ منیجر سے رابطہ کرنے میں آپ کی مدد کر سکتا ہوں۔',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Quick suggestions based on role
  const getSuggestions = () => {
    if (currentRole === 'partner') {
      return [
        { en: 'Explain my active craft task', ur: 'میرے فعال کام کی وضاحت کریں' },
        { en: 'When will raw materials arrive?', ur: 'خام مال کب پہنچے گا؟' },
        { en: 'How are artisan earnings settled?', ur: 'میری کمائی کیسے منتقل ہوتی ہے؟' },
      ];
    }
    if (currentRole === 'builder') {
      return [
        { en: 'Show unallocated orders', ur: 'غیر تفویض شدہ آرڈرز دکھائیں' },
        { en: 'How to form a production batch?', ur: 'پیداواری کھیپ کیسے بنائیں؟' },
        { en: 'Escrow release criteria', ur: 'ادائیگی جاری کرنے کی شرائط' },
      ];
    }
    return [
      { en: 'Find authentic Multani embroidery', ur: 'ملتانی کڑھائی کی شالیں دکھائیں' },
      { en: 'How does ~70% artisan split work?', ur: 'کاریگر کا 70 فیصد حصہ کیسے کام کرتا ہے؟' },
      { en: 'Track my recent order', ur: 'میرے حالیہ آرڈر کا اسٹیٹس' },
      { en: 'Help me write an Order Brief', ur: 'آرڈر بریف لکھنے میں مدد کریں' },
    ];
  };

  const handleEscalateToHuman = () => {
    sendMessage({
      recipientId: 'demo-builder',
      recipientName: 'Zainab Malik',
      recipientRole: 'builder',
      topic: `AI Escalation: Inquiry from ${currentUser.name} (${currentUser.role})`,
      content: `User requested human assistance via the AI Assistant regarding platform operations or order requirements.`,
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
    showToast('Inquiry escalated to human operations team.', 'info', 'Escalated');
  };

  const processQuery = (query: string) => {
    const q = query.toLowerCase();
    let reply = '';
    let urduReply = '';

    if (q.includes('order brief') || q.includes('questionnaire') || q.includes('customiz') || q.includes('بریف')) {
      reply =
        'The Order Brief is a concise questionnaire completed by the Citizen when ordering or pre-ordering. It captures your required quantity, custom craft specifications (thread color, size, gift notes), preferred timing (Standard 5-7 days vs Expedited vs Scheduled Batch), and delivery details. It automatically routes to the Product Manager for artisan assignment.';
      urduReply =
        'آرڈر بریف ایک جامع سوالنامہ ہے جو آرڈر یا پیشگی آرڈر کے وقت بھرا جاتا ہے۔ اس میں مطلوبہ تعداد، مخصوص ترامیم، ترجیحی وقت اور ترسیلی پتہ شامل ہوتا ہے، جو براہ راست پروڈکٹ منیجر کو تفویض کے لیے بھیجا جاتا ہے۔';
    } else if (q.includes('split') || q.includes('70%') || q.includes('fair') || q.includes('earning') || q.includes('حصہ') || q.includes('کمائی')) {
      reply =
        'PAK-HOMECEO operates on transparent home enterprise economics: approximately 70% of every product purchase is paid directly to the woman maker’s mobile wallet via secure escrow. 12% supports the young woman Business Builder, and 6% compensates the doorstep Field Connector.';
      urduReply =
        'پاک-ہوم سی ای او کے تحت ہر خریداری کا تقریباً 70 فیصد معاوضہ براہ راست خاتون کاریگر کے موبائل اکاؤنٹ میں پہنچتا ہے۔ 12 فیصد بزنس بلڈر اور 6 فیصد فیلڈ کوآرڈینیٹر کے لیے مختص ہوتا ہے۔';
    } else if (q.includes('track') || q.includes('status') || q.includes('آرڈر') || q.includes('اسٹیٹس')) {
      if (orders.length > 0) {
        const latest = orders[0];
        reply = `Your latest order (${latest.trackingNumber}) for "${latest.productTitle}" is currently in status: "${latest.status.toUpperCase()}". It is assigned to artisan ${latest.skillPartnerName} with estimated delivery by ${latest.estimatedDeliveryDate}.`;
        urduReply = `آپ کے حالیہ آرڈر (${latest.trackingNumber}) برائے "${latest.productTitle}" کا موجودہ اسٹیٹس "${latest.status}" ہے۔ کاریگر ${latest.skillPartnerName} اس پر کام کر رہی ہیں۔`;
      } else {
        reply = 'You currently have no active orders placed. Visit the Citizen Marketplace to explore handmade items and submit an order brief!';
        urduReply = 'اس وقت آپ کا کوئی فعال آرڈر موجود نہیں ہے۔ براہ کرم مارکیٹ پلیس سے خریداری کریں۔';
      }
    } else if (q.includes('multan') || q.includes('kashidakari') || q.includes('shawl') || q.includes('شال') || q.includes('ملتان')) {
      const p = products.find((x) => x.id === 'prod-1') || products[0];
      reply = `Our Multani Hand-Embroidered Kashidakari Pashmina Shawl (PKR ${p.pricePKR.toLocaleString()}) is crafted by Kalsoom Bibi in Multan. It features authentic counted-thread resham silk needlework and takes 28 hours of micro-stitching.`;
      urduReply = `ملتانی کشیدہ کاری پشمینہ شال کلثوم بی بی نے ملتان میں تیار کی ہے۔ اس میں خالص ریشم اور شیشے کا باریک کام شامل ہے اور اس کی قیمت ${p.pricePKR} روپے ہے۔`;
    } else if (q.includes('pre-order') || q.includes('preorder') || q.includes('پیشگی')) {
      reply =
        'Pre-orders enable artisans to begin crafting after minimum batch orders are gathered, ensuring zero waste and preventing artisan financial risk. Deliveries take 10-14 days with regular milestone updates.';
      urduReply =
        'پیشگی آرڈرز سے کاریگر خواتین کو پیشگی یقینی آرڈر ملتا ہے اور ضیاع نہیں ہوتا۔ پیداواری کھیپ کی ترسیل میں 10 سے 14 دن لگتے ہیں۔';
    } else if (q.includes('unallocated') || q.includes('batch') || q.includes('builder')) {
      reply = `As a Product Manager, you have ${orders.filter((o) => o.status === 'placed').length} unallocated orders awaiting review. You can review the citizen brief, assign them directly to artisans like Kalsoom Bibi or Razia Begum, and release escrow payouts upon 6-point doorstep quality verification.`;
      urduReply = `بطور پروڈکٹ منیجر، آپ کے پاس نئی درخواستیں موجود ہیں جنہیں کاریگروں کو تفویض کر کے پروڈکشن شروع کروائی جا سکتی ہے۔`;
    } else {
      reply =
        `Thank you for your question. PAK-HOMECEO empowers experienced Pakistani women to turn home skills into income and purpose. You can ask me about product stories, order briefs, or click below to escalate directly to a human coordinator.`;
      urduReply =
        `شکریہ۔ پاک-ہوم سی ای او باہنر پاکستانی خواتین کو باوقار روزگار فراہم کرتا ہے۔ آپ مصنوعات، کہانیوں، یا آرڈر کے متعلق مزید پوچھ سکتے ہیں۔`;
    }

    const newBotMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      urduText: urduReply,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newBotMsg]);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      processQuery(text.trim());
    }, 400);
  };

  return (
    <>
      {/* Floating 1-Click Launch Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="flex items-center gap-2 px-4 py-3 bg-[#01411C] hover:bg-[#025c27] text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-amber-300/40 group cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-300 block -mb-0.5">
              PAK-HOMECEO
            </span>
            <span className="text-xs font-extrabold block">
              {language === 'ur' ? 'اے آئی مددگار' : 'AI Assistant'}
            </span>
          </div>
          <span className="sm:hidden text-xs font-bold">AI</span>
        </button>
      </div>

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[420px] max-h-[82vh] h-[580px] bg-white rounded-3xl shadow-2xl border border-stone-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#01411C] via-[#025c27] to-[#1A2E22] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight">PAK-HOMECEO AI</h3>
                  <span className="text-[9px] bg-white/20 text-white font-semibold uppercase px-1.5 py-0.2 rounded-full">
                    Bilingual
                  </span>
                </div>
                <p className="text-[10px] text-stone-300">
                  {language === 'ur' ? 'اردو اور انگلش میں معاونت' : 'English & Urdu Enterprise Guidance'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Toggle English / اردو"
              >
                {language === 'en' ? 'اردو' : 'English'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Supervisory Notice */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-3.5 py-1.5 text-[10px] text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              <span>Human-supervised AI · Decisions verified by Product Managers</span>
            </span>
            <button
              type="button"
              onClick={handleEscalateToHuman}
              className="text-[10px] font-bold text-amber-950 underline hover:text-amber-800"
            >
              Contact Human
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F6] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-[#01411C] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#01411C] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{language === 'ur' && m.urduText ? m.urduText : m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-white/70' : 'text-stone-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-white border-t border-stone-200 flex gap-1.5 overflow-x-auto no-scrollbar">
            {getSuggestions().map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(language === 'ur' ? s.ur : s.en)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#F0FDF4] hover:text-[#01411C] text-[11px] font-semibold text-stone-600 transition-colors border border-stone-200/80 cursor-pointer"
              >
                {language === 'ur' ? s.ur : s.en}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ur'
                  ? 'سوال لکھیں یا آرڈر بریف کے متعلق پوچھیں...'
                  : 'Ask about crafts, order briefs, or tracking...'
              }
              className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C] bg-[#FAF9F6]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-[#01411C] hover:bg-[#025c27] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
