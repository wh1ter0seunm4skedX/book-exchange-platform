/**
 * Users API functions for interacting with the backend
 */

import { apiRequest, getCurrentUserId } from './apiUtils';

export const usersApi = {
  /**
   * Get all users
   * @returns {Promise<Array>} List of all users
   */
  getAllUsers: async () => {
    return apiRequest('/book_exchange_platform/users/all');
  },
  
  /**
   * Get user profile by ID
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/users/${id}`);
  },

  /**
   * Update user profile
   * @param {Object} userData Updated user data
   * @returns {Promise<Object>} Updated user profile
   */
  updateUserProfile: async (userData) => {
    return apiRequest('/book_exchange_platform/users/update', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  /**
   * Get user matches
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of user matches
   */
  getUserMatches: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/matches/${id}/match`);
  }
};
