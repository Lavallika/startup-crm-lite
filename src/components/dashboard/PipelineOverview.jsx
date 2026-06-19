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
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of lead objects
 */

/**
 * A component that displays a visual horizontal bar with colored segments for each lead status.
 * 
 * @param {PipelineOverviewProps} props - The component props
 * @returns {JSX.Element} The rendered PipelineOverview component
 */
const PipelineOverview = ({ leads }) => {
  const totalLeads = leads.length;

  const counts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statuses = [
    { label: 'New', color: 'bg-blue-600', count: counts['New'] || 0 },
    { label: 'Contacted', color: 'bg-amber-500', count: counts['Contacted'] || 0 },
    { label: 'Qualified', color: 'bg-indigo-500', count: counts['Qualified'] || 0 },
    { label: 'Proposal', color: 'bg-purple-500', count: counts['Proposal'] || 0 },
    { label: 'Won', color: 'bg-green-500', count: counts['Won'] || 0 },
  ];

  return (
    <div className="bg-gray-800 dark:bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-700 dark:border-slate-100">
      <h3 className="text-base md:text-lg font-semibold text-white dark:text-slate-800 mb-4">Pipeline Overview</h3>
      
      <div className="h-4 w-full bg-gray-700 dark:bg-slate-100 rounded-full overflow-hidden flex mb-6">
        {totalLeads > 0 ? statuses.map((status) => (
          <div
            key={status.label}
            style={{ width: `${(status.count / totalLeads) * 100}%` }}
            className={`h-full ${status.color} transition-all duration-500`}
            title={`${status.label}: ${status.count}`}
          />
        )) : (
          <div className="h-full w-full bg-slate-200 dark:bg-gray-600" />
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full ${status.color} mr-2`} />
              <span className="text-xs font-medium text-slate-600 dark:text-gray-400">{status.label}</span>
            </div>
            <span className="text-base md:text-lg font-bold text-white dark:text-slate-800">{status.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineOverview;
