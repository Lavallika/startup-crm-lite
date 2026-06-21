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
        <Search size={18} className="text-gray-500 dark:text-gray-400" />
      </div>

      {/* Input — min-h-[44px] for touch */}
      <input
        type="text"
        className="
          block w-full
          pl-10 pr-10
          py-2.5 md:py-2
          min-h-[44px]
          border border-gray-200 dark:border-gray-700
          rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-white
          text-sm
          placeholder-gray-500 dark:placeholder-gray-400
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
          className="absolute inset-y-0 right-0 pr-2 flex items-center justify-center w-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
