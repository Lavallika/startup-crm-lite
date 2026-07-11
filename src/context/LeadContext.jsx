import React, { createContext, useContext, useState, useEffect } from 'react';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source
 * @property {string} createdAt
 */

export const LeadContext = createContext(undefined);

export const LeadProvider = ({ children }) => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });

  /**
   * Fetches all leads from the API with optional filter parameters.
   * @param {Object} params - Query filters (status, search, page, limit)
   */
  const fetchLeads = async (params = {}) => {
    setIsLoading(true);
    try {
      const result = await leadService.getLeads(params);
      // Backend response returns paginatedResponse: { success: true, data: Array, pagination }
      if (result.success) {
        // Map database _id to id if virtual is missing or fallback needed
        const mappedLeads = result.data.map(lead => ({
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
      const errMsg = error.response?.data?.message || error.message || 'Failed to fetch leads';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leads automatically on mount or when the user changes (token updates)
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [token]);

  /**
   * Adds a new lead via API
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData The data for the new lead
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const result = await leadService.createLead(leadData);
      // Backend returns: { success: true, message, data: { lead } }
      if (result.success && result.data?.lead) {
        const newLead = {
          ...result.data.lead,
          id: result.data.lead.id || result.data.lead._id,
          dateAdded: result.data.lead.createdAt ? result.data.lead.createdAt.split('T')[0] : ''
        };
        setLeads(prev => [newLead, ...prev]);
        toast.success(result.message || 'Lead added successfully', {
          style: { border: '1px solid #22C55E', color: '#166534' }
        });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to add lead';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates an existing lead via API
   * @param {string} id The unique identifier of the lead to update
   * @param {Partial<Lead>} updatedData The fields to update
   */
  const updateLead = async (id, updatedData) => {
    setIsLoading(true);
    try {
      // Check if updating only status or general updates
      let result;
      const keys = Object.keys(updatedData);
      if (keys.length === 1 && keys[0] === 'status') {
        result = await leadService.updateLeadStatus(id, updatedData.status);
      } else {
        result = await leadService.updateLead(id, updatedData);
      }

      if (result.success && result.data?.lead) {
        const updatedLead = {
          ...result.data.lead,
          id: result.data.lead.id || result.data.lead._id,
          dateAdded: result.data.lead.createdAt ? result.data.lead.createdAt.split('T')[0] : ''
        };
        setLeads(prev => prev.map(lead => (lead.id === id || lead._id === id) ? updatedLead : lead));
        toast.success(result.message || 'Lead updated successfully', {
          style: { border: '1px solid #22C55E', color: '#166534' }
        });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to update lead';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a lead by ID via API
   * @param {string} id The unique identifier of the lead to delete
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      const result = await leadService.deleteLead(id);
      if (result.success) {
        setLeads(prev => prev.filter(lead => lead.id !== id && lead._id !== id));
        toast.success(result.message || 'Lead deleted successfully', {
          iconTheme: { primary: '#EF4444', secondary: '#fff' },
          style: { border: '1px solid #EF4444', color: '#EF4444' }
        });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to delete lead';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets a single lead by ID from the state cache
   * @param {string} id The unique identifier of the lead to find
   * @returns {Lead | undefined} The lead object if found, otherwise undefined
   */
  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id || lead._id === id);
  };

  return (
    <LeadContext.Provider value={{
      leads,
      isLoading,
      pagination,
      fetchLeads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById
    }}>
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
