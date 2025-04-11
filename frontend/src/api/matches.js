// Functions for handling trades and matches on the backend
import { apiRequest, getCurrentUserId } from './apiUtils';

export const matchesApi = {
  // Grab matches for the current user
  getUserMatches: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/match`);
  },

  // Fetch book requests for the current user
  getUserRequests: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/request`);
  },

  // Add a new book request
  addBookRequest: async (book, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/request`, {
      method: 'POST',
      body: JSON.stringify(book)
    });
  },

  // Update a book request
  updateRequest: async (requestData) => {
    return apiRequest('/book_exchange_platform/trades/update_request', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  // Delete a book request
  deleteRequest: async (requestData) => {
    return apiRequest('/book_exchange_platform/trades/request', {
      method: 'DELETE',
      body: JSON.stringify(requestData)
    });
  },

  // Get books the current user published
  getUserPublications: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/publication`);
  },

  // Publish a book for trade
  publishBook: async (bookPublication, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/publication`, {
      method: 'POST',
      body: JSON.stringify(bookPublication)
    });
  },

  // Update a published book
  updatePublication: async (publicationData) => {
    return apiRequest('/book_exchange_platform/trades/update_publication', {
      method: 'POST',
      body: JSON.stringify(publicationData)
    });
  },

  // Delete a published book
  deletePublication: async (publicationData) => {
    return apiRequest('/book_exchange_platform/trades/publication', {
      method: 'DELETE',
      body: JSON.stringify({ id: publicationData.id })
    });
  },

  // Delete a specific user request by ID
  deleteUserRequest: async (id) => {
    return apiRequest(`/book_exchange_platform/trades/${id}/request`, { method: 'DELETE' });
  },

  // Delete a specific user publication by ID
  deleteUserPublication: async (id) => {
    return apiRequest(`/book_exchange_platform/trades/${id}/publication`, { method: 'DELETE' });
  },

  // Confirm a match (moves it to PENDING)
  confirmMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/${matchId}/confirm_match`, { method: 'POST' });
  },

  // Cancel a match
  cancelMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/${matchId}/cancel_match`, { method: 'POST' });
  },

  // Complete a match (marks it as COMPLETED)
  completeMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/${matchId}/complete_match`, { method: 'POST' });
  },

  // Get details for a specific match
  getMatchDetails: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/match/${matchId}`);
  }
};