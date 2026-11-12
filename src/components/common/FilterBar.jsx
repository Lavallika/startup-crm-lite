import React from 'react';
import { getLeadStage } from '../../constants/leadStatuses';

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'New', label: 'New' },
  { key: 'Contacted', label: 'Contacted' },
  { key: 'Qualified', label: 'Qualified' },
  { key: 'Proposal Sent', label: 'Proposal Sent' },
  { key: 'Won', label: 'Converted' },
  { key: 'Lost', label: 'Lost' }
];

/**
 * Filter pill bar — wraps on tablet+, horizontally scrolls on mobile.
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const getCount = (filterKey) => {
    if (filterKey === 'All') return leads.length;
    return leads.filter((lead) => getLeadStage(lead?.status) === filterKey).length;
  };

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key;
        const count = getCount(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`
              flex-shrink-0
              px-3.5 py-2
              rounded-full
              text-xs md:text-sm
              font-medium
              whitespace-nowrap
              transition-colors
              min-h-[36px]
              cursor-pointer
              ${isActive
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {label}{' '}
            <span className={`ml-1 font-semibold ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
