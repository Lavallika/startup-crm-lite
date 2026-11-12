import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Lead table — horizontally scrollable on small viewports.
 * Rows and actions meet touch target standards.
 */
const LeadTable = ({ leads = [], onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs md:text-sm border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 md:px-6 font-semibold">Name</th>
              <th className="py-3 px-4 md:px-6 font-semibold">Company</th>
              <th className="py-3 px-4 md:px-6 font-semibold">Status</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden lg:table-cell">Email</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden xl:table-cell">Source</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden lg:table-cell">Date Added</th>
              <th className="py-3 px-4 md:px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={lead.id || lead._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer"
                  onClick={() => onView && onView(lead)}
                >
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[150px] md:max-w-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lead.name}
                    </div>
                    {lead.phone && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 lg:hidden truncate max-w-[150px]">
                        {lead.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px] md:max-w-none">
                    {lead.company}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    <span className="truncate block max-w-[200px]">
                      {lead.email}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell">
                    {lead.source || 'Website'}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                    {lead.dateAdded || (lead.createdAt ? lead.createdAt.split('T')[0] : '')}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(lead)}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          aria-label={`View details of ${lead.name}`}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        aria-label={`Edit ${lead.name}`}
                        title="Edit Lead"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(lead.id || lead._id)}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label={`Delete ${lead.name}`}
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
