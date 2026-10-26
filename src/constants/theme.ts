import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardShadow: '#CBD5E1',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#D1FAE5',
    secondary: '#6366F1',
    accent: '#F59E0B',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    success: '#10B981',
    xp: '#F59E0B',
    heart: '#EF4444',
    streak: '#F97316',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#0B1120',
    card: '#1E293B',
    cardBorder: '#334155',
    cardShadow: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#064E3B',
    secondary: '#818CF8',
    accent: '#FBBF24',
    danger: '#F87171',
    dangerLight: '#450A0A',
    warning: '#FBBF24',
    success: '#34D399',
    xp: '#FBBF24',
    heart: '#F87171',
    streak: '#FB923C',
  },
} as const;

export const WorldColors = {
  html: {
    primary: '#EA580C',
    light: '#FFEDD5',
    dark: '#9A3412',
    shadow: '#C2410C',
    badge: '#F97316',
    title: 'HTML Fundamentals',
    icon: 'code',
  },
  css: {
    primary: '#0284C7',
    light: '#E0F2FE',
    dark: '#0369A1',
    shadow: '#075985',
    badge: '#38BDF8',
    title: 'CSS Styling',
    icon: 'color-palette',
  },
  javascript: {
    primary: '#16A34A',
    light: '#DCFCE7',
    dark: '#15803D',
    shadow: '#166534',
    badge: '#4ADE80',
    title: 'JavaScript Logic',
    icon: 'flash',
  },
  projects: {
    primary: '#7C3AED',
    light: '#EDE9FE',
    dark: '#6D28D9',
    shadow: '#5B21B6',
    badge: '#A78BFA',
    title: 'Web Projects',
    icon: 'rocket',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 75 }) ?? 75;
export const MaxContentWidth = 800;
