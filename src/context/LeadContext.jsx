import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { computePipelineCounts } from '../constants/leadStatuses';

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} _id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost'} status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source
 * @property {string} notes
 * @property {string} createdAt
 * @property {string} dateAdded
 */

export const LeadContext = createContext(undefined);

export const LeadProvider = ({ children }) => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 1000,
    pages: 1
  });

  /**
   * Fetches all leads belonging to the logged-in user from the API.
   * @param {Object} params - Query filters (status, search, page, limit)
   */
  const fetchLeads = useCallback(async (params = {}) => {
    if (!localStorage.getItem('crm-token')) {
      setLeads([]);
      return;
    }

    setIsLoading(true);
    try {
      // Default to fetching all leads (limit: 1000) so dashboard calculations are 100% complete
      const queryParams = {
        limit: 1000,
        ...params
      };

      const result = await leadService.getLeads(queryParams);

      if (result && result.success && Array.isArray(result.data)) {
        const mappedLeads = result.data.map((lead) => ({
          ...lead,
          id: lead.id || lead._id,
          dateAdded: lead.createdAt ? lead.createdAt.split('T')[0] : ''
        }));
        setLeads(mappedLeads);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      const errMsg = error.response?.data?.message || error.message || 'Failed to fetch leads';
      // Only toast on network/server error, not on initial empty state
      if (error.response?.status !== 401) {
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch leads automatically when authenticated token changes
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [token, fetchLeads]);

  /**
   * Adds a new lead via API and updates the local state immediately
   * @param {Object} leadData The data for the new lead
   * @returns {Promise<{success: boolean, lead?: Object, error?: string}>}
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const result = await leadService.createLead(leadData);
      if (result && result.success && result.data?.lead) {
        const created = result.data.lead;
        const newLead = {
          ...created,
          id: created.id || created._id,
          dateAdded: created.createdAt ? created.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
        };
        setLeads((prev) => [newLead, ...prev]);
        toast.success(result.message || 'Lead added successfully');
        return { success: true, lead: newLead };
      }
      throw new Error(result?.message || 'Failed to add lead');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to add lead';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates an existing lead via API and updates local state immediately
   * @param {string} id The unique identifier of the lead to update
   * @param {Object} updatedData The fields to update
   * @returns {Promise<{success: boolean, lead?: Object, error?: string}>}
   */
  const updateLead = async (id, updatedData) => {
    setIsLoading(true);
    try {
      let result;
      const keys = Object.keys(updatedData);
      if (keys.length === 1 && keys[0] === 'status') {
        result = await leadService.updateLeadStatus(id, updatedData.status);
      } else {
        result = await leadService.updateLead(id, updatedData);
      }

      if (result && result.success && result.data?.lead) {
        const saved = result.data.lead;
        const updatedLead = {
          ...saved,
          id: saved.id || saved._id,
          dateAdded: saved.createdAt ? saved.createdAt.split('T')[0] : ''
        };
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id || lead._id === id ? updatedLead : lead))
        );
        toast.success(result.message || 'Lead updated successfully');
        return { success: true, lead: updatedLead };
      }
      throw new Error(result?.message || 'Failed to update lead');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to update lead';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates only the status field of a lead (pipeline stage transition)
   * @param {string} id The unique identifier of the lead
   * @param {string} status The new pipeline status
   * @returns {Promise<{success: boolean, lead?: Object, error?: string}>}
   */
  const updateLeadStatus = async (id, status) => {
    return updateLead(id, { status });
  };

  /**
   * Deletes a lead by ID via API and removes it from local state immediately
   * @param {string} id The unique identifier of the lead to delete
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      const result = await leadService.deleteLead(id);
      if (result && result.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
        toast.success(result.message || 'Lead deleted successfully');
        return { success: true };
      }
      throw new Error(result?.message || 'Failed to delete lead');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to delete lead';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets a single lead by ID from the state cache
   * @param {string} id The unique identifier of the lead
   * @returns {Lead | undefined}
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id || lead._id === id);
  };

  // ── Dynamic Dashboard Statistics (Single Source of Truth) ─────────────
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const stageCounts = computePipelineCounts(leads);

    const newLeads = stageCounts['New'] || 0;
    const contactedLeads = stageCounts['Contacted'] || 0;
    const qualifiedLeads = stageCounts['Qualified'] || 0;
    const proposalLeads = stageCounts['Proposal Sent'] || 0;
    const convertedLeads = stageCounts['Won'] || 0;
    const lostLeads = stageCounts['Lost'] || 0;

    const conversionRate = totalLeads > 0
      ? Number(((convertedLeads / totalLeads) * 100).toFixed(1))
      : 0;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalLeads,
      convertedLeads,
      wonLeads: convertedLeads,
      lostLeads,
      conversionRate,
      stageCounts
    };
  }, [leads]);

  return (
    <LeadContext.Provider
      value={{
        leads,
        stats,
        isLoading,
        pagination,
        fetchLeads,
        refreshLeads: fetchLeads,
        addLead,
        updateLead,
        updateLeadStatus,
        deleteLead,
        getLeadById
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
