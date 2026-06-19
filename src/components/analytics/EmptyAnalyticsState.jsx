import React from 'react';
import { BarChart3 } from 'lucide-react';

export const EmptyAnalyticsState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-800 dark:bg-white rounded-2xl border border-gray-700 dark:border-slate-200 min-h-[400px]">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <BarChart3 className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-white dark:text-slate-900 mb-2">No analytics available yet</h3>
      <p className="text-gray-400 dark:text-slate-500 mb-6 max-w-md">
        Add your first lead to start tracking business performance, conversion rates, and growth trends.
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md">
        Add Lead
      </button>
    </div>
  );
};

