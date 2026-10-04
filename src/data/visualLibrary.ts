/**
 * PAK-HOMECEO Official Visual Reference Library
 * 
 * Contextual mapping rules defined by platform guidelines:
 * 1. Experienced Pakistani woman/artisan → Welcome, Skill Partner, human story, dignity, experience
 * 2. Women food enterprise → HOMECEO MENUE, food production, quality, enterprise
 * 3. Pakistani food → Food products, Citizen marketplace, product cards
 * 4. Lahore Fort/Pakistan landscape → Welcome hero, national identity, local-to-national transition
 * 5. Karachi textile market → Commerce, textiles, marketplace
 * 6. Lahore bazaar → Community commerce, local economy, Citizen discovery
 * 7. Hunza handicrafts → HOMECEO HUNAR, cultural products, regional diversity
 * 8. Pakistani pottery → Product card/detail and craft category
 * 9. Sindhi Ajrak → Cultural heritage, textile product/story
 * 
 * Color Palette:
 * - Terracotta: #C05638 / #A33B1E
 * - Warm Ochre: #D9822B / #E09F3E
 * - Deep Indigo: #1E293B / #1B2A47 / #0F172A
 * - Ivory: #FAF9F6 / #FDFBF7
 * - Forest Green: #01411C / #1A3826
 */

export interface VisualReferenceItem {
  id: string;
  category: 
    | 'artisan_dignity'
    | 'food_enterprise'
    | 'pakistani_food'
    | 'pakistan_landscape'
    | 'textile_market'
    | 'bazaar_commerce'
    | 'hunza_handicrafts'
    | 'pakistani_pottery'
    | 'sindhi_ajrak';
  titleEn: string;
  titleUr: string;
  contextUsage: string;
  mappedRole: 'partner' | 'builder' | 'connector' | 'citizen' | 'platform';
  imageUrl: string;
  fallbackGradient: string;
  culturalNotes: string;
  isFictionalDemoReference: boolean;
}

