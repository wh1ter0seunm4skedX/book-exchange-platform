import { mockUsers, mockMatches, mockBookRequests } from '../mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const usersApi = {
  // Get user profile
  getUserProfile: async (userId) => {
    return mockUsers.find(user => user.id === userId);
  },

  // Get user matches
  getUserMatches: async (userId) => {
    return mockMatches.filter(match => {
      const request = mockBookRequests.find(req => req.id === match.requestId);
      return request && request.userId === userId;
    });
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    // In a real app, this would make an API call
    console.log('Updating user profile:', userData);
    return { ...userData, id: userId };
  }
};
