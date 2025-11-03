import React, { createContext, useContext, ReactNode } from 'react';
import { theme, colors, spacing, typography } from '@/styles/theme';

interface ThemeContextType {
  theme: typeof theme;
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme, colors, spacing, typography }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
