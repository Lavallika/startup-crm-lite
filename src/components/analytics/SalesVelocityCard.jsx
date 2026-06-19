import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const SalesVelocityCard = ({ velocity }) => {
  return (
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-slate-900">Sales Velocity</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500">Revenue generated per day</p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Zap className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold text-white dark:text-slate-900">
          {formatCurrency(velocity)}<span className="text-lg text-gray-400 dark:text-slate-500 font-medium">/day</span>
        </div>
        
        <div className="flex items-center mt-4 text-sm">
          <div className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15%
          </div>
          <span className="text-gray-400 dark:text-slate-500 ml-2">vs previous period</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400 dark:text-gray-500">
          Based on (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length
        </p>
      </div>
    </div>
  );
};

