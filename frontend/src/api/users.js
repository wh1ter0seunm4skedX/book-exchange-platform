// Functions for handling user stuff on the backend
import { apiRequest, getCurrentUserId } from './apiUtils';

export const usersApi = {
  // Fetch all users
  getAllUsers: async () => {
    return apiRequest('/book_exchange_platform/users/all');
  },
  
  // Get a user’s profile
  getUserProfile: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/users/${id}`);
  },

  // Update a user’s profile
  updateUserProfile: async (userData) => {
    return apiRequest('/book_exchange_platform/users/update', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  // Grab a user’s matches
  getUserMatches: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/matches/${id}/match`);
  }
};