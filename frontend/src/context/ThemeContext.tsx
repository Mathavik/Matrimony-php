// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
  bgColor: string;
  textColor: string;
  isLightTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // ✅ Load saved theme from localStorage or default to 'blue'
  const [themeColor, setThemeColorState] = useState<string>(() => {
    return localStorage.getItem('adminThemeColor') || 'blue';
  });

  // ✅ Color configuration map with proper text colors
  const colorConfig: Record<string, { bg: string; text: string; light: boolean }> = {
    // Dark themes - White text & white logo
    blue: { bg: 'bg-blue-600', text: 'text-white', light: false },
    pink: { bg: 'bg-pink-600', text: 'text-white', light: false },
    black: { bg: 'bg-black', text: 'text-white', light: false },
    green: { bg: 'bg-green-600', text: 'text-white', light: false },
    orange: { bg: 'bg-orange-600', text: 'text-white', light: false },
    red: { bg: 'bg-red-600', text: 'text-white', light: false },
    teal: { bg: 'bg-teal-600', text: 'text-white', light: false },
    indigo: { bg: 'bg-indigo-600', text: 'text-white', light: false },
    cyan: { bg: 'bg-cyan-600', text: 'text-white', light: false },
    rose: { bg: 'bg-rose-600', text: 'text-white', light: false },
    emerald: { bg: 'bg-emerald-600', text: 'text-white', light: false },
    violet: { bg: 'bg-violet-600', text: 'text-white', light: false },
    sky: { bg: 'bg-sky-600', text: 'text-white', light: false },
    fuchsia: { bg: 'bg-fuchsia-600', text: 'text-white', light: false },
    slate: { bg: 'bg-slate-600', text: 'text-white', light: false },
    
    // Light theme - Black text & black logo
    white: { bg: 'bg-white', text: 'text-black', light: true },
  };

  // ✅ Save theme to localStorage whenever it changes
  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('adminThemeColor', color);
  };

  // ✅ Get current color configuration
  const currentConfig = colorConfig[themeColor] || colorConfig.blue;

  const value: ThemeContextType = {
    themeColor,
    setThemeColor,
    bgColor: currentConfig.bg,
    textColor: currentConfig.text,
    isLightTheme: currentConfig.light,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
