import React, { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List as ListIcon, X, Download, ArrowUpDown } from 'lucide-react';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../context/LeadContext';
import { getLeadStage } from '../constants/leadStatuses';

/**
 * Main Leads page component.
 * Features Search, Status Filters, Sorting, Details View, and responsive Card/Table views.
 * 
 * @returns {JSX.Element}
 */
const Leads = () => {
  const { leads, addLead, updateLead, updateLeadStatus, deleteLead } = useLeads();

  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsLead, setDetailsLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'company' | 'status'

  // Filter and sort leads using derived state
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (activeFilter === 'All') return true;
        return getLeadStage(lead.status) === activeFilter;
      })
      .filter((lead) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
          (lead.name || '').toLowerCase().includes(query) ||
          (lead.company || '').toLowerCase().includes(query) ||
          (lead.email || '').toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || b.dateAdded || 0) - new Date(a.createdAt || a.dateAdded || 0);
          case 'oldest':
            return new Date(a.createdAt || a.dateAdded || 0) - new Date(b.createdAt || b.dateAdded || 0);
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name-desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'company':
            return (a.company || '').localeCompare(b.company || '');
          case 'status':
            return (a.status || '').localeCompare(b.status || '');
          default:
            return 0;
        }
      });
  }, [leads, activeFilter, searchQuery, sortBy]);

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

  const handleViewLeadClick = (lead) => {
    setDetailsLead(lead);
  };

  const handleDeleteLeadClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      await deleteLead(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleSubmitForm = async (leadData) => {
    if (selectedLead) {
      const res = await updateLead(selectedLead.id || selectedLead._id, leadData);
      if (res.success) {
        handleCloseModal();
      }
    } else {
      const res = await addLead(leadData);
      if (res.success) {
        handleCloseModal();
      }
    }
  };

  const handleStatusChangeFromDetails = async (id, newStatus) => {
    const res = await updateLeadStatus(id, newStatus);
    if (res.success && detailsLead && (detailsLead.id === id || detailsLead._id === id)) {
      setDetailsLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      return;
    }
    
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Date Added'];
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toISOString().split('T')[0];
      } catch {
        return dateStr;
      }
    };

    const rows = filteredLeads.map((lead) => [
      `"${lead.name || ''}"`,
      `"${lead.company || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.status || ''}"`,
      `"${lead.source || ''}"`,
      `"${formatDate(lead.dateAdded || lead.createdAt)}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 relative transition-colors">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Leads Management
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
              Manage, search, sort, and track potential customer leads.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* View Toggle — md+ screens */}
            <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Table view"
                title="Table view"
              >
                <ListIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Card view"
                title="Card view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] cursor-pointer"
              aria-label="Export CSV"
              title="Export filtered leads to CSV"
            >
              <Download size={18} className="flex-shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Add Lead button */}
            <button
              type="button"
              onClick={handleAddLeadClick}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] cursor-pointer"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* ── Search, Sort, and Filter Controls ─────────────────────── */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="lead-sort" className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1">
                <ArrowUpDown size={14} />
                <span>Sort by:</span>
              </label>
              <select
                id="lead-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[40px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="company">Company (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 overflow-x-auto">
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
          </div>
        </div>

        {/* ── Active leads count indicator ──────────────────────────── */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>
            Showing <strong className="text-gray-900 dark:text-white">{filteredLeads.length}</strong> of{' '}
            <strong className="text-gray-900 dark:text-white">{leads.length}</strong> total leads
          </span>
          {activeFilter !== 'All' && (
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* ── Content Area ───────────────────────────────────────────── */}
        <div className="w-full">
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id || lead._id}
                  lead={lead}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLeadClick}
                  onView={handleViewLeadClick}
                />
              ))
            ) : (
              <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
            )}
          </div>

          {/* Tablet & Desktop View */}
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              filteredLeads.length > 0 ? (
                <LeadTable
                  leads={filteredLeads}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLeadClick}
                  onView={handleViewLeadClick}
                />
              ) : (
                <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id || lead._id}
                    lead={lead}
                    onEdit={handleEditLeadClick}
                    onDelete={handleDeleteLeadClick}
                    onView={handleViewLeadClick}
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

      {/* ── Create / Edit Lead Modal ───────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div
            className="relative w-full h-full md:h-auto md:max-w-lg bg-white dark:bg-gray-800 rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-gray-200 dark:border-gray-700"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-lead-form-title"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2
                id="modal-lead-form-title"
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseModal}
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
          setSelectedLead(lead);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteLeadClick}
        onStatusChange={handleStatusChangeFromDetails}
      />
    </div>
  );
};

export default Leads;
