import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('startup-crm-theme') || localStorage.getItem('isDarkMode');
      if (stored !== null) {
        return stored === 'dark' || stored === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('startup-crm-theme', 'dark');
        localStorage.setItem('isDarkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('startup-crm-theme', 'light');
        localStorage.setItem('isDarkMode', 'false');
      }
    } catch (err) {
      console.warn('LocalStorage unavailable for theme storage:', err);
    }
  }, [isDarkMode]);

  /**
   * Toggles the theme between light and dark mode
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
