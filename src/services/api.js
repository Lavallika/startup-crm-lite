import axios from 'axios';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance configuration
//
// In development: VITE_API_URL is not set (or set to http://localhost:5000),
//   and Vite's dev proxy forwards /api/* requests to http://localhost:5000,
//   so baseURL can be '' (relative paths work via the proxy).
//
// In production (Vercel): There is NO Vite proxy — the frontend is a static
//   bundle. All /api/* requests must be sent to the Railway backend URL.
//   VITE_API_URL must be set in Vercel's environment variables to:
//     https://startup-crm-lite-production-7173.up.railway.app
//
// import.meta.env.VITE_API_URL is injected by Vite at build time.
// If it is not set, fall back to '' so local dev still works via the proxy.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 15000, // 15-second timeout — prevents infinite hang on Railway cold starts
});

// Request interceptor: automatically append JWT token if present in localStorage
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
    if (error.response) {
      const { status } = error.response;

      // On 401 Unauthorized, clear stored token and redirect to login
      if (status === 401) {
        localStorage.removeItem('crm-token');
        // Guard against redirect loops when already on the login page
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request was sent but no response received — server is down or unreachable
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-connection-error', // Deduplicate toasts
      });
    }

    return Promise.reject(error);
  }
);

export default api;
