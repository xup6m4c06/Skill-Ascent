'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'coffee' | 'forest' | 'ocean';
export type { Theme };
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('coffee');

   useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let initialTheme: Theme = 'coffee' as Theme; // Determine the initial theme
    if (savedTheme && (['light', 'dark', 'coffee', 'forest', 'ocean'] as string[]).includes(savedTheme)) {
      initialTheme = savedTheme as Theme; // Explicitly cast savedTheme to Theme after validation
    }
    setThemeState(initialTheme as Theme); // Set the state once with the determined initial theme
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const root = document.documentElement;
    const themeClasses = ['theme-light', 'theme-dark', 'theme-coffee', 'theme-forest', 'theme-ocean'];
    root.classList.remove(...themeClasses);
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

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