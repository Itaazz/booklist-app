import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

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
    success: string;
    danger: string;
    muted: string;
    gold: string;
    placeholder: string;
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
    success: '#2ecc71',
    danger: '#e74c3c',
    muted: '#666666',
    gold: '#f5a623',
    placeholder: '#dddddd',
  },
  dark: {
    background: '#0b0b0b',
    text: '#ffffff',
    primary: '#0a84ff',
    card: '#121212',
    border: '#333333',
    success: '#2ecc71',
    danger: '#ff6b6b',
    muted: '#999999',
    gold: '#f5a623',
    placeholder: '#222222',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('light');

  useEffect(() => {
    (async () => {
      try {
  const mod = await import('@react-native-async-storage/async-storage');
        const saved = await mod.default.getItem('@app_theme');
        if (saved === 'light' || saved === 'dark') setTheme(saved);
      } catch (_) {
      }
    })();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // persist theme
  useEffect(() => {
    (async () => {
      try {
  // @ts-ignore: optional dependency
  const mod = await import('@react-native-async-storage/async-storage');
        await mod.default.setItem('@app_theme', theme);
      } catch (_) {
        // ignore
      }
    })();
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme, colors: themeDefinitions[theme] }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;
