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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Overview</h3>
      
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex mb-6">
        {totalLeads > 0 ? statuses.map((status) => (
          <div
            key={status.label}
            style={{ width: `${(status.count / totalLeads) * 100}%` }}
            className={`h-full ${status.color} transition-all duration-500`}
            title={`${status.label}: ${status.count}`}
          />
        )) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full ${status.color} mr-2`} />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{status.label}</span>
            </div>
            <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{status.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineOverview;
