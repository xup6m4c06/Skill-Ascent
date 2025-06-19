'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'coffee' | 'forest' | 'ocean';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Read theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'coffee', 'forest', 'ocean'].includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      // Default to light if no valid theme is found
      setThemeState('light');
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Apply theme class to document.body
    document.body.className = ''; // Clear existing theme classes
    document.body.classList.add(`theme-${theme}`);

    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Rerun whenever theme state changes

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};