import React from 'react';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The status of the lead
 */

/**
 * A pill-shaped badge component that visually indicates the lead's status.
 *
 * @param {StatusBadgeProps} props
 * @returns {JSX.Element}
 */
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'New':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Meeting Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Proposal Sent':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Won':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
