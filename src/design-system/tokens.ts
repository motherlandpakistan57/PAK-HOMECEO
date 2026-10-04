/**
 * PAK-HOMECEO Design Tokens
 * Refined Pakistani Heritage + Modern Enterprise
 */

export const colors = {
  // Brand Core
  terracotta: {
    DEFAULT: '#C85A32',
    hover: '#B44C27',
    light: '#F5EBE6',
    border: '#E8D2C8',
  },
  ochre: {
    DEFAULT: '#D97706',
    light: '#FEF3C7',
    dark: '#92400E',
  },
  indigo: {
    DEFAULT: '#1E3A8A',
    surface: '#1E293B',
    dark: '#0F172A',
    light: '#EEF2FF',
  },
  ivory: {
    DEFAULT: '#FAF9F6',
    pure: '#FFFFFF',
    muted: '#F5F5F0',
    border: '#E7E5E4',
  },
  forest: {
    DEFAULT: '#166534',
    light: '#DCFCE7',
    dark: '#14532D',
  },
  stone: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },
};

export const statusColors = {
  placed: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', label: 'Confirmed' },
  reviewed_batched: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', label: 'Allocated' },
  in_production: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', label: 'In Production' },
  quality_verified: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', label: 'Quality Checked' },
  dispatched: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', label: 'Dispatched' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300', label: 'Delivered' },
};
