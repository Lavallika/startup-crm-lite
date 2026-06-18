import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * @param {{ compact?: boolean }} props
 * compact = true renders a smaller icon-only button for the mobile bottom bar
 */
const DarkModeToggle = ({ compact = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform duration-200 ${
          isDarkMode ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-indigo-600" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
