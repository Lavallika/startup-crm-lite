import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const LeadSourceChart = ({ data }) => {
  const { isDarkMode } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 dark:bg-white p-3 border border-gray-700 dark:border-slate-200 shadow-lg rounded-lg">
          <p className="font-medium text-white dark:text-slate-900 mb-1">{label}</p>
          <p className="text-purple-600 font-semibold">{payload[0].value} Leads</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-96 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-slate-900">Lead Sources</h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">Where are leads coming from?</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#374151' : '#E2E8F0'} />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={80}
              />
              <Tooltip cursor={{ fill: isDarkMode ? '#1F2937' : '#F1F5F9' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill={CHART_COLORS.purple} 
                radius={[0, 4, 4, 0]} 
                animationDuration={1000}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

