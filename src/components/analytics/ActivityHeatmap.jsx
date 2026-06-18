import React, { useMemo } from 'react';

// A simple heatmap representation similar to GitHub's contribution graph
export const ActivityHeatmap = ({ data }) => {
  // Generate a flat array of days for the last 3 months (~90 days)
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = data.find(item => item.date === dateStr);
      arr.push({
        date: dateStr,
        count: match ? match.count : 0
      });
    }
    return arr;
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-gray-700';
    if (count <= 2) return 'bg-blue-200';
    if (count <= 5) return 'bg-blue-400';
    if (count <= 10) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Heatmap</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">Leads created & interactions over 90 days</p>
      </div>

      <div className="flex gap-1 flex-wrap content-start">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`w-3.5 h-3.5 rounded-sm ${getColor(day.count)} transition-all hover:ring-2 ring-blue-300`}
            title={`${day.date}: ${day.count} activities`}
          ></div>
        ))}
      </div>
      
      <div className="flex items-center justify-end mt-4 text-xs text-slate-500 dark:text-gray-400 space-x-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-gray-700"></div>
        <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
        <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
        <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
        <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
        <span>More</span>
      </div>
    </div>
  );
};

