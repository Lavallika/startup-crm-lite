import React from 'react';
import { Plus, Users, Download } from 'lucide-react';

/**
 * A component providing quick action buttons for common tasks.
 * 
 * @returns {JSX.Element} The rendered QuickActions component
 */
const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-start px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          <Plus size={18} className="mr-3" />
          Add New Lead
        </button>
        <button className="w-full flex items-center justify-start px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors font-medium">
          <Users size={18} className="mr-3 text-slate-500" />
          View All Leads
        </button>
        <button className="w-full flex items-center justify-start px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors font-medium">
          <Download size={18} className="mr-3 text-slate-500" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
