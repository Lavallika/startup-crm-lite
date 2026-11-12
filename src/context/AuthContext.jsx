import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          const result = await authService.getProfile();
          // result shape: { success: true, message: ..., data: { user } }
          if (result.success && result.data?.user) {
            setUser(result.data.user);
            setToken(storedToken);
          } else {
            // If response succeeded but had invalid data structure
            localStorage.removeItem('crm-token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          // Token is likely invalid/expired, clear state
          localStorage.removeItem('crm-token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Log in user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.data) {
        const { token: userToken, user: userData } = result.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData);
        toast.success(result.message || 'Logged in successfully!');
        return { success: true };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Invalid credentials';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, password);
      if (result.success && result.data) {
        const { token: userToken, user: userData } = result.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData);
        toast.success(result.message || 'Registered successfully!');
        return { success: true };
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update profile details (name, notification preferences, password)
   * @param {Object} data 
   * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
   */
  const updateUserProfile = async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.updateProfile(data);
      if (result.success && result.data?.user) {
        setUser(result.data.user);
        toast.success(result.message || 'Profile updated successfully!');
        return { success: true, user: result.data.user };
      }
      throw new Error(result.message || 'Failed to update profile');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out current user
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    // Force direct browser navigation to login to trigger router redirect cleanly
    window.location.href = '/login';
  };

  /**
   * Permanently delete the authenticated user's account.
   * @param {string} password - Confirmation password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteAccount = async (password) => {
    try {
      const result = await authService.deleteAccount(password);
      if (result.success) {
        // Clear local state before redirect
        authService.logout();
        setToken(null);
        setUser(null);
        toast.success('Account deleted. We\'re sorry to see you go.');
        window.location.href = '/login';
        return { success: true };
      }
      throw new Error(result.message || 'Account deletion failed');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Account deletion failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser, updateUserProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
