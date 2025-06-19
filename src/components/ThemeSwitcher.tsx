'use client';

import * as React from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Adjust the import path if necessary

// Assuming you are using shadcn/ui's Select component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Adjust the import path if necessary

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="coffee">Coffee</SelectItem>
        <SelectItem value="forest">Forest</SelectItem>
        <SelectItem value="ocean">Ocean</SelectItem>
      </SelectContent>
    </Select>
    // Alternatively, you could use buttons:
    // <div className="flex space-x-2">
    //   <button onClick={() => setTheme('light')}>Light</button>
    //   <button onClick={() => setTheme('dark')}>Dark</button>
    //   <button onClick={() => setTheme('coffee')}>Coffee</button>
    //   <button onClick={() => setTheme('forest')}>Forest</button>
    //   <button onClick={() => setTheme('ocean')}>Ocean</button>
    // </div>
  );
}