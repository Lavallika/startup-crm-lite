import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<any>} Response body containing token and user
   */
  async register(name, email, password) {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<any>} Response body containing token and user
   */
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logout user (removes token from localStorage since server is stateless)
   */
  logout() {
    localStorage.removeItem('crm-token');
  },

  /**
   * Get user profile details
   * @returns {Promise<any>} Response body containing user profile
   */
  async getProfile() {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Update profile details (name/password)
   * @param {Object} data - Update payload
   * @returns {Promise<any>} Response body containing updated user profile
   */
  async updateProfile(data) {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
