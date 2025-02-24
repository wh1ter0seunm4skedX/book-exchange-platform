import { mockBooks, mockPublishedBooks, mockBookRequests, mockMatches } from '../mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const booksApi = {
  // Get all books
  getAllBooks: async () => {
    await delay(500);
    return mockBooks;
  },

  // Get all published books
  getAllPublishedBooks: async () => {
    await delay(500);
    const publishedBooks = mockPublishedBooks
      .filter(pub => pub.status === 'active')
      .map(pub => {
        const book = mockBooks.find(b => b.id === pub.bookId);
        return { ...book, publication: pub };
      });
    return publishedBooks;
  },

  // Get user's published books
  getUserPublishedBooks: async (userId) => {
    await delay(500);
    const userPublications = mockPublishedBooks
      .filter(pub => pub.userId === userId)
      .map(pub => {
        const book = mockBooks.find(b => b.id === pub.bookId);
        return { ...book, condition: pub.condition, notes: pub.notes, publication: pub };
      });
    return userPublications;
  },

  // Get user's requested books
  getUserRequestedBooks: async (userId) => {
    await delay(500);
    const userRequests = mockBookRequests
      .filter(req => req.userId === userId)
      .map(req => {
        const book = mockBooks.find(b => b.id === req.bookId);
        const publication = mockPublishedBooks.find(pub => pub.bookId === req.bookId);
        return {
          ...book,
          urgency: req.urgency,
          notes: req.notes,
          request: req,
          publication,
          requestDate: req.createdAt
        };
      });
    return userRequests;
  },

  // Get most wanted books
  getMostWantedBooks: async () => {
    await delay(500);
    // Count requests per book
    const requestCounts = mockBookRequests.reduce((acc, req) => {
      acc[req.bookId] = (acc[req.bookId] || 0) + 1;
      return acc;
    }, {});

    // Get books with request counts
    const booksWithCounts = mockBooks
      .map(book => ({
        ...book,
        requestCount: requestCounts[book.id] || 0
      }))
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, 5); // Top 5 most requested books

    return booksWithCounts;
  },

  // Publish a book
  publishBook: async (bookData) => {
    await delay(500);
    const newPublication = {
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      ...bookData
    };
    mockPublishedBooks.push(newPublication);
    return newPublication;
  },

  // Request a book
  requestBook: async (bookData) => {
    await delay(500);
    const newRequest = {
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...bookData
    };
    mockBookRequests.push(newRequest);
    return newRequest;
  },

  // Update book request status
  updateRequestStatus: async (requestId, status) => {
    await delay(500);
    const request = mockBookRequests.find(req => req.id === requestId);
    if (request) {
      request.status = status;
      return request;
    }
    throw new Error('Request not found');
  }
};
