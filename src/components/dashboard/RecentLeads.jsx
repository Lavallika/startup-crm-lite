import React from 'react';
import { NavLink } from 'react-router-dom';
import StatusBadge from '../leads/StatusBadge';

/**
 * Recent Leads — responsive table showing the 5 most recently added leads.
 * Mobile: compact rows, horizontally scrollable.
 */
const RecentLeads = ({ leads = [] }) => {
  // Sort by newest first to ensure accurate representation of recent additions
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || b.dateAdded || 0) - new Date(a.createdAt || a.dateAdded || 0))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Card header */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Recent Leads
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Latest additions to your database
          </p>
        </div>
        <NavLink
          to="/leads"
          className="text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors min-h-[44px] flex items-center px-1"
        >
          View All ({leads.length})
        </NavLink>
      </div>

      {/* Horizontally scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ minWidth: '480px' }}>
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs md:text-sm">
              <th className="py-2.5 md:py-3 px-4 md:px-6 font-medium">Name</th>
              <th className="py-2.5 md:py-3 px-4 md:px-6 font-medium hidden sm:table-cell">Company</th>
              <th className="py-2.5 md:py-3 px-4 md:px-6 font-medium">Status</th>
              <th className="py-2.5 md:py-3 px-4 md:px-6 font-medium hidden md:table-cell">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr key={lead.id || lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4 md:px-6">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-none">
                      {lead.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell truncate max-w-[140px] md:max-w-none">
                    {lead.company}
                  </td>
                  <td className="py-3 px-4 md:px-6">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {lead.dateAdded || (lead.createdAt ? lead.createdAt.split('T')[0] : 'Today')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No leads recorded yet. Click "Add Lead" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
