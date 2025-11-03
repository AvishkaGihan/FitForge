import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

const colors = {
  // Primary Colors
  primary: '#FF6B35',
  secondary: '#FF006E',
  accent: '#FFBE0B',

  // Status Colors
  success: '#06FFA5',
  warning: '#FFBE0B',
  error: '#FF006E',
  info: '#3B82F6',

  // Neutral Colors
  background: '#1A1A1D',
  surface: '#2D2D30',
  surfaceVariant: '#3A3A3D',

  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#C7C7CC',
  textDisabled: '#6E6E73',

  // Border & Divider
  border: '#3A3A3D',
  divider: '#2D2D30',

  // Gradients (for style definitions)
  gradientPrimary: ['#FF6B35', '#FF006E'],
  gradientEnergy: ['#FFBE0B', '#FF6B35'],
  gradientSuccess: ['#06FFA5', '#FF6B35'],
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
  },
  roundness: 12,
};

export { colors };

// Spacing system (8px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    fontFamily: 'Inter-Bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    fontFamily: 'Inter-SemiBold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  small: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
};

// Shadow presets
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
