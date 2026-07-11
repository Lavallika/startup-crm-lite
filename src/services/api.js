import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance with base URL configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor: automatically append token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle token expiration and network errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if it is an HTTP error response
    if (error.response) {
      const { status } = error.response;
      
      // On 401 Unauthorized, clear storage and redirect to login
      if (status === 401) {
        localStorage.removeItem('crm-token');
        // Do not redirect to login page if we are already there to prevent reload loops
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received (network/server down)
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-connection-error', // Prevent multiple identical toasts
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
