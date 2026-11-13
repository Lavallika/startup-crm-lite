import {
  parseISO,
  format,
  differenceInDays,
  isAfter,
  startOfMonth,
  subMonths,
  eachMonthOfInterval
} from 'date-fns';
import { getLeadStage } from '../constants/leadStatuses';

/**
 * Normalizes any lead status string into one of the 6 canonical CRM pipeline stages:
 * 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost'
 * Aligns analytics with the rest of the application.
 *
 * @param {string} status 
 * @returns {'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost'}
 */
export const normalizeStatus = (status) => {
  return getLeadStage(status);
};

/**
 * Gets the distribution of leads across canonical pipeline stages.
 * Guaranteed: Sum of all values === leads.length (100% parity).
 *
 * @param {Array} leads
 * @returns {Array<{ name: string, value: number }>}
 */
export const getStatusDistribution = (leads = []) => {
  if (!leads || leads.length === 0) return [];
  const distribution = {};
  
  leads.forEach(lead => {
    const stage = normalizeStatus(lead?.status);
    // Display 'Converted' as the user-facing label for Won stage
    const displayName = stage === 'Won' ? 'Converted' : stage;
    distribution[displayName] = (distribution[displayName] || 0) + 1;
  });

  return Object.keys(distribution).map(status => ({
    name: status,
    value: distribution[status]
  }));
};

/**
 * Groups leads by creation month for the last 6 months.
 *
 * @param {Array} leads
 * @returns {Array<{ month: string, count: number }>}
 */
export const getMonthlyLeads = (leads = []) => {
  if (!leads) return [];
  
  const end = new Date();
  const start = startOfMonth(subMonths(end, 5)); // Last 6 months
  const months = eachMonthOfInterval({ start, end });
  
  const data = months.map(month => ({
    month: format(month, 'MMM'),
    count: 0
  }));

  leads.forEach(lead => {
    const createdAt = lead?.createdAt || lead?.dateAdded;
    if (!createdAt) return;
    
    const date = parseISO(createdAt);
    if (isAfter(date, start) || date.getTime() === start.getTime()) {
      const monthStr = format(date, 'MMM');
      const monthData = data.find(d => d.month === monthStr);
      if (monthData) monthData.count += 1;
    }
  });

  return data;
};

/**
 * Calculates monthly win rate conversion percentage.
 *
 * @param {Array} leads
 * @returns {Array<{ month: string, total: number, won: number, rate: number }>}
 */
export const getConversionByMonth = (leads = []) => {
  if (!leads) return [];

  const end = new Date();
  const start = startOfMonth(subMonths(end, 5));
  const months = eachMonthOfInterval({ start, end });

  const data = months.map(month => ({
    month: format(month, 'MMM'),
    total: 0,
    won: 0,
    rate: 0
  }));

  leads.forEach(lead => {
    const createdAt = lead?.createdAt || lead?.dateAdded;
    if (!createdAt) return;
    
    const date = parseISO(createdAt);
    if (isAfter(date, start) || date.getTime() === start.getTime()) {
      const monthStr = format(date, 'MMM');
      const monthData = data.find(d => d.month === monthStr);
      if (monthData) {
        monthData.total += 1;
        if (normalizeStatus(lead?.status) === 'Won') {
          monthData.won += 1;
        }
        monthData.rate = Math.round((monthData.won / monthData.total) * 100);
      }
    }
  });

  return data;
};

/**
 * Calculates revenue by month for Converted (Won) deals.
 *
 * @param {Array} leads
 * @returns {Array<{ month: string, revenue: number }>}
 */
export const getRevenueByMonth = (leads = []) => {
  if (!leads) return [];

  const end = new Date();
  const start = startOfMonth(subMonths(end, 5));
  const months = eachMonthOfInterval({ start, end });

  const data = months.map(month => ({
    month: format(month, 'MMM'),
    revenue: 0
  }));

  leads.forEach(lead => {
    if (normalizeStatus(lead?.status) !== 'Won') return;

    const wonDateStr = lead?.wonAt || lead?.createdAt || lead?.dateAdded;
    if (!wonDateStr) return;
    
    const date = parseISO(wonDateStr);
    if (isAfter(date, start) || date.getTime() === start.getTime()) {
      const monthStr = format(date, 'MMM');
      const monthData = data.find(d => d.month === monthStr);
      if (monthData) {
        monthData.revenue += Number(lead?.value || 0);
      }
    }
  });

  return data;
};

/**
 * Total estimated value of all active pipeline deals (excluding Won and Lost).
 *
 * @param {Array} leads
 * @returns {number}
 */
export const getPipelineValue = (leads = []) => {
  if (!leads) return 0;
  return leads.reduce((sum, lead) => {
    const status = normalizeStatus(lead?.status);
    if (status !== 'Won' && status !== 'Lost') {
      return sum + Number(lead?.value || 0);
    }
    return sum;
  }, 0);
};

