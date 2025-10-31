import React, { createContext, useContext, useMemo, useState } from 'react';

type ThemeName = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeName;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    card: string;
    border: string;
  };
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themeDefinitions: Record<ThemeName, ThemeContextValue['colors']> = {
  light: {
    background: '#ffffff',
    text: '#111111',
    primary: '#0a84ff',
    card: '#f7f7f7',
    border: '#e5e5e5',
  },
  dark: {
    background: '#0b0b0b',
    text: '#ffffff',
    primary: '#0a84ff',
    card: '#121212',
    border: '#333333',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('light');

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, toggleTheme, colors: themeDefinitions[theme] }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;
