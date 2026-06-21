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
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[data.name] || '#94A3B8' }} />
            <p className="text-gray-600 dark:text-gray-300 font-medium">{data.value} Leads</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-96 flex flex-col group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Sales Funnel</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Conversion across stages</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                <LabelList position="right" fill={isDarkMode ? '#475569' : '#9CA3AF'} stroke="none" dataKey="name" fontSize={13} fontWeight={500} />
                <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={14} fontWeight={700} />
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

