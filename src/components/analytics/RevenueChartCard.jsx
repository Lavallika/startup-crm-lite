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
        <div className="bg-gray-800 dark:bg-white p-3 border border-gray-700 dark:border-slate-200 shadow-lg rounded-lg">
          <p className="font-medium text-white dark:text-slate-900 mb-1">{label} Revenue</p>
          <p className="text-emerald-600 font-semibold">{formattedRevenue}</p>
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
    <div className="bg-gray-800 dark:bg-white rounded-2xl p-6 border border-gray-700 dark:border-slate-200 shadow-sm hover:shadow-md transition-all h-96 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-slate-900">Revenue Analytics</h3>
        <p className="text-sm text-gray-400 dark:text-slate-500">Won deal value over time</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={CHART_COLORS.success} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

