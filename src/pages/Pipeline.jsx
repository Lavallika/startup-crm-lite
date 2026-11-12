import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Building, 
  Mail, 
  Phone, 
  Layers,
  X
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { PIPELINE_STAGES, getLeadStage } from '../constants/leadStatuses';
import LeadForm from '../components/leads/LeadForm';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';

/**
 * Pipeline Kanban Board Page
 * Provides visual stage columns with quick lead progression and MongoDB sync.
 */
const Pipeline = () => {
  const { leads, updateLeadStatus, addLead, updateLead, deleteLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStageForNewLead, setDefaultStageForNewLead] = useState('New');
  const [detailsLead, setDetailsLead] = useState(null);
  const [editLead, setEditLead] = useState(null);

  // Group filtered leads by canonical pipeline stage
  const stageColumns = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = leads.filter((lead) => {
      if (!q) return true;
      return (
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.company || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q)
      );
    });

    const columns = {};
    PIPELINE_STAGES.forEach((stage) => {
      columns[stage.id] = [];
    });

    filtered.forEach((lead) => {
      const stage = getLeadStage(lead.status);
      if (columns[stage]) {
        columns[stage].push(lead);
      } else {
        columns['New'].push(lead);
      }
    });

    return columns;
  }, [leads, searchQuery]);

  const handleMoveStage = async (e, leadId, newStage) => {
    e.stopPropagation();
    await updateLeadStatus(leadId, newStage);
  };

  const handleOpenAddModal = (stageId = 'New') => {
    setDefaultStageForNewLead(stageId);
    setEditLead(null);
    setIsModalOpen(true);
  };

  const handleCreateLead = async (leadData) => {
    const res = await addLead({
      ...leadData,
      status: defaultStageForNewLead
    });
    if (res.success) {
      setIsModalOpen(false);
    }
  };

  const handleUpdateLead = async (leadData) => {
    if (editLead) {
      const res = await updateLead(editLead.id || editLead._id, leadData);
      if (res.success) {
        setIsModalOpen(false);
        setEditLead(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 flex flex-col transition-colors">
      <div className="max-w-[1600px] w-full mx-auto space-y-6 flex-1 flex flex-col">

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Layers size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Sales Pipeline
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visualize deal progression, drag/shift leads across stages, and maintain 100% pipeline integrity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm">
              Total Pipeline Leads: <strong className="ml-1 text-indigo-600 dark:text-indigo-400">{leads.length}</strong>
            </span>

            <button
              type="button"
              onClick={() => handleOpenAddModal('New')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* ── Search Bar ────────────────────────────────────────────── */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter pipeline leads by name, company, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Kanban Columns Board ──────────────────────────────────── */}
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1300px] items-start">
            {PIPELINE_STAGES.map((stage, stageIndex) => {
              const stageLeads = stageColumns[stage.id] || [];
              const prevStage = stageIndex > 0 ? PIPELINE_STAGES[stageIndex - 1] : null;
              const nextStage = stageIndex < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[stageIndex + 1] : null;

              return (
                <div
                  key={stage.id}
                  className="flex-1 min-w-[250px] max-w-[320px] bg-gray-100/70 dark:bg-gray-800/60 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/70 flex flex-col max-h-[calc(100vh-250px)]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {stage.label}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-xs border border-gray-200 dark:border-gray-600">
                        {stageLeads.length}
                      </span>
                      <button
                        onClick={() => handleOpenAddModal(stage.id)}
                        className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title={`Add lead in ${stage.label}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1">
                    {stageLeads.length > 0 ? (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id || lead._id}
                          onClick={() => setDetailsLead(lead)}
                          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xs hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-600"
                        >
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {lead.name}
                            </h4>
                          </div>

                          <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center truncate">
                              <Building size={13} className="mr-1.5 text-gray-400 shrink-0" />
                              <span className="truncate">{lead.company}</span>
                            </div>
                            <div className="flex items-center truncate">
                              <Mail size={13} className="mr-1.5 text-gray-400 shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center truncate">
                                <Phone size={13} className="mr-1.5 text-gray-400 shrink-0" />
                                <span className="truncate">{lead.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Stage Transition Controls */}
                          <div 
                            className="pt-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {prevStage ? (
                              <button
                                type="button"
                                onClick={(e) => handleMoveStage(e, lead.id || lead._id, prevStage.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={`Move back to ${prevStage.label}`}
                              >
                                <ChevronLeft size={14} />
                                <span className="hidden xl:inline">{prevStage.label}</span>
                              </button>
                            ) : <div />}

                            <div className="text-[10px] text-gray-400">
                              {lead.dateAdded || (lead.createdAt ? lead.createdAt.split('T')[0] : '')}
                            </div>

                            {nextStage ? (
                              <button
                                type="button"
                                onClick={(e) => handleMoveStage(e, lead.id || lead._id, nextStage.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                title={`Advance to ${nextStage.label}`}
                              >
                                <span className="hidden xl:inline">{nextStage.label}</span>
                                <ChevronRight size={14} />
                              </button>
                            ) : <div />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700/60 rounded-xl">
                        No leads in {stage.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Add / Edit Lead Modal ──────────────────────────────────── */}
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
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editLead ? 'Edit Lead' : `Add Lead to ${defaultStageForNewLead}`}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <LeadForm
                initialData={editLead || { status: defaultStageForNewLead }}
                onSubmit={editLead ? handleUpdateLead : handleCreateLead}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Details Modal ─────────────────────────────────────── */}
      <LeadDetailsModal
        lead={detailsLead}
        isOpen={Boolean(detailsLead)}
        onClose={() => setDetailsLead(null)}
        onEdit={(lead) => {
          setEditLead(lead);
          setIsModalOpen(true);
        }}
        onDelete={async (id) => {
          if (window.confirm('Are you sure you want to delete this lead?')) {
            await deleteLead(id);
          }
        }}
        onStatusChange={async (id, newStatus) => {
          const res = await updateLeadStatus(id, newStatus);
          if (res.success && detailsLead) {
            setDetailsLead((prev) => ({ ...prev, status: newStatus }));
          }
        }}
      />
    </div>
  );
};

export default Pipeline;
