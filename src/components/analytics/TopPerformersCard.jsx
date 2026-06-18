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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performers</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Ranked by Won Revenue</p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Medal className="w-6 h-6" />
        </div>
      </div>

      {performers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-gray-500">
          <p>No performer data yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performers.map((performer, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-600 flex items-center justify-center font-bold text-slate-600 dark:text-gray-400 text-sm">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{performer.name}</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">{performer.deals} Deals Won</div>
                </div>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-right">
                {formatCurrency(performer.revenue)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

