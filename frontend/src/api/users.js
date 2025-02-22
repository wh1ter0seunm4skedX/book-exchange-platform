import { mockUser, mockMatches } from '../mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const usersApi = {
  // Get user profile
  getUserProfile: async (userId) => {
    await delay(500);
    if (userId === mockUser.id) {
      return mockUser;
    }
    throw new Error('User not found');
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    await delay(500);
    if (userId === mockUser.id) {
      Object.assign(mockUser, userData);
      return mockUser;
    }
    throw new Error('User not found');
  },

  // Get user matches
  getUserMatches: async (userId) => {
    await delay(500);
    return mockMatches.filter(
      match => match.requesterId === userId || match.ownerId === userId
    );
  },

  // Update match status
  updateMatchStatus: async (matchId, status) => {
    await delay(500);
    const match = mockMatches.find(m => m.id === matchId);
    if (match) {
      match.status = status;
      // If match is accepted, update book availability
      if (status === 'accepted') {
        const book = mockBooks.find(b => b.id === match.bookId);
        if (book) {
          book.available = false;
        }
      }
      return match;
    }
    throw new Error('Match not found');
  }
};
