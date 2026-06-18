import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold">
        {value}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#64748b" className="text-sm">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const PieChartCard = ({ data, totalLeads }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalLeads ? Math.round((data.value / totalLeads) * 100) : 0;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-slate-200 dark:border-gray-700 shadow-lg rounded-lg">
          <p className="font-medium text-slate-900 dark:text-white">{data.name}</p>
          <p className="text-slate-600 dark:text-gray-400">{data.value} Leads</p>
          <p className="text-slate-500 dark:text-gray-400 text-sm">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-96 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead Status Distribution</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">Current pipeline breakdown</p>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500">No data available</div>
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              {/* Only show center text if not hovering on a slice (activeIndex is handled, but fallback center text is nice) */}
              {activeIndex === null && (
                 <>
                   <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalLeads}</span>
                   <span className="text-sm text-slate-500 dark:text-gray-400">Total Leads</span>
                 </>
              )}
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#CBD5E1'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry, index) => {
                    const count = data.find(d => d.name === value)?.value || 0;
                    const pct = totalLeads ? Math.round((count / totalLeads) * 100) : 0;
                    return <span className="text-slate-700 dark:text-gray-300 font-medium ml-1">{value} <span className="text-slate-400 dark:text-gray-500 font-normal ml-1">{count} ({pct}%)</span></span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

