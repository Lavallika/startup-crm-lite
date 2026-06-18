import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Lead table — horizontally scrollable on any small viewport.
 * All action buttons meet the 44×44px touch target requirement.
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-900/50 text-slate-500 dark:text-gray-400 text-xs md:text-sm border-b border-slate-200 dark:border-gray-700">
              <th className="py-3 px-4 md:px-6 font-semibold">Name</th>
              <th className="py-3 px-4 md:px-6 font-semibold">Company</th>
              <th className="py-3 px-4 md:px-6 font-semibold">Status</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden lg:table-cell">Email</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden xl:table-cell">Source</th>
              <th className="py-3 px-4 md:px-6 font-semibold hidden lg:table-cell">Date Added</th>
              <th className="py-3 px-4 md:px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <div className="font-medium text-sm text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">
                      {lead.name}
                    </div>
                    {lead.phone && (
                      <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 lg:hidden truncate max-w-[150px]">
                        {lead.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-slate-700 dark:text-gray-300 truncate max-w-[120px] md:max-w-none">
                    {lead.company}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-slate-600 dark:text-gray-400 hidden lg:table-cell">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:underline truncate block max-w-[200px]"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-slate-600 dark:text-gray-400 hidden xl:table-cell">
                    {lead.source}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-slate-600 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                    {lead.dateAdded}
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    {/* Actions — always visible (not opacity-0 on mobile for touch usability) */}
                    <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(lead)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">
                  No leads found. Add a new lead to get started.
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
