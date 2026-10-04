/**
 * PAK-HOMECEO Central Design Tokens
 * 
 * Reusable tokens for:
 * - Colors (Official Pakistan Executive Flag Green #01411C, Light Green #F0FDF4, Gold/Ochre, Terracotta, Ivory)
 * - Typography (Inter / Plus Jakarta Sans, Display, Section, Body, Compact Labels, Tabular Numerics)
 * - Spacing & Radius
 * - Shadows & Borders
 * - Button Sizes
 * - Input Heights
 * - Card Styles
 * - Status Colors
 * - Responsive Breakpoints
 */

export const tokens = {
  colors: {
    // Pakistan Executive Flag Palette
    brand: {
      pakistanGreen: '#01411C',       // Official Pakistan Flag Green
      pakistanGreenDark: '#002C12',   // Deep shade for high contrast
      pakistanGreenLight: '#0D6834',  // Medium shade for active states
      pakistanGreenHover: '#035224',  // Hover state
      emerald: '#115740',             // Secondary executive green
      
      // Light Green Tints & Accents
      lightGreenBg: '#F0FDF4',        // Crisp light green background
      lightGreenSurface: '#DCFCE7',   // Highlight card & pill background
      lightGreenBorder: '#BBF7D0',    // Light green border tone
      lightGreenMuted: '#86EFAC',     // Subdued green line
      
      // Complementary Pakistani Tones
      gold: '#D97706',                // Warm Ochre / Crescent Gold
      goldLight: '#FEF3C7',           // Gold tint
      terracotta: '#C85A32',          // Natural fired clay
      terracottaLight: '#FFEDD5',     // Soft terracotta wash
      
      // Neutrals & Surfaces
      ivory: '#FAF9F6',               // Warm natural ivory background
      surfaceWhite: '#FFFFFF',        // Pure white card surfaces
      surfaceMuted: '#F4EFEA',        // Warm stone wash
      darkSurface: '#0B1E13',         // Executive dark mode surface
    },
    text: {
      primary: '#1A2E22',             // High readability dark green-slate
      secondary: '#4A5D52',           // Medium reading tone
      muted: '#718579',               // Subdued auxiliary labels
      disabled: '#A0AFA6',
      onBrand: '#FFFFFF',             // High contrast on dark green
      brandGreen: '#01411C',          // Accent text in Pakistan green
    },
    border: {
      subtle: 'border-stone-200/80',
      standard: 'border-stone-300',
      greenLight: 'border-emerald-200',
      greenBrand: 'border-[#01411C]',
    },
    status: {
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-900 border border-amber-300',
      },
      inProduction: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badge: 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]',
      },
      qcPassed: {
        bg: 'bg-teal-50',
        text: 'text-teal-800',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-900 border border-teal-300',
      },
      dispatched: {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-900 border border-blue-300',
      },
      delivered: {
        bg: 'bg-[#F0FDF4]',
        text: 'text-[#01411C]',
        border: 'border-[#BBF7D0]',
        badge: 'bg-[#01411C] text-white border border-[#01411C]',
      },
      cancelled: {
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-900 border border-rose-300',
      },
    },
  },

  typography: {
    fontFamilies: {
      sans: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace",
    },
    // Strong display headings (no decorative fonts)
    displayLg: 'font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1A2E22] leading-[1.15]',
    displayMd: 'font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1A2E22] leading-tight',
    displaySm: 'font-sans font-bold text-xl sm:text-2xl tracking-tight text-[#1A2E22] leading-snug',

    // Medium-weight section headings
    sectionHeading: 'font-sans font-semibold text-lg sm:text-xl text-[#1A2E22] tracking-normal',
    sectionSubheading: 'font-sans font-medium text-sm sm:text-base text-[#4A5D52]',

    // Highly readable body text
    bodyLg: 'font-sans text-base text-[#4A5D52] leading-relaxed',
    bodyMd: 'font-sans text-sm text-[#4A5D52] leading-relaxed',
    bodySm: 'font-sans text-xs text-[#718579] leading-normal',

    // Compact labels (strictly clean & compact)
    compactLabel: 'font-sans text-[11px] font-bold uppercase tracking-wider text-[#4A5D52]',
    compactLabelBrand: 'font-sans text-[11px] font-bold uppercase tracking-wider text-[#01411C]',

    // Clear numerical typography (monospaced & tabular for precise accounting)
    numericLg: 'font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#1A2E22] tracking-tight',
    numericMd: 'font-mono text-lg sm:text-xl font-bold tabular-nums text-[#1A2E22] tracking-tight',
    numericSm: 'font-mono text-sm font-semibold tabular-nums text-[#1A2E22]',
    numericXs: 'font-mono text-xs font-semibold tabular-nums text-[#4A5D52]',
  },

  spacing: {
    pagePadding: 'px-4 sm:px-6 lg:px-8',
    cardPadding: 'p-4 sm:p-6',
    compactPadding: 'p-3 sm:p-4',
    sectionGap: 'space-y-6 sm:space-y-8',
  },

  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },

  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md shadow-stone-200/50',
    lg: 'shadow-lg shadow-stone-300/40',
    brandGlow: 'shadow-[0_8px_30px_rgb(1,65,28,0.12)]',
    card: 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
  },

  borders: {
    default: 'border border-stone-200',
    brand: 'border-2 border-[#01411C]',
    greenLight: 'border border-[#BBF7D0]',
    subtle: 'border border-stone-100',
  },

  // Button sizes
  buttonSizes: {
    sm: 'h-8 px-3 text-xs font-semibold rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm font-semibold rounded-lg gap-2',
    lg: 'h-12 px-6 text-base font-bold rounded-xl gap-2.5',
    iconSm: 'w-8 h-8 rounded-md p-1.5',
    iconMd: 'w-10 h-10 rounded-lg p-2',
  },

  // Input heights
  inputHeights: {
    sm: 'h-8 text-xs px-2.5 rounded-md border-stone-300 focus:border-[#01411C] focus:ring-1 focus:ring-[#01411C]',
    md: 'h-10 text-sm px-3.5 rounded-lg border-stone-300 focus:border-[#01411C] focus:ring-2 focus:ring-[#01411C]/20',
    lg: 'h-12 text-base px-4 rounded-xl border-stone-300 focus:border-[#01411C] focus:ring-2 focus:ring-[#01411C]/20',
  },

  // Card styles
  cardStyles: {
    standard: 'bg-white border border-stone-200/90 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
    interactive: 'bg-white border border-stone-200/90 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#01411C]/40 transition-all duration-150',
    executiveGreen: 'bg-[#01411C] text-white border border-[#002C12] rounded-xl shadow-[0_8px_30px_rgb(1,65,28,0.16)]',
    lightGreenAccent: 'bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#01411C]',
    highlight: 'bg-amber-50/50 border border-amber-200/80 rounded-xl',
  },

  // Responsive breakpoints guide
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof tokens;