export const OFFICIAL_VISUAL_LIBRARY: Record<string, VisualReferenceItem> = {
  // 1. Experienced Pakistani woman/artisan
  artisan_dignity: {
    id: 'vis-1',
    category: 'artisan_dignity',
    titleEn: 'Experienced Pakistani Woman Artisan · Dignity & Mastery',
    titleUr: 'باہنر بزرگ پاکستانی خاتون کاریگر · وقار اور تجربہ',
    contextUsage: 'Welcome hero, Skill Partner workshop, human storytelling, generational craft',
    mappedRole: 'partner',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    fallbackGradient: 'from-[#C05638]/20 via-[#FAF9F6] to-[#01411C]/10',
    culturalNotes: 'Depicts generational needlework mastery and quiet self-reliance without charity or poverty framing.',
    isFictionalDemoReference: true,
  },

  // 2. Women food enterprise
  food_enterprise: {
    id: 'vis-2',
    category: 'food_enterprise',
    titleEn: 'Women Home Food Enterprise · HOMECEO MENUE',
    titleUr: 'خواتین کا گھریلو غذائی کاروبار · ہوم سی ای او مینو',
    contextUsage: 'HOMECEO MENUE showcase, food processing batches, kitchen enterprise scaling',
    mappedRole: 'builder',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    fallbackGradient: 'from-[#D9822B]/20 via-[#FAF9F6] to-[#C05638]/15',
    culturalNotes: 'Intergenerational domestic kitchen scaled with digital tablets, clean glass jars, and airtight batch seals.',
    isFictionalDemoReference: true,
  },

  // 3. Pakistani food
  pakistani_food: {
    id: 'vis-3',
    category: 'pakistani_food',
    titleEn: 'Authentic Pakistani Artisanal Preserves & Spices',
    titleUr: 'روایتی پاکستانی اچار، خالص شہد اور مصالحہ جات',
    contextUsage: 'Food product cards in Citizen marketplace, recipe heritage, quality certifications',
    mappedRole: 'citizen',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#E09F3E]/20 via-[#FAF9F6] to-[#01411C]/15',
    culturalNotes: 'Sun-cured green mango chaunsa achar in mustard oil with fennel and kalonji; Swat mountain walnuts.',
    isFictionalDemoReference: true,
  },

  // 4. Lahore Fort / Pakistan landscape
  pakistan_landscape: {
    id: 'vis-4',
    category: 'pakistan_landscape',
    titleEn: 'Historic Lahore Mughal Architecture & Pakistani Heritage',
    titleUr: 'تاریخی لاہور کا شاہی قلعہ اور قومی ورثہ',
    contextUsage: 'Welcome hero background, national identity banner, local-to-national transitions',
    mappedRole: 'platform',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80',
    fallbackGradient: 'from-[#0F172A]/70 via-[#1E293B]/60 to-[#01411C]/70',
    culturalNotes: 'Terracotta red sandstone Mughal architectural arches and majestic civic heritage.',
    isFictionalDemoReference: true,
  },

  // 5. Karachi textile market
  textile_market: {
    id: 'vis-5',
    category: 'textile_market',
    titleEn: 'Karachi Wholesale Textile Market & Resham Bazaars',
    titleUr: 'کراچی کی متحرک کپڑا مارکیٹ اور ریشم بازار',
    contextUsage: 'Commercial textile production, batch scaling, raw material bulk procurement',
    mappedRole: 'builder',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
    fallbackGradient: 'from-[#1B2A47]/30 via-[#FAF9F6] to-[#C05638]/20',
    culturalNotes: 'Organized bolts of handloom lawn, raw silk, and dyed yardage ready for artisan finishing.',
    isFictionalDemoReference: true,
  },

  // 6. Lahore bazaar
  bazaar_commerce: {
    id: 'vis-6',
    category: 'bazaar_commerce',
    titleEn: 'Lahore Old City Community Commerce & Spice Bazaars',
    titleUr: 'اندرونِ لاہور کی روایتی تجارتی منڈیاں اور رونق',
    contextUsage: 'Citizen discovery, Community Connector local bridges, grassroots trade',
    mappedRole: 'connector',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    fallbackGradient: 'from-[#D9822B]/20 via-[#FAF9F6] to-[#01411C]/20',
    culturalNotes: 'Grassroots community exchange where trusted local bridges connect households to wider markets.',
    isFictionalDemoReference: true,
  },

  // 7. Hunza handicrafts
  hunza_handicrafts: {
    id: 'vis-7',
    category: 'hunza_handicrafts',
    titleEn: 'Northern Swat & Hunza Valley Woolen Handicrafts (HOMECEO HUNAR)',
    titleUr: 'سوات و ہنزہ کی روایتی اونی دستکاری (ہوم سی ای او ہنر)',
    contextUsage: 'HOMECEO HUNAR pillar, mountain sheep wool pattu shawls, northern craft clusters',
    mappedRole: 'citizen',
    imageUrl: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#01411C]/20 via-[#FAF9F6] to-[#D9822B]/20',
    culturalNotes: 'Counted needlework, mountain sheep wool loom weaving, and natural dye traditions of Gilgit-Baltistan.',
    isFictionalDemoReference: true,
  },

  // 8. Pakistani pottery
  pakistani_pottery: {
    id: 'vis-8',
    category: 'pakistani_pottery',
    titleEn: 'Multani Kashikari Hand-Painted Glazed Blue Pottery',
    titleUr: 'ملتان کی روایتی نیلی مٹی کے بنے برتن (کاشی کاری)',
    contextUsage: 'Pottery product card, craft detail view, historical Indus clay heritage',
    mappedRole: 'citizen',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#1B2A47]/20 via-[#FAF9F6] to-[#01411C]/15',
    culturalNotes: 'Hand-shaped earthenware with cobalt blue and turquoise floral arabesques fired in traditional kilns.',
    isFictionalDemoReference: true,
  },

  // 9. Sindhi Ajrak
  sindhi_ajrak: {
    id: 'vis-9',
    category: 'sindhi_ajrak',
    titleEn: 'Sindhi Natural Indigo & Madder Red Block-Printed Ajrak',
    titleUr: 'سندھ کا تاریخی اجرک · قدرتی نیل اور روغنی چھپائی',
    contextUsage: 'Ajrak heritage craft story, artisan spotlight, Sindhi cultural textile preservation',
    mappedRole: 'partner',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#C05638]/25 via-[#FAF9F6] to-[#1B2A47]/30',
    culturalNotes: 'Multi-stage block-printed heritage cloth using natural river mud, indigo, and madder root.',
    isFictionalDemoReference: true,
  },
};

/**
 * The 8 Official Master Brand Visual Concepts Uploaded by User
 */
