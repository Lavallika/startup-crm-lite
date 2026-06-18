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
 * Manages the leads state, view toggle (table/cards), and the add/edit modal.
 *
 * @returns {JSX.Element}
 */
const Leads = () => {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
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
        iconTheme: { primary: '#EF4444', secondary: '#fff' }, // Red success icon for delete
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
      // Edit mode
      updateLead(selectedLead.id, leadData);
      toast.success('Lead updated successfully', {
        style: { border: '1px solid #22C55E', color: '#166534' }
      });
    } else {
      // Create mode
      addLead(leadData);
      toast.success('Lead added successfully', {
        style: { border: '1px solid #22C55E', color: '#166534' }
      });
    }
    handleCloseModal();
  };

  return (
    <div className="bg-slate-50 p-6 md:p-8 relative">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
            <p className="text-slate-500 mt-1">Manage and track your potential customers.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="hidden sm:flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Table view"
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Card view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <button
              onClick={handleAddLeadClick}
              className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
        </div>

        {/* Content area */}
        <div className="w-full">
          {/* Mobile always shows cards, desktop honors the viewMode toggle */}
          <div className={`sm:hidden space-y-4`}>
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleEditLeadClick} onDelete={handleDeleteLeadClick} />
            ))}
            {filteredLeads.length === 0 && (
              <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
            )}
          </div>

          <div className="hidden sm:block">
            {viewMode === 'table' ? (
              filteredLeads.length > 0 ? (
                <LeadTable leads={filteredLeads} onEdit={handleEditLeadClick} onDelete={handleDeleteLeadClick} />
              ) : (
                <EmptyState hasLeads={leads.length > 0} onClearFilters={handleClearFilters} />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onEdit={handleEditLeadClick} onDelete={handleDeleteLeadClick} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
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
