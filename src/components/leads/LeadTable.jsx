import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {string} status
 * @property {string} source
 * @property {string} dateAdded
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads
 * @property {Function} onEdit
 * @property {Function} onDelete
 */

/**
 * A table view component for listing all leads.
 *
 * @param {LeadTableProps} props
 * @returns {JSX.Element}
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="py-3 px-6 font-semibold">Name</th>
              <th className="py-3 px-6 font-semibold">Company</th>
              <th className="py-3 px-6 font-semibold">Status</th>
              <th className="py-3 px-6 font-semibold">Email</th>
              <th className="py-3 px-6 font-semibold">Source</th>
              <th className="py-3 px-6 font-semibold">Date Added</th>
              <th className="py-3 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{lead.name}</div>
                    {lead.phone && <div className="text-sm text-slate-500 mt-0.5">{lead.phone}</div>}
                  </td>
                  <td className="py-4 px-6 text-slate-700">{lead.company}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <a href={`mailto:${lead.email}`} className="hover:text-blue-600 focus:outline-none focus:underline">{lead.email}</a>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{lead.source}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{lead.dateAdded}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
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
