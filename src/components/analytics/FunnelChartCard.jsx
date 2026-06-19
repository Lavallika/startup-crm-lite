import React from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const FunnelChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 dark:bg-white p-3 border border-gray-700 dark:border-slate-200 shadow-lg rounded-lg">
          <p className="font-medium text-white dark:text-slate-900">{data.name}</p>
          <p className="text-slate-600 dark:text-gray-400">{data.value} Leads</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-96 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-slate-900">Sales Funnel</h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">Conversion across stages</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                <LabelList position="right" fill={isDarkMode ? '#9CA3AF' : '#475569'} stroke="none" dataKey="name" />
                <LabelList position="center" fill="#fff" stroke="none" dataKey="value" />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

