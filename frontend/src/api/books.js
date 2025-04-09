// Functions for dealing with books on the backend
import { apiRequest, getCurrentUserId } from './apiUtils';

export const booksApi = {
  // Grab all books in the catalog
  getAllBooks: async () => {
    return apiRequest('/book_exchange_platform/books/all');
  },
  
  // Get the most wanted books
  getMostWantedBooks: async () => {
    return apiRequest('/book_exchange_platform/books/most_wanted');
  },
  
  // Fetch books the current user published
  getUserPublishedBooks: async (userId = null) => {
    const id = userId || getCurrentUserId();
    return apiRequest(`/book_exchange_platform/books/${id}/user_published`);
  },

  // Put a book up for exchange
  publishBook: async (bookData) => {
    const userId = getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${userId}/publication`, {
      method: 'POST',
      body: JSON.stringify({
        id: bookData.bookId,
        title: bookData.title,
        courseNumber: bookData.courseNumber,
        coverImageUrl: bookData.coverImage
      })
    });
  },

  // Ask for a book to exchange
  requestBook: async (requestData) => {
    const userId = getCurrentUserId();
    return apiRequest(`/book_exchange_platform/trades/${userId}/request`, {
      method: 'POST',
      body: JSON.stringify({
        id: requestData.bookId,
        title: requestData.title,
        courseNumber: requestData.courseNumber
      })
    });
  }
};