/**
 * Books API functions for interacting with the backend
 */

import { apiRequest, getCurrentUserId } from './apiUtils';

export const booksApi = {
  /**
   * Get all books in the catalog
   * @returns {Promise<Array>} List of all books
   */
  getAllBooks: async () => {
    return apiRequest('/book_exchange_platform/books/all');
  },
  
  /**
   * Get most wanted books
   * @returns {Promise<Array>} List of most wanted books
   */
  getMostWantedBooks: async () => {
    return apiRequest('/book_exchange_platform/books/most_wanted');
  },
  
  /**
   * Get books published by the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of books published by the user
   */
  getUserPublishedBooks: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/books/${id}/user_published`);
  },

  /**
   * Publish a book for exchange
   * @param {Object} bookData Book data including title, courseNumber, condition, etc.
   * @returns {Promise<Object>} Published book data
   */
  publishBook: async (bookData) => {
    const userId = getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${userId}/publish`, {
      method: 'POST',
      body: JSON.stringify({
        book: {
          id: bookData.bookId,
          title: bookData.title,
          courseNumber: bookData.courseNumber,
          coverImage: bookData.coverImage
        },
        date: new Date().toISOString(),
      })
    });
  },

  /**
   * Request a book for exchange
   * @param {Object} requestData Request data including bookId, urgency, notes
   * @returns {Promise<Object>} Request data
   */
  requestBook: async (requestData) => {
    const userId = getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${userId}/request`, {
      method: 'POST',
      body: JSON.stringify({
        book: {
          id: requestData.bookId,
          title: requestData.title,
          courseNumber: requestData.courseNumber,
        },
        date: new Date().toISOString(),
      })
    });
  }
};