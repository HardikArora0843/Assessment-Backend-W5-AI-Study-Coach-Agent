/**
 * Theme Hook
 * Manages dark/light theme state
 */

import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '../utils/storage';

export const useTheme = () => {
  const [theme, setThemeState] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme from storage on mount
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    setIsLoaded(true);

    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme, isLoaded };
};
