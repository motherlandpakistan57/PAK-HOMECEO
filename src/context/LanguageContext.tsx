import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<string, { en: string; ur: string }> = {
  // Brand & Slogan
  'brand.name': { en: 'PAK-HOMECEO', ur: 'پاک-ہوم سی ای او' },
  'brand.tagline': {
    en: 'Every Home Can Become an Enterprise. Every Woman Can Become a CEO.',
    ur: 'ہر گھر بنے گا ایک باوقار کاروبار، ہر خاتون بنے گی اپنی زندگی کی سی ای او۔',
  },
  'brand.subtitle': {
    en: 'Pakistan Women-Led Enterprise Platform',
    ur: 'پاکستان کی خواتین کے زیر قیادت گھریلو کاروباری نظام',
  },

  // Navigation
  'nav.home': { en: 'Home', ur: 'ہوم' },
  'nav.marketplace': { en: 'Citizen Marketplace', ur: 'شہری مارکیٹ' },
  'nav.discover': { en: 'Discover Products', ur: 'مصنوعات دریافت کریں' },
  'nav.trackOrders': { en: 'Track Orders', ur: 'آرڈرز کی تفتیش' },
  'nav.impact': { en: 'Social Impact', ur: 'سماجی اثر' },
  'nav.login': { en: 'Enter Platform', ur: 'پلیٹ فارم میں داخل ہوں' },
  'nav.logout': { en: 'Log Out', ur: 'لاگ آؤٹ' },
  'nav.switchRole': { en: 'Switch Role', ur: 'کردار تبدیل کریں' },
  'nav.search': { en: 'Search products, crafts, makers...', ur: 'مصنوعات، دستکاری اور ہنرمند تلاش کریں...' },
  'nav.notifications': { en: 'Notifications', ur: 'اطلاعات' },

  // Roles
  'role.citizen': { en: 'Citizen', ur: 'شہری خریدار' },
  'role.builder': { en: 'Business Builder (Product Manager)', ur: 'بزنس بلڈر (پروڈکٹ منیجر)' },
  'role.partner': { en: 'Skill Partner (Master Artisan)', ur: 'ہنرمند پارٹنر (استاد کاریگر)' },
  'role.connector': { en: 'Community Connector', ur: 'کمیونٹی کنیکٹر' },

  // Core Actions
  'action.orderNow': { en: 'Order Now', ur: 'ابھی آرڈر کریں' },
  'action.preOrder': { en: 'Pre-Order Handcrafted Batch', ur: 'پیشگی آرڈر درج کریں' },
  'action.viewProduct': { en: 'View Product & Story', ur: 'مصنوعات اور کہانی دیکھیں' },
  'action.addToCart': { en: 'Add to Cart', ur: 'ٹوکری میں شامل کریں' },
  'action.save': { en: 'Save', ur: 'محفوظ کریں' },
  'action.saved': { en: 'Saved', ur: 'محفوظ شدہ' },
  'action.checkout': { en: 'Complete Order Brief', ur: 'آرڈر بریف مکمل کریں' },
  'action.trackOrder': { en: 'Track Order', ur: 'آرڈر ٹریک کریں' },
  'action.back': { en: 'Back', ur: 'واپس' },
  'action.close': { en: 'Close', ur: 'بند کریں' },
  'action.confirm': { en: 'Confirm', ur: 'تصدیق کریں' },
  'action.assign': { en: 'Assign Artisan', ur: 'کاریگر تفویض کریں' },
  'action.approve': { en: 'Approve Quality', ur: 'معیار منظور کریں' },
  'action.dispatch': { en: 'Dispatch Package', ur: 'پارسل روانہ کریں' },
  'action.aiAssist': { en: 'AI Assistant', ur: 'اے آئی مددگار' },

  // Marketplace Headings
  'market.featured': { en: 'Featured Products', ur: 'نمایاں دستکاریاں' },
  'market.makers': { en: 'Meet the Makers', ur: 'ہنرمند خواتین سے ملیں' },
  'market.categories': { en: 'Popular Categories', ur: 'مقبول اقسام' },
  'market.newThisWeek': { en: 'New This Week', ur: 'اس ہفتے کی نئی مصنوعات' },
  'market.impactTitle': { en: 'Direct Home Enterprise Impact', ur: 'براہِ راست گھریلو معاشی اثر' },
  'market.allCategories': { en: 'All Categories', ur: 'تمام اقسام' },

  // Order Brief Questionnaire
  'brief.title': { en: 'Intelligent Order & Pre-Order Brief', ur: 'ذہین آرڈر اور پیشگی بریف' },
  'brief.subtitle': {
    en: 'Connecting your custom requirements directly to the responsible Product Manager and home artisan.',
    ur: 'آپ کی مخصوص ضروریات کو براہ راست پروڈکٹ منیجر اور گھریلو کاریگر سے جوڑنا۔',
  },
  'brief.customization': { en: 'Customization Requirements', ur: 'مخصوص فرمائش یا ترامیم' },
  'brief.customizationPlaceholder': {
    en: 'e.g., Specific color thread, personal gift note, size adjustments, special packaging...',
    ur: 'مثلاً دھاگے کا مخصوص رنگ، تحفے کا پیغام، سائز میں ردوبدل، یا خاص پیکنگ...',
  },
  'brief.timing': { en: 'Preferred Delivery Timing', ur: 'ترجیحی ترسیل کا وقت' },
  'brief.timingStandard': { en: 'Standard Handcrafted Timeline (5-7 days)', ur: 'معیاری دستی وقت (5 سے 7 دن)' },
  'brief.timingPriority': { en: 'Priority Expedited (3-4 days)', ur: 'فوری ضرورت (3 سے 4 دن)' },
  'brief.timingPreorder': { en: 'Next Production Batch Release (10-14 days)', ur: 'اگلی پیداواری کھیپ (10 سے 14 دن)' },
  'brief.specialInstructions': { en: 'Special Instructions / Delivery Notes', ur: 'خصوصی ہدایات یا پتے کی رہنمائی' },
  'brief.specialInstructionsPlaceholder': {
    en: 'e.g., Near landmark, call before arrival, deliver after 2 PM...',
    ur: 'مثلاً قریبی نشانی، آمد سے قبل کال کریں، دوپہر کے بعد ترسیل...',
  },
  'brief.contactInfo': { en: 'Contact & Delivery Information', ur: 'رابطہ اور ترسیل کی تفصیلات' },
  'brief.fullName': { en: 'Full Name', ur: 'مکمل نام' },
  'brief.phone': { en: 'Mobile Phone (for SMS updates)', ur: 'موبائل نمبر (پیغامات کے لیے)' },
  'brief.city': { en: 'Destination City', ur: 'شہر' },
  'brief.address': { en: 'Full Delivery Address', ur: 'مکمل ترسیلی پتہ' },
  'brief.paymentMethod': { en: 'Payment Method', ur: 'طریقہ ادائیگی' },
  'brief.submitOrder': { en: 'Submit Structured Order Brief', ur: 'مکمل آرڈر بریف جمع کروائیں' },
  'brief.submitPreOrder': { en: 'Confirm Pre-Order Reservation', ur: 'پیشگی ریزرویشن کی تصدیق کریں' },

  // Order Statuses
  'status.placed': { en: 'Order Placed', ur: 'آرڈر موصول ہو گیا' },
  'status.new': { en: 'New Order', ur: 'نیا آرڈر' },
  'status.confirmed': { en: 'Confirmed by Product Manager', ur: 'پروڈکٹ منیجر نے تصدیق کر دی' },
  'status.allocated': { en: 'Allocated to Skill Partner', ur: 'ہنرمند کاریگر کو سونپا گیا' },
  'status.in_production': { en: 'In Handcrafted Production', ur: 'دستکاری جاری ہے' },
  'status.quality_check': { en: 'Doorstep Quality Verification', ur: 'کوالٹی تصدیق کا عمل' },
  'status.dispatched': { en: 'Dispatched with Tracking', ur: 'روانہ کر دیا گیا ہے' },
  'status.delivered': { en: 'Delivered to Citizen', ur: 'خریدار کو پہنچا دیا گیا' },
  'status.completed': { en: 'Order & Payout Completed', ur: 'آرڈر اور معاوضہ مکمل' },

  // Impact & Trust
  'impact.artisanShare': { en: '~70% Direct to Artisan', ur: 'کاریگر کا براہِ راست حصہ 70%' },
  'impact.dignity': { en: 'Dignified Enterprise, Never Charity', ur: 'باوقار روزگار، خیرات نہیں' },
  'impact.closedLoop': { en: 'Closed-Loop Operations', ur: 'مکمل تصدیق شدہ نظام' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pak_homeceo_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pak_homeceo_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  const isRtl = language === 'ur';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
