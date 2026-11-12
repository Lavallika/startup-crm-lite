import React from 'react';
import { X, Building, Mail, Phone, Calendar, Tag, FileText, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { PIPELINE_STAGES } from '../../constants/leadStatuses';

/**
 * LeadDetailsModal
 * 
 * Displays complete information for a lead, with quick actions to edit,
 * delete, or change stage directly.
 */
const LeadDetailsModal = ({ lead, isOpen, onClose, onEdit, onDelete, onStatusChange }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-details-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 id="lead-details-title" className="text-xl font-bold text-gray-900 dark:text-white">
                {lead.name}
              </h2>
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Building size={15} className="mr-1.5 flex-shrink-0" />
              <span>{lead.company}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Stage Mover */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/60">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Pipeline Stage
            </label>
            <div className="flex items-center gap-2">
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id || lead._id, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PIPELINE_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contact Information
            </h4>
            
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Mail size={16} className="w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
              <a href={`mailto:${lead.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {lead.email}
              </a>
            </div>

            {lead.phone && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Phone size={16} className="w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                <a href={`tel:${lead.phone}`} className="hover:underline">
                  {lead.phone}
                </a>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Tag size={16} className="w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
              <span>Source: <strong className="text-gray-900 dark:text-white">{lead.source || 'Website'}</strong></span>
            </div>

            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
              <span>Date Added: {lead.dateAdded || (lead.createdAt ? lead.createdAt.split('T')[0] : 'N/A')}</span>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} />
                <span>Notes</span>
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60">
                {lead.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              onDelete(lead.id || lead._id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(lead);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Pencil size={15} />
              <span>Edit Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;

