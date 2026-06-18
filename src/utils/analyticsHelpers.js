import {
  parseISO,
  format,
  differenceInDays,
  isAfter,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachMonthOfInterval
} from 'date-fns';

// Helper to normalize status strings between different contexts
const normalizeStatus = (status) => {
  if (!status) return 'New';
  const s = status.toLowerCase();
  if (s.includes('meet')) return 'Meeting';
  if (s.includes('prop')) return 'Proposal';
  if (s.includes('won')) return 'Won';
  if (s.includes('lost')) return 'Lost';
  if (s.includes('contact')) return 'Contacted';
  return 'New';
};

// Gets the distribution of leads by status
export const getStatusDistribution = (leads) => {
  if (!leads || leads.length === 0) return [];
  const distribution = {};
  
  leads.forEach(lead => {
    const status = normalizeStatus(lead.status);
    distribution[status] = (distribution[status] || 0) + 1;
  });

  return Object.keys(distribution).map(status => ({
    name: status,
    value: distribution[status]
  }));
};

// Groups leads by creation month for the last 6 months
export const getMonthlyLeads = (leads) => {
  if (!leads) return [];
  
  const end = new Date();
  const start = startOfMonth(subMonths(end, 5)); // Last 6 months
  
  const months = eachMonthOfInterval({ start, end });
  
  const data = months.map(month => ({
    month: format(month, 'MMM'),
    count: 0
  }));

  leads.forEach(lead => {
    const createdAt = lead.createdAt || lead.dateAdded;
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

// Calculates conversion rate by month
export const getConversionByMonth = (leads) => {
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
    const createdAt = lead.createdAt || lead.dateAdded;
    if (!createdAt) return;
    
    const date = parseISO(createdAt);
    if (isAfter(date, start) || date.getTime() === start.getTime()) {
      const monthStr = format(date, 'MMM');
      const monthData = data.find(d => d.month === monthStr);
      if (monthData) {
        monthData.total += 1;
        if (normalizeStatus(lead.status) === 'Won') {
          monthData.won += 1;
        }
        monthData.rate = Math.round((monthData.won / monthData.total) * 100);
      }
    }
  });

  return data;
};

// Calculates revenue by month for Won deals
export const getRevenueByMonth = (leads) => {
  if (!leads) return [];

  const end = new Date();
  const start = startOfMonth(subMonths(end, 5));
  const months = eachMonthOfInterval({ start, end });

  const data = months.map(month => ({
    month: format(month, 'MMM'),
    revenue: 0
  }));

  leads.forEach(lead => {
    if (normalizeStatus(lead.status) !== 'Won') return;
    
    // Fallback to createdAt if wonAt is missing
    const wonDateStr = lead.wonAt || lead.createdAt || lead.dateAdded;
    if (!wonDateStr) return;
    
    const date = parseISO(wonDateStr);
    if (isAfter(date, start) || date.getTime() === start.getTime()) {
      const monthStr = format(date, 'MMM');
      const monthData = data.find(d => d.month === monthStr);
      if (monthData) {
        // Fallback value to 0 if undefined
        monthData.revenue += Number(lead.value || 0);
      }
    }
  });

  return data;
};

// Total value of all non-lost, non-won deals
export const getPipelineValue = (leads) => {
  if (!leads) return 0;
  return leads.reduce((sum, lead) => {
    const status = normalizeStatus(lead.status);
    if (status !== 'Won' && status !== 'Lost') {
      return sum + Number(lead.value || 0);
    }
    return sum;
  }, 0);
};

// Total revenue of won deals
export const getWonRevenue = (leads) => {
  if (!leads) return 0;
  return leads.reduce((sum, lead) => {
    if (normalizeStatus(lead.status) === 'Won') {
      return sum + Number(lead.value || 0);
    }
    return sum;
  }, 0);
};

// Average days between creation and won status
export const getAverageSalesCycle = (leads) => {
  if (!leads) return 0;
  
  let totalDays = 0;
  let wonCount = 0;

  leads.forEach(lead => {
    if (normalizeStatus(lead.status) === 'Won') {
      const start = lead.createdAt || lead.dateAdded;
      // Defensive fallback to current date if wonAt is missing for a won lead
      const end = lead.wonAt || new Date().toISOString(); 
      if (start && end) {
        const days = differenceInDays(parseISO(end), parseISO(start));
        totalDays += Math.max(0, days); // Prevent negative days if data is malformed
        wonCount++;
      }
    }
  });

  return wonCount === 0 ? 0 : Math.round(totalDays / wonCount);
};

// Percentage of lost leads
export const getLostRate = (leads) => {
  if (!leads || leads.length === 0) return 0;
  const lostCount = leads.filter(l => normalizeStatus(l.status) === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

// Counts leads by source
export const getLeadSourceStats = (leads) => {
  if (!leads) return [];
  const sourceCounts = {};
  
  leads.forEach(lead => {
    const source = lead.source || 'Unknown';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  return Object.keys(sourceCounts)
    .map(source => ({
      name: source,
      count: sourceCounts[source]
    }))
    .sort((a, b) => b.count - a.count); // Descending
};

// Maps leads to funnel stages
export const getFunnelData = (leads) => {
  if (!leads) return [];
  
  const funnelStages = {
    'New': 0,
    'Contacted': 0,
    'Meeting': 0,
    'Proposal': 0,
    'Won': 0
  };

  leads.forEach(lead => {
    const status = normalizeStatus(lead.status);
    if (funnelStages[status] !== undefined) {
      funnelStages[status]++;
    }
  });

  // Calculate cumulative counts for true funnel representation
  // Everyone who is Won also passed through Proposal, etc.
  const data = [
    { name: 'New', value: funnelStages['New'] + funnelStages['Contacted'] + funnelStages['Meeting'] + funnelStages['Proposal'] + funnelStages['Won'] },
    { name: 'Contacted', value: funnelStages['Contacted'] + funnelStages['Meeting'] + funnelStages['Proposal'] + funnelStages['Won'] },
    { name: 'Meeting', value: funnelStages['Meeting'] + funnelStages['Proposal'] + funnelStages['Won'] },
    { name: 'Proposal', value: funnelStages['Proposal'] + funnelStages['Won'] },
    { name: 'Won', value: funnelStages['Won'] }
  ];
  
  // Actually, standard CRM funnels often just show current state or true conversion.
  // The requirement says "Show counts... Example: New 100, Contacted 72, Meeting 45, Proposal 24, Won 16". This implies cumulative or historical progression.
  // We'll stick to cumulative for a proper Funnel chart shape.
  return data;
};

// Formula: (Opportunities × Win Rate × Avg Deal Size) / Sales Cycle Length
export const getSalesVelocity = (leads) => {
  if (!leads || leads.length === 0) return 0;
  
  const opportunities = leads.length;
  const wonLeads = leads.filter(l => normalizeStatus(l.status) === 'Won');
  const winRate = opportunities > 0 ? wonLeads.length / opportunities : 0;
  
  const totalWonRevenue = getWonRevenue(leads);
  const avgDealSize = wonLeads.length > 0 ? totalWonRevenue / wonLeads.length : 0;
  
  const salesCycleLength = getAverageSalesCycle(leads) || 1; // avoid divide by zero
  
  return Math.round((opportunities * winRate * avgDealSize) / salesCycleLength);
};

// Forecast next month based on average of last 6 months
export const getForecastRevenue = (leads) => {
  if (!leads || leads.length === 0) return { amount: 0, growth: 0 };
  
  const monthlyRevenue = getRevenueByMonth(leads);
  const total6MoRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const avgMonthly = total6MoRevenue / 6;
  
  // Simple growth calc: current month vs avg of previous 5
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
  const prevMonthsAvg = (total6MoRevenue - currentMonth) / 5;
  const growth = prevMonthsAvg === 0 ? 100 : Math.round(((currentMonth - prevMonthsAvg) / prevMonthsAvg) * 100);

  return {
    amount: Math.round(avgMonthly),
    growth
  };
};

// Rank top reps by Won Revenue
export const getTopPerformers = (leads) => {
  if (!leads) return [];
  
  const performers = {};
  
  leads.forEach(lead => {
    if (normalizeStatus(lead.status) === 'Won') {
      const owner = lead.owner || 'Unassigned';
      if (!performers[owner]) {
        performers[owner] = { name: owner, revenue: 0, deals: 0 };
      }
      performers[owner].revenue += Number(lead.value || 0);
      performers[owner].deals += 1;
    }
  });

  return Object.values(performers)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5
};

// Simulates activity heatmap data (counts of creation events)
export const getActivityHeatmapData = (leads) => {
  if (!leads) return [];
  
  const dateCounts = {};
  
  leads.forEach(lead => {
    const createdAt = lead.createdAt || lead.dateAdded;
    if (createdAt) {
      const dateStr = parseISO(createdAt).toISOString().split('T')[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    }
    // Could also add meetingAt, etc.
    if (lead.meetingAt) {
      const dateStr = parseISO(lead.meetingAt).toISOString().split('T')[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    }
  });

  return Object.keys(dateCounts).map(date => ({
    date,
    count: dateCounts[date]
  }));
};
