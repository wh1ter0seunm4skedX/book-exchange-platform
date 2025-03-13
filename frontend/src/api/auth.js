/**
 * Authentication API functions
 */

import { apiRequest } from './apiUtils';

export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} The registered user data
   */
  register: async (userData) => {
    return apiRequest('/book_exchange_platform/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Login a user
   * @param {Object} credentials User login credentials
   * @returns {Promise<Object>} The login response with token and user info
   */
  login: async (credentials) => {
    const response = await apiRequest('/book_exchange_platform/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Store authentication data in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('email', response.email);
    }
    
    return response;
  }
};
