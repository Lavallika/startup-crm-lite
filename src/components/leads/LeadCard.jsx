import React from 'react';
import { Pencil, Trash2, Mail, Phone, Building } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Lead card — touch-friendly with 44px minimum tap targets on action buttons.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 dark:bg-white rounded-xl shadow-sm border border-gray-700 dark:border-slate-200 p-4 md:p-5 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
      {/* Top row: name/company + status badge */}
      <div className="flex justify-between items-start mb-3 md:mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-white dark:text-slate-900 truncate">
            {lead.name}
          </h3>
          <div className="flex items-center text-slate-600 dark:text-gray-400 mt-1 min-w-0">
            <Building size={14} className="mr-1.5 flex-shrink-0" />
            <span className="text-sm truncate">{lead.company}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={lead.status} />
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2 mb-4 md:mb-6">
        <div className="flex items-center text-slate-600 dark:text-gray-400 min-w-0">
          <Mail size={14} className="mr-2 flex-shrink-0 text-slate-400 dark:text-gray-500" />
          <a
            href={`mailto:${lead.email}`}
            className="text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:underline"
          >
            {lead.email}
          </a>
        </div>
        {lead.phone && (
          <div className="flex items-center text-slate-600 dark:text-gray-400 min-w-0">
            <Phone size={14} className="mr-2 flex-shrink-0 text-slate-400 dark:text-gray-500" />
            <a
              href={`tel:${lead.phone}`}
              className="text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:underline"
            >
              {lead.phone}
            </a>
          </div>
        )}
      </div>

      {/* Actions — 44px minimum tap targets */}
      <div className="flex justify-end gap-1 pt-3 border-t border-gray-700 dark:border-slate-100">
        <button
          onClick={() => onEdit(lead)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Edit ${lead.name}`}
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete ${lead.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
