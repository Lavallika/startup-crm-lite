import { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { subDays, startOfYear, isAfter, parseISO } from 'date-fns';
import * as helpers from '../utils/analyticsHelpers';

export const useAnalytics = () => {
  const { leads } = useLeads();
  const [filterRange, setFilterRange] = useState('30days'); // '7days' | '30days' | '90days' | 'thisYear' | 'all'

  // Memoize date filtering
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (filterRange === 'all') return leads;

    const now = new Date();
    let startDate;

    switch (filterRange) {
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '90days':
        startDate = subDays(now, 90);
        break;
      case 'thisYear':
        startDate = startOfYear(now);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return leads.filter(lead => {
      const dateStr = lead.createdAt || lead.dateAdded;
      if (!dateStr) return true; // keep if no date
      return isAfter(parseISO(dateStr), startDate);
    });
  }, [leads, filterRange]);

  // Memoize all KPIs to prevent unnecessary recalculations
  const stats = useMemo(() => ({
    totalLeads: filteredLeads.length,
    conversionRate: filteredLeads.length > 0 
      ? Math.round((filteredLeads.filter(l => l.status?.toLowerCase().includes('won')).length / filteredLeads.length) * 100) 
      : 0,
    pipelineValue: helpers.getPipelineValue(filteredLeads),
    wonRevenue: helpers.getWonRevenue(filteredLeads),
    avgSalesCycle: helpers.getAverageSalesCycle(filteredLeads),
    lostRate: helpers.getLostRate(filteredLeads),
  }), [filteredLeads]);

  return {
    leads: filteredLeads,
    stats,
    filterRange,
    setFilterRange,
    helpers, // Expose helpers so components don't need to re-import
  };
};
