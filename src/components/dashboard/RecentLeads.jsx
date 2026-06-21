import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Recent Leads — responsive table with horizontal scroll on mobile.
 * Mobile: compact rows, fewer columns visible, scrollable.
 */
const RecentLeads = ({ leads }) => {
  const recentLeads = [...leads].slice(0, 5);

  const getStatusBadge = (status) => {
    const styles = {
      'New':                'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',
      'Contacted':          'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',
      'Meeting Scheduled':  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Proposal Sent':      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Won':                'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300',
      'Lost':               'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300',
    };

    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Card header */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
        <NavLink
          to="/leads"
          className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors min-h-[44px] flex items-center px-1"
        >
          View All
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
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4 md:px-6">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-none">
                      {lead.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell truncate max-w-[140px] md:max-w-none">
                    {lead.company}
                  </td>
                  <td className="py-3 px-4 md:px-6">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="py-3 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                    {lead.dateAdded}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No recent leads found.
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