/**
 * Total realized revenue of Converted (Won) deals.
 *
 * @param {Array} leads
 * @returns {number}
 */
export const getWonRevenue = (leads = []) => {
  if (!leads) return 0;
  return leads.reduce((sum, lead) => {
    if (normalizeStatus(lead?.status) === 'Won') {
      return sum + Number(lead?.value || 0);
    }
    return sum;
  }, 0);
};

/**
 * Average sales cycle length in days for won deals.
 *
 * @param {Array} leads
 * @returns {number}
 */
export const getAverageSalesCycle = (leads = []) => {
  if (!leads) return 0;
  
  let totalDays = 0;
  let wonCount = 0;

  leads.forEach(lead => {
    if (normalizeStatus(lead?.status) === 'Won') {
      const start = lead?.createdAt || lead?.dateAdded;
      const end = lead?.wonAt || new Date().toISOString(); 
      if (start && end) {
        const days = differenceInDays(parseISO(end), parseISO(start));
        totalDays += Math.max(0, days);
        wonCount++;
      }
    }
  });

  return wonCount === 0 ? 0 : Math.round(totalDays / wonCount);
};

/**
 * Lost deals percentage rate.
 *
 * @param {Array} leads
 * @returns {number}
 */
export const getLostRate = (leads = []) => {
  if (!leads || leads.length === 0) return 0;
  const lostCount = leads.filter(l => normalizeStatus(l?.status) === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

/**
 * Counts leads by acquisition source.
 *
 * @param {Array} leads
 * @returns {Array<{ name: string, count: number }>}
 */
export const getLeadSourceStats = (leads = []) => {
  if (!leads) return [];
  const sourceCounts = {};
  
  leads.forEach(lead => {
    const source = lead?.source || 'Website';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  return Object.keys(sourceCounts)
    .map(source => ({
      name: source,
      count: sourceCounts[source]
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Maps actual lead records to sequential Sales Funnel stages without duplicate counting.
 * Every lead is counted in EXACTLY ONE stage according to its current pipeline status.
 *
 * Pipeline Stages:
 *   1. New
 *   2. Contacted
 *   3. Qualified
 *   4. Proposal Sent
 *   5. Converted (Won)
 *
 * Converted leads represent closed wins; Lost leads are tracked separately in summary metrics.
 * Sum of all stage counts + lostCount === leads.length (100% mathematical parity).
 *
 * @param {Array} leads
 * @returns {Array<{ name: string, value: number, count: number, percentage: number, color: string }>}
 */
export const getFunnelData = (leads = []) => {
  // Canonical pipeline stage counters
  const counts = {
    'New': 0,
    'Contacted': 0,
    'Qualified': 0,
    'Proposal Sent': 0,
    'Won': 0,
    'Lost': 0
  };

  if (Array.isArray(leads)) {
    leads.forEach(lead => {
      const stage = normalizeStatus(lead?.status);
      if (counts[stage] !== undefined) {
        counts[stage]++;
      } else {
        counts['New']++;
      }
    });
  }

  const total = Array.isArray(leads) ? leads.length : 0;

  // Build the 5 primary pipeline stages in sequential progression order
  const stages = [
    {
      id: 'New',
      name: 'New',
      label: 'New Leads',
      description: 'Awaiting initial outreach',
      value: counts['New'],
      count: counts['New'],
      percentage: total > 0 ? Math.round((counts['New'] / total) * 100) : 0,
      color: '#3B82F6'
    },
    {
      id: 'Contacted',
      name: 'Contacted',
      label: 'Contacted',
      description: 'Initial outreach made',
      value: counts['Contacted'],
      count: counts['Contacted'],
      percentage: total > 0 ? Math.round((counts['Contacted'] / total) * 100) : 0,
      color: '#F59E0B'
    },
    {
      id: 'Qualified',
      name: 'Qualified',
      label: 'Qualified',
      description: 'Meeting held, interest verified',
      value: counts['Qualified'],
      count: counts['Qualified'],
      percentage: total > 0 ? Math.round((counts['Qualified'] / total) * 100) : 0,
      color: '#A855F7'
    },
    {
      id: 'Proposal Sent',
      name: 'Proposal Sent',
      label: 'Proposal Sent',
      description: 'Formal proposal delivered',
      value: counts['Proposal Sent'],
      count: counts['Proposal Sent'],
      percentage: total > 0 ? Math.round((counts['Proposal Sent'] / total) * 100) : 0,
      color: '#6366F1'
    },
    {
      id: 'Won',
      name: 'Converted',
      label: 'Converted',
      description: 'Closed-won deals',
      value: counts['Won'],
      count: counts['Won'],
      percentage: total > 0 ? Math.round((counts['Won'] / total) * 100) : 0,
      color: '#10B981'
    }
  ];

  const lostStage = {
    id: 'Lost',
    name: 'Lost',
    label: 'Lost',
    description: 'Opportunity dropped or declined',
    value: counts['Lost'],
    count: counts['Lost'],
    percentage: total > 0 ? Math.round((counts['Lost'] / total) * 100) : 0,
    color: '#EF4444'
  };

  // Attach enriched metadata properties to the array for complete versatility
  stages.total = total;
  stages.counts = counts;
  stages.stages = stages;
  stages.lostStage = lostStage;
  stages.allStages = [...stages, lostStage];
  stages.lostCount = counts['Lost'];
  stages.lostPercentage = total > 0 ? Math.round((counts['Lost'] / total) * 100) : 0;
  stages.wonCount = counts['Won'];
  stages.wonPercentage = total > 0 ? Math.round((counts['Won'] / total) * 100) : 0;
  stages.activeCount = counts['New'] + counts['Contacted'] + counts['Qualified'] + counts['Proposal Sent'];

  return stages;
};

/**
 * Sales Velocity = (Opportunities × Win Rate × Avg Deal Size) / Sales Cycle Length
 *
 * @param {Array} leads
 * @returns {number}
 */
export const getSalesVelocity = (leads = []) => {
  if (!leads || leads.length === 0) return 0;
  
  const opportunities = leads.length;
  const wonLeads = leads.filter(l => normalizeStatus(l?.status) === 'Won');
  const winRate = opportunities > 0 ? wonLeads.length / opportunities : 0;
  
  const totalWonRevenue = getWonRevenue(leads);
  const avgDealSize = wonLeads.length > 0 ? totalWonRevenue / wonLeads.length : 0;
  const salesCycleLength = getAverageSalesCycle(leads) || 1;
  
  return Math.round((opportunities * winRate * avgDealSize) / salesCycleLength);
};

/**
 * Forecast revenue for next month based on average of past 6 months.
 *
 * @param {Array} leads
 * @returns {{ amount: number, growth: number }}
 */
export const getForecastRevenue = (leads = []) => {
  if (!leads || leads.length === 0) return { amount: 0, growth: 0 };
  
  const monthlyRevenue = getRevenueByMonth(leads);
  const total6MoRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const avgMonthly = total6MoRevenue / 6;
  
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
  const prevMonthsAvg = (total6MoRevenue - currentMonth) / 5;
  const growth = prevMonthsAvg === 0 ? 0 : Math.round(((currentMonth - prevMonthsAvg) / prevMonthsAvg) * 100);

  return {
    amount: Math.round(avgMonthly),
    growth
  };
};

/**
 * Ranks top performers by won revenue and deals won.
 * Formats raw ObjectIds to user-friendly representative names.
 *
 * @param {Array} leads
 * @returns {Array<{ name: string, revenue: number, deals: number }>}
 */
export const getTopPerformers = (leads = []) => {
  if (!leads || leads.length === 0) return [];
  
  const performers = {};
  
  leads.forEach(lead => {
    if (normalizeStatus(lead?.status) === 'Won') {
      const rawOwner = lead?.owner?.name || lead?.ownerName || lead?.owner;
      let ownerName = 'Primary Account Rep';
      
      if (typeof rawOwner === 'string' && rawOwner.trim().length > 0) {
        // If it's a 24-character hexadecimal MongoDB ObjectId, format cleanly
        if (/^[0-9a-fA-F]{24}$/.test(rawOwner.trim())) {
          ownerName = 'Primary Account Rep';
        } else {
          ownerName = rawOwner.trim();
        }
      } else if (typeof rawOwner === 'object' && rawOwner?.name) {
        ownerName = rawOwner.name;
      }

      if (!performers[ownerName]) {
        performers[ownerName] = { name: ownerName, revenue: 0, deals: 0 };
      }
      performers[ownerName].revenue += Number(lead?.value || 0);
      performers[ownerName].deals += 1;
    }
  });

  return Object.values(performers)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

/**
 * Generates activity heatmap frequency for lead creation dates over the last 90 days.
 *
 * @param {Array} leads
 * @returns {Array<{ date: string, count: number }>}
 */
export const getActivityHeatmapData = (leads = []) => {
  if (!leads || leads.length === 0) return [];
  
  const dateCounts = {};
  
  leads.forEach(lead => {
    const createdAt = lead?.createdAt || lead?.dateAdded;
    if (createdAt) {
      try {
        const dateStr = parseISO(createdAt).toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      } catch {
        // Ignore invalid date strings
      }
    }
  });

  return Object.keys(dateCounts).map(date => ({
    date,
    count: dateCounts[date]
  }));
};
