import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search bar — full width on mobile, max-w-md on larger screens.
 * Input and clear button both meet 44px tap target.
 */
const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync with external resets
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full md:max-w-md">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-slate-400 dark:text-gray-500" />
      </div>

      {/* Input — min-h-[44px] for touch */}
      <input
        type="text"
        className="
          block w-full
          pl-10 pr-10
          py-2.5 md:py-2
          min-h-[44px]
          border border-slate-300 dark:border-gray-700
          rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          bg-gray-800 dark:bg-white
          text-white dark:text-slate-900
          text-sm
          placeholder-slate-400 dark:placeholder-gray-500
          transition-colors
        "
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads"
      />

      {/* Clear button — 44px tap area */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2 flex items-center justify-center w-10 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
