import React from 'react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title of the metric
 * @property {string|number} value - The main value to display
 * @property {React.ElementType} icon - The Lucide React icon component
 * @property {number} change - The percentage change compared to the previous period
 * @property {'primary' | 'success' | 'warning' | 'danger'} color - The color theme for the icon
 */

/**
 * A card component displaying a key metric with an icon and percentage change.
 * 
 * @param {StatsCardProps} props - The component props
 * @returns {JSX.Element} The rendered StatsCard component
 */
const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const colorClasses = {
    primary: 'text-blue-600 bg-blue-100',
    success: 'text-green-500 bg-green-100',
    warning: 'text-amber-500 bg-amber-100',
    danger: 'text-red-500 bg-red-100',
  };

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-slate-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
