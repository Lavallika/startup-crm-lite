import React from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * The main Dashboard page component that assembles various dashboard widgets.
 * 
 * @returns {JSX.Element} The rendered Dashboard page
 */
const Dashboard = () => {
  const { leads } = useLeads();
  const { stats } = useAnalytics();

  const activeProposals = leads.filter(l => l.status === 'Proposal Sent').length;

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── Header ───────────────────────────────────────────────── */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-100 dark:text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-400 dark:text-slate-500 mt-1">
            Welcome back! Here's what's happening with your leads today.
          </p>
        </div>

        {/* ── Stats Cards ───────────────────────────────────────────────
              Mobile:  1 column
              Tablet:  2 column
              Desktop: 4 column
          ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard 
            title="Total Leads" 
            value={leads.length.toLocaleString()} 
            icon={Users} 
            change={12.5} 
            color="primary" 
          />
          <StatsCard 
            title="Conversion Rate" 
            value={`${stats.conversionRate}%`} 
            icon={TrendingUp} 
            change={4.1} 
            color="success" 
          />
          <StatsCard 
            title="Revenue Pipeline" 
            value={`$${stats.pipelineValue.toLocaleString()}`} 
            icon={DollarSign} 
            change={8.3} 
            color="warning" 
          />
          <StatsCard 
            title="Active Proposals" 
            value={activeProposals.toString()} 
            icon={Activity} 
            change={-2.4} 
            color="danger" 
          />
        </div>

        {/* ── Pipeline Overview ─────────────────────────────────────── */}
        <PipelineOverview leads={leads} />

        {/* ── Bottom Row: Recent Leads & Quick Actions ──────────────────
              Mobile:  stacked vertically
              Desktop: Recent Leads 2/3, Quick Actions 1/3
          ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <RecentLeads leads={leads} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
