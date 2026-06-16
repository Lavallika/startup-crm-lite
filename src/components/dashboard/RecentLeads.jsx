import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {string} id - Lead ID
 * @property {string} name - Lead name
 * @property {string} company - Lead company
 * @property {'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost'} status - Lead status
 * @property {string} dateAdded - Date the lead was added
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of lead objects
 */

/**
 * A component that displays the 5 most recent leads in a clean table.
 * 
 * @param {RecentLeadsProps} props - The component props
 * @returns {JSX.Element} The rendered RecentLeads component
 */
const RecentLeads = ({ leads }) => {
  const recentLeads = [...leads].slice(0, 5);

  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'Contacted': 'bg-amber-100 text-amber-700',
      'Qualified': 'bg-indigo-100 text-indigo-700',
      'Proposal': 'bg-purple-100 text-purple-700',
      'Won': 'bg-green-100 text-green-700',
      'Lost': 'bg-red-100 text-red-700',
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Recent Leads</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="py-3 px-6 font-medium">Name</th>
              <th className="py-3 px-6 font-medium">Company</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-800">{lead.name}</div>
                  </td>
                  <td className="py-3 px-6 text-slate-600">{lead.company}</td>
                  <td className="py-3 px-6">{getStatusBadge(lead.status)}</td>
                  <td className="py-3 px-6 text-slate-600 text-sm">{lead.dateAdded}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500">
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
