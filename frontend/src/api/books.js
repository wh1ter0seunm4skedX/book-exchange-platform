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
   * Get books wanted by the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of books wanted by the user
   */
  getUserWantedBooks: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/books/${id}/user_wanted`);
  },
  
  /**
   * Get books published by the current user
   * @param {string} userId User ID (optional, uses current user if not provided)
   * @returns {Promise<Array>} List of books published by the user
   */
  getUserPublishedBooks: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/books/${id}/user_published`);
  }
};