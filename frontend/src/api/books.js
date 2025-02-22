import { mockBooks, mockMatches } from '../mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const booksApi = {
  // Get all available books
  getAllBooks: async () => {
    await delay(500);
    return mockBooks;
  },

  // Get books owned by user
  getUserBooks: async (userId) => {
    await delay(500);
    return mockBooks.filter(book => book.owner.id === userId);
  },

  // Get books requested by user
  getRequestedBooks: async (userId) => {
    await delay(500);
    const userMatches = mockMatches.filter(match => match.requesterId === userId);
    return mockBooks.filter(book => userMatches.some(match => match.bookId === book.id));
  },

  // Publish a new book
  publishBook: async (bookData) => {
    await delay(500);
    const newBook = {
      id: String(mockBooks.length + 1),
      ...bookData,
      available: true,
      coverImage: `https://placehold.co/400x600?text=${encodeURIComponent(bookData.title)}`
    };
    mockBooks.push(newBook);
    return newBook;
  },

  // Request a book
  requestBook: async (bookId, userId) => {
    await delay(500);
    const match = {
      id: String(mockMatches.length + 1),
      bookId,
      requesterId: userId,
      ownerId: mockBooks.find(book => book.id === bookId).owner.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockMatches.push(match);
    return match;
  },

  // Update book status
  updateBookStatus: async (bookId, status) => {
    await delay(500);
    const book = mockBooks.find(b => b.id === bookId);
    if (book) {
      book.available = status;
      return book;
    }
    throw new Error('Book not found');
  }
};
