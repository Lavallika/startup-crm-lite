import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const LineChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 dark:bg-white p-3 border border-gray-700 dark:border-slate-200 shadow-lg rounded-lg">
          <p className="font-medium text-white dark:text-slate-900 mb-1">{label}</p>
          <p className="text-green-600 font-semibold">{payload[0].value}% Conversion</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-96 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-slate-900">Monthly Conversion Trend</h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">Win rate percentage over time</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#E2E8F0'} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(tick) => `${tick}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={CHART_COLORS.success} 
                strokeWidth={3}
                dot={{ r: 4, fill: CHART_COLORS.success, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

