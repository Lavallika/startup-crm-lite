import React from 'react';
import { TrendingUp, Users, Target, IndianRupee, Clock, TrendingDown } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      trend: '+12%',
      trendUp: true,
      color: 'bg-blue-500',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      trend: '+2.4%',
      trendUp: true,
      color: 'bg-green-500',
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: IndianRupee,
      trend: '+5%',
      trendUp: true,
      color: 'bg-purple-500',
    },
    {
      title: 'Won Revenue',
      value: formatCurrency(stats.wonRevenue),
      icon: TrendingUp,
      trend: '+18%',
      trendUp: true,
      color: 'bg-emerald-500',
    },
    {
      title: 'Avg Sales Cycle',
      value: `${stats.avgSalesCycle} Days`,
      icon: Clock,
      trend: '-2 Days',
      trendUp: true,
      color: 'bg-amber-500',
    },
    {
      title: 'Lost Rate',
      value: `${stats.lostRate}%`,
      icon: TrendingDown,
      trend: '-1.2%',
      trendUp: true,
      color: 'bg-red-500',
    },
  ];

  return (
    /*
      Mobile:  1 column
      Tablet:  2 columns
      Desktop: 3 columns → on xl 6 columns (auto-fit)
    */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`p-2 rounded-lg text-white ${card.color}`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className={`text-xs md:text-sm font-medium ${card.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {card.trend}
              </div>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {card.title}
              </h4>
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {card.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
