/**
 * Single Source of Truth for CRM Lead Statuses & Pipeline Stages.
 * Aligns frontend display, database enum, and dashboard metrics.
 */

export const PIPELINE_STAGES = [
  {
    id: 'New',
    label: 'New',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    textColor: 'text-blue-500',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: 'Fresh leads not yet contacted'
  },
  {
    id: 'Contacted',
    label: 'Contacted',
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    textColor: 'text-amber-500',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: 'Initial outreach made'
  },
  {
    id: 'Qualified',
    label: 'Qualified',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    textColor: 'text-purple-500',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    description: 'Meeting held, interest confirmed'
  },
  {
    id: 'Proposal Sent',
    label: 'Proposal Sent',
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    textColor: 'text-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    description: 'Quote or proposal delivered'
  },
  {
    id: 'Won',
    label: 'Converted',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    textColor: 'text-green-500',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    description: 'Successfully closed deals'
  },
  {
    id: 'Lost',
    label: 'Lost',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    textColor: 'text-red-500',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    description: 'Opportunity dropped or declined'
  }
];

export const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost'
];

export const SOURCE_OPTIONS = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other'
];

/**
 * Normalizes any lead status string into one of the 6 canonical pipeline stages.
 * Ensures that EVERY lead is counted in EXACTLY ONE stage.
 * 
 * @param {string} status 
 * @returns {'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost'}
 */
export const getLeadStage = (status) => {
  if (!status) return 'New';
  const s = String(status).trim().toLowerCase();

  if (s === 'new') return 'New';
  if (s === 'contacted') return 'Contacted';
  if (s === 'qualified' || s.includes('meet') || s.includes('qual')) return 'Qualified';
  if (s.includes('prop') || s.includes('sent')) return 'Proposal Sent';
  if (s === 'won' || s === 'converted' || s.includes('clos') || s.includes('win')) return 'Won';
  if (s === 'lost' || s.includes('drop')) return 'Lost';

  return 'New';
};

/**
 * Computes exact counts for every pipeline stage from an array of leads.
 * Guaranteed: sum of all counts === leads.length
 * 
 * @param {Array} leads 
 * @returns {Record<string, number>}
 */
export const computePipelineCounts = (leads = []) => {
  const counts = {
    'New': 0,
    'Contacted': 0,
    'Qualified': 0,
    'Proposal Sent': 0,
    'Won': 0,
    'Lost': 0
  };

  leads.forEach((lead) => {
    const stage = getLeadStage(lead?.status);
    counts[stage] = (counts[stage] || 0) + 1;
  });

  return counts;
};

