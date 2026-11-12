import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  XCircle, 
  RefreshCw, 
  Plus, 
  X 
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import LeadForm from '../components/leads/LeadForm';
import { useLeads } from '../context/LeadContext';
import { useAuth } from '../context/AuthContext';

/**
 * Main Dashboard page component.
 * Displays dynamic metrics, pipeline overview, recent leads, and quick actions.
 * All figures derived directly from MongoDB for the authenticated user.
 * 
 * @returns {JSX.Element}
 */
const Dashboard = () => {
  const { leads, stats, isLoading, refreshLeads, addLead } = useLeads();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateLead = async (leadData) => {
    const res = await addLead(leadData);
    if (res.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── Welcome Header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, <span className="font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'User'}</span>! Here is your real-time sales pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => refreshLeads()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 min-h-[44px] cursor-pointer"
              title="Refresh lead statistics from database"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin text-indigo-600' : 'text-gray-500'} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* ── Key Lead Statistics (Dynamic from MongoDB) ────────────────
              5 Dynamic KPI Cards:
              1. Total Leads
              2. New Leads
              3. Qualified Leads
              4. Converted Leads (Won)
              5. Lost Leads
          ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          <StatsCard 
            title="Total Leads" 
            value={stats.totalLeads.toLocaleString()} 
            icon={Users} 
            color="primary" 
            subtitle="Active CRM records"
          />
          <StatsCard 
            title="New Leads" 
            value={stats.newLeads.toLocaleString()} 
            icon={Sparkles} 
            color="primary" 
            subtitle="Awaiting initial outreach"
          />
          <StatsCard 
            title="Qualified Leads" 
            value={stats.qualifiedLeads.toLocaleString()} 
            icon={CheckCircle2} 
            color="purple" 
            subtitle="Meetings & verified interest"
          />
          <StatsCard 
            title="Converted Leads" 
            value={stats.convertedLeads.toLocaleString()} 
            icon={TrendingUp} 
            color="success" 
            subtitle={`${stats.conversionRate}% conversion rate`}
          />
          <StatsCard 
            title="Lost Leads" 
            value={stats.lostLeads.toLocaleString()} 
            icon={XCircle} 
            color="danger" 
            subtitle="Closed or disqualified"
          />
        </div>

        {/* ── Pipeline Overview (Guaranteed Parity with Total Leads) ── */}
        <PipelineOverview leads={leads} />

        {/* ── Bottom Section: Recent Leads & Quick Actions ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentLeads leads={leads} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

      </div>

      {/* ── Quick Add Lead Modal ───────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="relative w-full h-full md:h-auto md:max-w-lg bg-white dark:bg-gray-800 rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-gray-200 dark:border-gray-700"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                Add New Lead
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <LeadForm
                onSubmit={handleCreateLead}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
