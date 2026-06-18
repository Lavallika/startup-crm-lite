import React from 'react';
import { Plus, Users, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/**
 * Quick Actions panel — full-width touch-friendly buttons on all screen sizes.
 */
const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-slate-100 dark:border-gray-700 h-full">
      <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {/* Add New Lead — links to leads page which opens the modal */}
        <NavLink
          to="/leads"
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm min-h-[44px]"
        >
          <Plus size={18} className="flex-shrink-0" />
          Add New Lead
        </NavLink>

        <NavLink
          to="/leads"
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
        >
          <Users size={18} className="flex-shrink-0 text-slate-500 dark:text-gray-400" />
          View All Leads
        </NavLink>

        <button
          className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
          onClick={() => {/* Export handler */}}
        >
          <Download size={18} className="flex-shrink-0 text-slate-500 dark:text-gray-400" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
