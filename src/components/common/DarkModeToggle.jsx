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
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between w-full h-12 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
        isDarkMode 
          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100 shadow-sm' 
          : 'bg-gray-800 border-gray-700 hover:bg-gray-700 shadow-md'
      }`}
      aria-label="Toggle dark mode"
    >
      <div className="flex items-center gap-3 z-10">
        {isDarkMode ? (
          <div className="p-1.5 rounded-md bg-indigo-100">
            <Sun className="h-4 w-4 text-indigo-600" />
          </div>
        ) : (
          <div className="p-1.5 rounded-md bg-indigo-900/50">
            <Moon className="h-4 w-4 text-indigo-400" />
          </div>
        )}
        <span className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-gray-900' : 'text-gray-100'}`}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </div>
      
      {/* Animated toggle visual switch */}
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;
