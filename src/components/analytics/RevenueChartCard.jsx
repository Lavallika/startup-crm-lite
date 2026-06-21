import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

export const RevenueChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedRevenue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(payload[0].value);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label} Revenue</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">{formattedRevenue}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (tickItem) => {
    if (tickItem >= 100000) {
      return `₹${(tickItem / 100000).toFixed(1)}L`;
    }
    if (tickItem >= 1000) {
      return `₹${(tickItem / 1000).toFixed(0)}k`;
    }
    return `₹${tickItem}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-96 flex flex-col group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Revenue Analytics</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Won deal value over time</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 font-medium">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.05}/>
                </linearGradient>
                <filter id="shadowRev" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={CHART_COLORS.success} floodOpacity="0.3"/>
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
                tickFormatter={formatYAxis}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDarkMode ? '#CBD5E1' : '#475569', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={CHART_COLORS.success} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1500}
                animationEasing="ease-out"
                activeDot={{ r: 7, strokeWidth: 0, fill: CHART_COLORS.success }}
                filter="url(#shadowRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

