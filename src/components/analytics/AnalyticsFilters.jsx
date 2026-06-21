import React from 'react';
import { cn } from '../../utils/cn';

export const AnalyticsFilters = ({ value, onChange }) => {
  const options = [
    { label: 'Last 7 Days',  value: '7days'    },
    { label: 'Last 30 Days', value: '30days'   },
    { label: 'Last 90 Days', value: '90days'   },
    { label: 'This Year',    value: 'thisYear' },
    { label: 'All Time',     value: 'all'      },
  ];

  return (
    /* Horizontally scrollable on mobile so all filters are reachable */
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto gap-0.5 min-w-0">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-shrink-0 px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap min-h-[36px] md:min-h-[auto]',
            value === option.value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
