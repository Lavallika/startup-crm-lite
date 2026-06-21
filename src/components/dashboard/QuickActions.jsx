import React from 'react';
import { Plus, Users, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import toast from 'react-hot-toast';

/**
 * Quick Actions panel — full-width touch-friendly buttons on all screen sizes.
 */
const QuickActions = () => {
  const { leads } = useLeads();

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads to export.');
      return;
    }
    
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Date Added'];
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toISOString().split('T')[0];
      } catch (e) {
        return dateStr;
      }
    };

    const rows = leads.map(lead => [
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
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('All leads exported successfully!', {
      style: { border: '1px solid #22C55E', color: '#166534' }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {/* Add New Lead — links to leads page which opens the modal */}
        <NavLink
          to="/leads"
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm min-h-[44px]"
        >
          <Plus size={18} className="flex-shrink-0" />
          Add New Lead
        </NavLink>

        <NavLink
          to="/leads"
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
        >
          <Users size={18} className="flex-shrink-0 text-gray-500 dark:text-gray-400" />
          View All Leads
        </NavLink>

        <button
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          onClick={handleExportCSV}
        >
          <Download size={18} className="flex-shrink-0 text-gray-500 dark:text-gray-400" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
