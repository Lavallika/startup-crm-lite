import React from 'react';
import { Pencil, Trash2, Mail, Phone, Building } from 'lucide-react';
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
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead
 * @property {Function} onEdit
 * @property {Function} onDelete
 */

/**
 * A card view component for a single lead.
 *
 * @param {LeadCardProps} props
 * @returns {JSX.Element}
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
          <div className="flex items-center text-slate-600 mt-1">
            <Building size={16} className="mr-1.5" />
            <span className="text-sm">{lead.company}</span>
          </div>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-slate-600">
          <Mail size={16} className="mr-2 text-slate-400" />
          <a href={`mailto:${lead.email}`} className="text-sm hover:text-blue-600 transition-colors focus:outline-none focus:underline">{lead.email}</a>
        </div>
        {lead.phone && (
          <div className="flex items-center text-slate-600">
            <Phone size={16} className="mr-2 text-slate-400" />
            <a href={`tel:${lead.phone}`} className="text-sm hover:text-blue-600 transition-colors focus:outline-none focus:underline">{lead.phone}</a>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
        <button
          onClick={() => onEdit(lead)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Edit ${lead.name}`}
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete ${lead.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
