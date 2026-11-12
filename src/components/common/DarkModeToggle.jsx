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
        type="button"
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        aria-label="Toggle dark mode"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-full h-11 px-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
      aria-label="Toggle dark mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
          {isDarkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
      
      {/* Animated toggle visual switch */}
      <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-xs ${
            isDarkMode ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;
