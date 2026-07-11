import api from './api';

const leadService = {
  /**
   * Fetch leads with filter and pagination params
   * @param {Object} params - { status, search, page, limit, sortBy, sortOrder }
   * @returns {Promise<any>} Response body with leads array and pagination info
   */
  async getLeads(params = {}) {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  /**
   * Create a new lead
   * @param {Object} leadData 
   * @returns {Promise<any>} Response body with the created lead
   */
  async createLead(leadData) {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  /**
   * Update an existing lead
   * @param {string} id 
   * @param {Object} leadData 
   * @returns {Promise<any>} Response body with the updated lead
   */
  async updateLead(id, leadData) {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Update lead status (pipeline transition)
   * @param {string} id 
   * @param {string} status 
   * @returns {Promise<any>} Response body with the updated lead
   */
  async updateLeadStatus(id, status) {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a lead
   * @param {string} id 
   * @returns {Promise<any>} Response body of delete operation
   */
  async deleteLead(id) {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Get total/conversion dashboard stats
   * @returns {Promise<any>} Response body containing KPI statistics
   */
  async getLeadStats() {
    const response = await api.get('/api/leads/stats/summary');
    return response.data;
  },

  /**
   * Get 6-month aggregate analytics data
   * @returns {Promise<any>} Response body containing monthly records
   */
  async getMonthlyStats() {
    const response = await api.get('/api/leads/stats/monthly');
    return response.data;
  }
};

export default leadService;
