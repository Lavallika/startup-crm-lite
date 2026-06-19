import React from 'react';
import { LineChart, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const ForecastCard = ({ forecast }) => {
  return (
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white dark:text-slate-900">Revenue Forecast</h3>
            <p className="text-sm text-gray-400 dark:text-slate-500">Predicted for next month</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LineChart className="w-6 h-6" />
          </div>
        </div>

        <div className="text-3xl font-bold text-white dark:text-slate-900 mt-2">
          {formatCurrency(forecast.amount)}
        </div>
        
        <div className="flex items-center mt-4 text-sm">
          <div className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{forecast.growth}%
          </div>
          <span className="text-gray-400 dark:text-slate-500 ml-2">growth trajectory</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 dark:text-slate-500">Confidence Score</span>
          <span className="font-semibold text-gray-300 dark:text-slate-700">85%</span>
        </div>
        <div className="w-full bg-gray-700 dark:bg-slate-100 h-2 rounded-full mt-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  );
};

