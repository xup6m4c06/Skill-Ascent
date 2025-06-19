'use client';

import * as React from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext'; // Adjust the import path if needed
import { Button } from '@/components/ui/button'; // Adjust the import path if needed

export function ThemeChangeButton() {
  const { theme, setTheme } = useTheme();

  const themes = ['light', 'dark', 'coffee', 'forest', 'ocean'];

  const cycleThemes = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as Theme);
  };

  return (
    <Button variant="outline" size="sm" onClick={cycleThemes}>
      Change Theme ({theme})
    </Button>
  );
}