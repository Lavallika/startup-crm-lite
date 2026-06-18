import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

const EmptyState = ({ hasLeads, onClearFilters }) => {
  if (hasLeads) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 text-center px-4 w-full transition-colors duration-200">
        <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-full mb-4 transition-colors duration-200">
          <SearchX size={32} className="text-slate-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2 transition-colors duration-200">No leads found</h3>
        <p className="text-slate-500 dark:text-gray-400 max-w-sm mb-6 transition-colors duration-200">
          We couldn't find any leads matching your current search and filter criteria.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors focus:outline-none focus:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 text-center px-4 w-full transition-colors duration-200">
      <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-full mb-4 transition-colors duration-200">
        <Inbox size={32} className="text-slate-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2 transition-colors duration-200">No leads yet</h3>
      <p className="text-slate-500 dark:text-gray-400 max-w-sm transition-colors duration-200">
        You haven't added any leads to your CRM yet. Click "Add Lead" to get started.
      </p>
    </div>
  );
};

export default EmptyState;
