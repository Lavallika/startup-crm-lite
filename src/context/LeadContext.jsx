import React, { createContext, useContext, useState, useEffect } from 'react';

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

const INITIAL_LEADS = [
  { id: '1', name: 'Alice Johnson', company: 'TechCorp', email: 'alice@techcorp.com', phone: '555-0101', status: 'New', source: 'Website', createdAt: '2023-10-24T12:00:00.000Z', dateAdded: '2023-10-24' },
  { id: '2', name: 'Bob Smith', company: 'Innovate LLC', email: 'bob@innovate.com', phone: '555-0102', status: 'Contacted', source: 'LinkedIn', createdAt: '2023-10-23T12:00:00.000Z', dateAdded: '2023-10-23' },
  { id: '3', name: 'Charlie Davis', company: 'Global Solutions', email: 'charlie@global.com', phone: '555-0103', status: 'Proposal Sent', source: 'Referral', createdAt: '2023-10-22T12:00:00.000Z', dateAdded: '2023-10-22' },
  { id: '4', name: 'Diana Evans', company: 'Nexus Systems', email: 'diana@nexus.com', phone: '555-0104', status: 'Won', source: 'Email Campaign', createdAt: '2023-10-21T12:00:00.000Z', dateAdded: '2023-10-21' },
];

export const LeadContext = createContext(undefined);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(() => {
    try {
      const storedLeads = localStorage.getItem('crm_leads');
      if (storedLeads) {
        return JSON.parse(storedLeads);
      }
    } catch (error) {
      console.error('Error reading leads from localStorage', error);
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Error saving leads to localStorage', error);
    }
  }, [leads]);

  /**
   * Adds a new lead
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData The data for the new lead
   */
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      dateAdded: new Date().toISOString().split('T')[0] // Retaining for backwards compatibility with existing UI
    };
    setLeads(prev => [newLead, ...prev]);
  };

  /**
   * Updates an existing lead
   * @param {string} id The unique identifier of the lead to update
   * @param {Partial<Lead>} updatedData The fields to update
   */
  const updateLead = (id, updatedData) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updatedData } : lead));
  };

  /**
   * Deletes a lead by ID
   * @param {string} id The unique identifier of the lead to delete
   */
  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  /**
   * Gets a single lead by ID
   * @param {string} id The unique identifier of the lead to find
   * @returns {Lead | undefined} The lead object if found, otherwise undefined
   */
  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
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
