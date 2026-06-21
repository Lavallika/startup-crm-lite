import React from 'react';
import { BarChart3 } from 'lucide-react';

export const EmptyAnalyticsState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[400px]">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <BarChart3 className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No analytics available yet</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Add your first lead to start tracking business performance, conversion rates, and growth trends.
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md">
        Add Lead
      </button>
    </div>
  );
};

