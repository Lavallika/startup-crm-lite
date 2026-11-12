import React from 'react';

/**
 * A card component displaying a key metric with an icon and optional percentage change.
 * 
 * @param {{
 *   title: string,
 *   value: string | number,
 *   icon: React.ElementType,
 *   change?: number,
 *   color?: 'primary' | 'success' | 'warning' | 'danger' | 'purple',
 *   subtitle?: string
 * }} props
 */
const StatsCard = ({ title, value, icon: Icon, change, color = 'primary', subtitle }) => {
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    success: 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    warning: 'text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    danger:  'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    purple:  'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  };

  const hasChange = typeof change === 'number' && !isNaN(change);
  const isPositive = hasChange && change >= 0;
  const changeColor = isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-5 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 md:p-3 rounded-xl flex-shrink-0 ml-3 ${colorClasses[color] || colorClasses.primary}`}>
          <Icon size={22} className="md:w-6 md:h-6" />
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center text-xs text-gray-500 dark:text-gray-400">
        {hasChange ? (
          <>
            <span className={`font-semibold mr-1.5 ${changeColor}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span>vs previous period</span>
          </>
        ) : (
          <span>{subtitle || 'Real-time database count'}</span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
