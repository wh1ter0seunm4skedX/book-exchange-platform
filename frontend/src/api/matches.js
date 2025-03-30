/**
 * Trades API functions for interacting with the backend
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
    return apiRequest(`/book_exchange_platform/trades/${id}/match`);
  },

  /**
   * Get book requests for the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of book requests
   */
  getUserRequests: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/request`);
  },

  /**
   * Add a new book request
   * @param {Object} book Book to request
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} Created match
   */
  addBookRequest: async (book, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/request`, {
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
    return apiRequest('/book_exchange_platform/trades/update_request', {
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
    return apiRequest('/book_exchange_platform/trades/request', {
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
    return apiRequest(`/book_exchange_platform/trades/${id}/publication`);
  },

  /**
   * Publish a book
   * @param {Object} bookPublication Book publication data
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} Created match
   */
  publishBook: async (bookPublication, userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${id}/publication`, {
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
    return apiRequest('/book_exchange_platform/trades/update_publication', {
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
    // Attempting workaround: Send only the ID, as the backend might be failing with the full object
    // despite the @RequestBody annotation. The 500 error suggests a backend processing issue.
    return apiRequest('/book_exchange_platform/trades/publication', {
      method: 'DELETE',
      body: JSON.stringify({ id: publicationData.id })
    });
  },

  /**
   * Accept a match
   * @param {string} matchId ID of the match to accept
   * @returns {Promise<Object>} Updated match
   */
  acceptMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/${matchId}/confirm_match`, {
      method: 'POST'
    });
  },

  /**
   * Decline a match
   * @param {string} matchId ID of the match to decline
   * @returns {Promise<Object>} Updated match
   */
  declineMatch: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/cancel_match`, {
      method: 'POST',
      body: JSON.stringify({
        id: matchId,
        status: 'DECLINED'
      })
    });
  },

  /**
   * Get match details
   * @param {string} matchId ID of the match to get details for
   * @returns {Promise<Object>} Match details
   */
  getMatchDetails: async (matchId) => {
    return apiRequest(`/book_exchange_platform/trades/match/${matchId}`);
  }
};
