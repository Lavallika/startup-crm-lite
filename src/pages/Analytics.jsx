import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

// Components
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { StatsCards } from '../components/analytics/StatsCards';
import { PieChartCard } from '../components/analytics/PieChartCard';
import { FunnelChartCard } from '../components/analytics/FunnelChartCard';
import { BarChartCard } from '../components/analytics/BarChartCard';
import { LineChartCard } from '../components/analytics/LineChartCard';
import { RevenueChartCard } from '../components/analytics/RevenueChartCard';
import { LeadSourceChart } from '../components/analytics/LeadSourceChart';
import { SalesVelocityCard } from '../components/analytics/SalesVelocityCard';
import { ForecastCard } from '../components/analytics/ForecastCard';
import { ActivityHeatmap } from '../components/analytics/ActivityHeatmap';
import { TopPerformersCard } from '../components/analytics/TopPerformersCard';
import { EmptyAnalyticsState } from '../components/analytics/EmptyAnalyticsState';
import { LoadingSkeleton } from '../components/analytics/LoadingSkeleton';

const Analytics = () => {
  const { leads, stats, filterRange, setFilterRange, helpers } = useAnalytics();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header & Filters ─────────────────────────────────────────
              Mobile:  stacked (header → filter strip below)
              Desktop: side by side
          ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-gray-400 mt-1">
              Track sales performance and growth trends.
            </p>
          </div>
          {/* Filter bar scrollable horizontally on mobile */}
          <div className="overflow-x-auto pb-1 flex-shrink-0">
            <AnalyticsFilters value={filterRange} onChange={setFilterRange} />
          </div>
        </div>

        {leads.length === 0 ? (
          <EmptyAnalyticsState />
        ) : (
          <>
            {/* ── KPIs ───────────────────────────────────────────────────
                  Mobile:  1 column
                  Tablet:  2 column
                  Desktop: 3→6 column auto
              ─────────────────────────────────────────────────────────── */}
            <StatsCards stats={stats} />

            {/* ── Charts Row 1: Pie + Funnel ────────────────────────────
                  Mobile:  full-width, stacked
                  Tablet+: 2 columns
              ─────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <PieChartCard
                data={helpers.getStatusDistribution(leads)}
                totalLeads={stats.totalLeads}
              />
              <FunnelChartCard data={helpers.getFunnelData(leads)} />
            </div>

            {/* ── Charts Row 2: Bar + Line ──────────────────────────────*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <BarChartCard data={helpers.getMonthlyLeads(leads)} />
              <LineChartCard data={helpers.getConversionByMonth(leads)} />
            </div>

            {/* ── Charts Row 3: Revenue + Lead Source ───────────────────*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <RevenueChartCard data={helpers.getRevenueByMonth(leads)} />
              <LeadSourceChart data={helpers.getLeadSourceStats(leads)} />
            </div>

            {/* ── Charts Row 4: Activity + Top Performers ───────────────*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ActivityHeatmap data={helpers.getActivityHeatmapData(leads)} />
              <TopPerformersCard performers={helpers.getTopPerformers(leads)} />
            </div>

            {/* ── Row 5: Forecast + Sales Velocity ─────────────────────
                  Mobile:  stacked
                  Desktop: side by side (each col-span-2 of 4)
              ─────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ForecastCard forecast={helpers.getForecastRevenue(leads)} />
              <SalesVelocityCard velocity={helpers.getSalesVelocity(leads)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
