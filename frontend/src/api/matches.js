/**
 * Matches API functions for interacting with the backend
 */

import { apiRequest, getCurrentUserId } from './apiUtils';

export const matchesApi = {
  /**
   * Get matches for the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of matches
   */
  getUserMatches: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/Matches/${id}`);
  },

  /**
   * Get book requests for the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of book requests
   */
  getUserRequests: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/Matches/${id}/request`);
  },

  /**
   * Add a new book request
   * @param {Object} book Book to request
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} Created match
   */
  addBookRequest: async (book, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/Matches/${id}/request`, {
      method: 'POST',
      body: JSON.stringify(book)
    });
  },

  /**
   * Update a book request
   * @param {Object} requestData Updated request data
   * @returns {Promise<Object>} Updated request
   */
  updateRequest: async (requestData) => {
    return apiRequest('/book_exchange_platform/Matches/update_request', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  /**
   * Delete a book request
   * @param {Object} requestData Request to delete
   * @returns {Promise<void>}
   */
  deleteRequest: async (requestData) => {
    return apiRequest('/book_exchange_platform/Matches/request', {
      method: 'DELETE',
      body: JSON.stringify(requestData)
    });
  },

  /**
   * Get publications for the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of publications
   */
  getUserPublications: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/Matches/${id}/publication`);
  },

  /**
   * Publish a book
   * @param {Object} bookPublication Book publication data
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} Created match
   */
  publishBook: async (bookPublication, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/Matches/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify(bookPublication)
    });
  },

  /**
   * Update a publication
   * @param {Object} publicationData Updated publication data
   * @returns {Promise<Object>} Updated publication
   */
  updatePublication: async (publicationData) => {
    return apiRequest('/book_exchange_platform/Matches/update_publication', {
      method: 'POST',
      body: JSON.stringify(publicationData)
    });
  },

  /**
   * Delete a publication
   * @param {Object} publicationData Publication to delete
   * @returns {Promise<void>}
   */
  deletePublication: async (publicationData) => {
    return apiRequest('/book_exchange_platform/Matches/publication', {
      method: 'DELETE',
      body: JSON.stringify(publicationData)
    });
  },

  /**
   * Accept a match
   * @param {string} matchId ID of the match to accept
   * @returns {Promise<Object>} Updated match
   */
  acceptMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/Matches/${matchId}/accept`, {
      method: 'POST'
    });
  },

  /**
   * Decline a match
   * @param {string} matchId ID of the match to decline
   * @returns {Promise<Object>} Updated match
   */
  declineMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/Matches/${matchId}/decline`, {
      method: 'POST'
    });
  },

  /**
   * Get match details
   * @param {string} matchId ID of the match to get details for
   * @returns {Promise<Object>} Match details
   */
  getMatchDetails: async (matchId) => {
    return apiRequest(`/book_exchange_platform/Matches/details/${matchId}`);
  }
};