export const OFFICIAL_MASTER_SLIDES = [
  {
    slideNumber: 1,
    titleEn: 'Intergenerational Purpose',
    titleUr: 'نسلوں کا باوقار رابطہ',
    quoteEn: 'No woman should feel forgotten when she still has so much to contribute. Technology should not replace human connection. It should strengthen it.',
    quoteUr: 'کسی خاتون کو بھلایا نہیں جانا چاہیے جب اس کے پاس معاشرے کو دینے کے لیے اتنا کچھ ہو۔ ٹیکنالوجی کو انسانی رابطے کی جگہ نہیں لینی چاہیے، بلکہ اسے مضبوط بنانا چاہیے۔',
    visualDescription: 'Elderly Pakistani woman in terracotta dupatta standing beside young Pakistani woman in deep indigo dupatta in front of traditional haveli courtyard.',
    contextKey: 'artisan_dignity',
  },
  {
    slideNumber: 2,
    titleEn: 'The Transformation Pathway',
    titleUr: 'تبدیلی کا سفر',
    quoteEn: 'Isolation → Connection → Participation → Contribution → Recognition → Income → Belonging',
    quoteUr: 'تنہائی ← رابطہ ← شمولیت ← کردار ← پہچان ← آمدن ← وابستگی',
    visualDescription: 'Left: Isolation in solitude. Right: Joyful domestic enterprise holding homemade spice jar with young woman managing digital tablet.',
    contextKey: 'food_enterprise',
  },
  {
    slideNumber: 3,
    titleEn: 'The 4 Enterprise Pillars',
    titleUr: 'چار بنیادی شعبے',
    quoteEn: 'HOMECEO HUNAR (Crafts) · HOMECEO MENUE (Traditional Foods) · HOMECEO KNOWLEDGE (Teaching) · HOMECEO SERVICES (Community)',
    quoteUr: 'ہوم سی ای او ہنر · ہوم سی ای او مینو · ہوم سی ای او علم · ہوم سی ای او خدمات',
    visualDescription: 'Four distinct craft and livelihood domains rooted in domestic skill.',
    contextKey: 'hunza_handicrafts',
  },
  {
    slideNumber: 4,
    titleEn: 'Experience + Youth + Technology = New Enterprise',
    titleUr: 'تجربہ + نوجوان نسل + ٹیکنالوجی = نیا کاروبار',
    quoteEn: 'Connecting generational wisdom with modern commerce to transform isolation into sustainable livelihood.',
    quoteUr: 'بزرگ نسل کی مہارت کو نوجوانوں کی ڈیجیٹل صلاحیت سے جوڑ کر نئے گھریلو کاروبار کا قیام۔',
    visualDescription: 'Elderly artisan holding homemade preserve jar with young woman builder smiling over tablet.',
    contextKey: 'food_enterprise',
  },
  {
    slideNumber: 5,
    titleEn: 'Different Strengths. One Ecosystem.',
    titleUr: 'مختلف صلاحیتیں، ایک باہم مربوط نظام',
    quoteEn: 'Skill Partner (Experienced Woman) + Business Builder (Young Digital Entrepreneur) + Community Connector (Trusted Bridge) + Citizen (Customer Investing in a Story)',
    quoteUr: 'ہنرمند ساتھی + کاروباری منتظم + مقامی رابطہ کار + باشعور شہری خریدار',
    visualDescription: 'Closed circular operational ecosystem connecting the 4 key roles.',
    contextKey: 'bazaar_commerce',
  },
  {
    slideNumber: 6,
    titleEn: 'The Home Already Holds Value',
    titleUr: 'گھر پہلے سے قیمتی صلاحیت رکھتا ہے',
    quoteEn: 'Skills | Knowledge | Experience | Culture (ہنر | علم | تجربہ | ثقافت)',
    quoteUr: 'ہنر، علم، تجربہ، ثقافت — گھریلو مہارتوں کو باوقار آمدن میں بدلنا۔',
    visualDescription: 'Collage of sunlit spices, hand needlework, traditional cooking, and handwritten heirloom recipe.',
    contextKey: 'pakistani_food',
  },
  {
    slideNumber: 7,
    titleEn: 'The Core Mission Formula',
    titleUr: 'بنیادی مشن',
    quoteEn: 'Isolation → Participation | Experience → Opportunity | Home → Enterprise',
    quoteUr: 'تنہائی سے شمولیت، تجربے سے موقع، گھر سے کاروبار تک۔',
    visualDescription: 'Mission manifesto banner in Deep Indigo and Ivory with radiant amber transitions.',
    contextKey: 'pakistan_landscape',
  },
  {
    slideNumber: 8,
    titleEn: 'No One Should Become Invisible With Age',
    titleUr: 'عمر کے ساتھ کسی کو نظر انداز نہیں ہونا چاہیے',
    quoteEn: 'Not a nursing home. Not a charity. Not medical care. A local companionship + practical assistance network for older women living alone.',
    quoteUr: 'نہ اولڈ ہوم، نہ خیرات، نہ ہسپتال۔ بلکہ تنہا رہنے والی بزرگ خواتین کے لیے باوقار رفاقت اور عملی معاونت کا مقامی نیٹ ورک۔',
    visualDescription: 'Three genuine portraits of smiling elderly Pakistani women laughing and connecting in community.',
    contextKey: 'artisan_dignity',
  },
];
