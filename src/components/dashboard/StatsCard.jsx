import React from 'react';

/**
 * A card component displaying a key metric with an icon and percentage change.
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    success:  'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    warning:  'text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    danger:   'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  };

  const isPositive  = change >= 0;
  const changeColor = isPositive
    ? 'text-green-500 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </h3>
        </div>
        {/* Icon — slightly smaller on mobile */}
        <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ml-3 ${colorClasses[color] || colorClasses.primary}`}>
          <Icon size={20} className="md:hidden" />
          <Icon size={24} className="hidden md:block" />
        </div>
      </div>
      <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm">
        <span className={`font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
