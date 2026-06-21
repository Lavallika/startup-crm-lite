import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const LineChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-green-600 dark:text-green-400 font-bold">{payload[0].value}% Conversion</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-96 flex flex-col group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Monthly Conversion Trend</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Win rate percentage over time</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 font-medium">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={CHART_COLORS.success} floodOpacity="0.4"/>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDarkMode ? '#E2E8F0' : '#374151'} opacity={0.5} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#64748b' : '#9CA3AF', fontSize: 13, fontWeight: 500 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#64748b' : '#9CA3AF', fontSize: 13, fontWeight: 500 }}
                domain={[0, 100]}
                tickFormatter={(tick) => `${tick}%`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDarkMode ? '#CBD5E1' : '#475569', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={CHART_COLORS.success} 
                strokeWidth={4}
                dot={{ r: 5, fill: isDarkMode ? '#fff' : '#111827', strokeWidth: 3, stroke: CHART_COLORS.success }}
                activeDot={{ r: 7, strokeWidth: 0, fill: CHART_COLORS.success }}
                animationDuration={1500}
                animationEasing="ease-out"
                filter="url(#shadow)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

