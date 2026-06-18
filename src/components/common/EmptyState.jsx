import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

const EmptyState = ({ hasLeads, onClearFilters }) => {
  if (hasLeads) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4 w-full">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <SearchX size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">No leads found</h3>
        <p className="text-slate-500 max-w-sm mb-6">
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
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4 w-full">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <Inbox size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">No leads yet</h3>
      <p className="text-slate-500 max-w-sm">
        You haven't added any leads to your CRM yet. Click "Add Lead" to get started.
      </p>
    </div>
  );
};

export default EmptyState;
