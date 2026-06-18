import React, { useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../context/LeadContext';

/**
 * Main Leads page component.
 * 
 * Responsive behaviour:
 *  - Mobile  (<md): card view only, full-screen modal
 *  - Tablet  (md):  toggle between card & table, centered modal max-w-lg
 *  - Desktop (lg+): table view default, centered modal max-w-lg
 *
 * @returns {JSX.Element}
 */
const Leads = () => {
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // On md+ screens, default to table; on smaller screens card is forced anyway
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredLeads = leads
    .filter(lead => activeFilter === 'All' || lead.status === activeFilter)
    .filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  const handleAddLeadClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLeadClick = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      toast.success('Lead deleted successfully', {
        iconTheme: { primary: '#EF4444', secondary: '#fff' },
        style: { border: '1px solid #EF4444', color: '#EF4444' }
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleSubmitForm = (leadData) => {
    if (selectedLead) {
      updateLead(selectedLead.id, leadData);
      toast.success('Lead updated successfully', {
        style: { border: '1px solid #22C55E', color: '#166534' }
      });
    } else {
      addLead(leadData);
      toast.success('Lead added successfully', {
        style: { border: '1px solid #22C55E', color: '#166534' }
      });
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 relative">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100">
              Leads
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              Manage and track your potential customers.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* View Toggle — tablet and above only */}
            <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  viewMode === 'table'
                    ? 'bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-100'
                    : 'text-slate-400 dark:text-gray-500 hover:text-slate-600'
                }`}
                aria-label="Table view"
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  viewMode === 'card'
                    ? 'bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-100'
                    : 'text-slate-400 dark:text-gray-500 hover:text-slate-600'
                }`}
                aria-label="Card view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Add Lead button — full label on md+, icon-only on mobile */}
            <button
              onClick={handleAddLeadClick}
              className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm min-w-[44px] min-h-[44px]"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>

        {/* ── Search and Filters ────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="overflow-x-auto pb-1">
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
          </div>
        </div>

        {/* ── Content Area ─────────────────────────────────────────────
              Mobile (<md):  card view always
              Tablet (md):   toggle between card and table
              Desktop (lg+): table default (toggle still available)
          ─────────────────────────────────────────────────────────── */}
        <div className="w-full">

          {/* MOBILE: always card view */}
          <div className="md:hidden space-y-4">
            {filteredLeads.length > 0
              ? filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleEditLeadClick}
                    onDelete={handleDeleteLeadClick}
                  />
                ))
              : <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
            }
          </div>

          {/* TABLET + DESKTOP: honour viewMode toggle */}
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              filteredLeads.length > 0 ? (
                <LeadTable
                  leads={filteredLeads}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLeadClick}
                />
              ) : (
                <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleEditLeadClick}
                    onDelete={handleDeleteLeadClick}
                  />
                ))}
                {filteredLeads.length === 0 && (
                  <div className="col-span-full">
                    <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────
            Mobile:  full screen (no rounded corners, fills viewport)
            Tablet+: centered with max-w-lg and rounded corners
        ─────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal panel */}
          <div
            className="
              relative w-full h-full md:h-auto
              md:max-w-lg
              bg-white dark:bg-gray-800
              rounded-none md:rounded-xl
              shadow-xl overflow-hidden
              flex flex-col
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex-shrink-0">
              <h2
                id="modal-title"
                className="text-lg md:text-xl font-semibold text-slate-800 dark:text-gray-100"
              >
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body — scrollable on mobile full-screen */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
