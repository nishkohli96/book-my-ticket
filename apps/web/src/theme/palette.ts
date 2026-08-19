/**
 * Check out these resources for building theme -
 *
 * https://zenoo.github.io/mui-theme-creator/
 * https://m2.material.io/inline-tools/color/
 */

export const AppGradients = {
  brandPrimary: 'linear-gradient(135deg, #1D4ED8, #DB2777)',
  brandDark: 'linear-gradient(135deg, #60A5FA, #F472B6)',
  hero: 'linear-gradient(120deg, #1D4ED8, #DB2777)',
  cardConcert: 'linear-gradient(135deg, #1D4ED8, #DB2777)',
  cardSports: 'linear-gradient(135deg, #1E3A8A, #1D4ED8)',
  cardTheater: 'linear-gradient(135deg, #9D174D, #DB2777)',
  cardComedy: 'linear-gradient(135deg, #D97706, #DB2777)',
  cardSymphony: 'linear-gradient(135deg, #1D4ED8, #60A5FA)',
  cardVenueDark: 'linear-gradient(135deg, #0F172A, #1E3A8A)',
  venueFallback: 'linear-gradient(160deg, #0F172A, #1E3A8A)',
  stageBar: 'linear-gradient(to bottom, #334155, #1E293B)',
  heroScrim: 'linear-gradient(to top, rgba(11,17,32,0.85), transparent 70%)',
};

/**
 * Primary, Secondary and Warning Tints are
 * 16% opacity of their counterparts
 */
export const LightThemePalette = {
  primary: { main: '#1D4ED8' },
  secondary: { main: '#DB2777' },
  success: { main: '#16A34A' },
  warning: { main: '#D97706' },
  error: { main: '#DC2626' },
  // info: { main: '#03a9f4' },
  divider: '#E2E8F0',
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#64748B',
  },
  primaryTint: '#EEF3FF',
  secondaryTint: '#FDF0F6',
  warningTint: '#FEF3C7',
  gradients: AppGradients,
};

export const DarkThemePalette = {
  primary: { main: '#60A5FA' },
  secondary: { main: '#F472B6' },
  success: { main: '#4ADE80' },
  warning: { main: '#FBBF24' },
  error: { main: '#F87171' },
  // info: { main: '#F87171' },
  divider: '#1E293B',
  background: {
    default: '#0B1120',
    paper: '#111827',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  primaryTint: '#16233F',
  secondaryTint: '#2B1826',
  warningTint: '#2B2311',
  gradients: AppGradients,
};

export const CommonColorPalette = {
  common: {
    black: '#000',
    white: '#fff',
  },
};
