import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const BarChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <p className="text-blue-600 dark:text-blue-400 font-bold">{payload[0].value} Leads</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-96 flex flex-col group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Monthly Leads Trend</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Lead generation over the last 6 months</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 font-medium">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={1}/>
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.6}/>
                </linearGradient>
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
                dx={-10}
              />
              <Tooltip cursor={{ fill: isDarkMode ? '#F8FAFC' : '#1F2937' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#colorCount)" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

