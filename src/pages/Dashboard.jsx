import React from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

/**
 * The main Dashboard page component that assembles various dashboard widgets.
 * 
 * @returns {JSX.Element} The rendered Dashboard page
 */
const Dashboard = () => {
  const { leads } = useLeads();

  return (
    <div className="bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your leads today.</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Leads" 
            value="1,284" 
            icon={Users} 
            change={12.5} 
            color="primary" 
          />
          <StatsCard 
            title="Conversion Rate" 
            value="18.2%" 
            icon={TrendingUp} 
            change={4.1} 
            color="success" 
          />
          <StatsCard 
            title="Revenue Pipeline" 
            value="$42,500" 
            icon={DollarSign} 
            change={8.3} 
            color="warning" 
          />
          <StatsCard 
            title="Active Proposals" 
            value="24" 
            icon={Activity} 
            change={-2.4} 
            color="danger" 
          />
        </div>

        {/* Pipeline Overview */}
        <div className="w-full">
          <PipelineOverview leads={leads} />
        </div>

        {/* Bottom Row: Recent Leads & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
