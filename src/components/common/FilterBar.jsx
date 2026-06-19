import React from 'react';

const FILTERS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

/**
 * Filter pill bar — wraps on tablet+, horizontally scrolls on mobile.
 */
const FilterBar = ({ activeFilter, onFilterChange, leads }) => {
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter(lead => lead.status === filter).length;
  };

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count    = getCount(filter);
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              flex-shrink-0
              px-3 py-2
              rounded-full
              text-xs md:text-sm
              font-medium
              whitespace-nowrap
              transition-colors
              min-h-[36px]
              ${isActive
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                : 'bg-gray-800 dark:bg-white text-slate-600 dark:text-gray-300 border border-gray-700 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            {filter}{' '}
            <span className={`ml-1 ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
