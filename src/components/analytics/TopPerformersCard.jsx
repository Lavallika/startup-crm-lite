import React from 'react';
import { Medal } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const TopPerformersCard = ({ performers }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ranked by Won Revenue</p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Medal className="w-6 h-6" />
        </div>
      </div>

      {performers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          <p>No performer data yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performers.map((performer, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-sm">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{performer.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{performer.deals} Deals Won</div>
                </div>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white text-right">
                {formatCurrency(performer.revenue)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

