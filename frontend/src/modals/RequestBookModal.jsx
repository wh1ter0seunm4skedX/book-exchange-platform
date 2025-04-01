import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { booksApi } from '../api/books';

const RequestBookModal = ({ isOpen, onClose, onRequest }) => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    bookId: '',
    urgency: 'medium',
    notes: ''
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingBooks, setFetchingBooks] = useState(false);

  // Fetch books when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBooks();
    }
  }, [isOpen]);

  // Update selectedBook when bookId changes
  useEffect(() => {
    if (formData.bookId && books.length > 0) {
      const book = books.find(b => b.id === parseInt(formData.bookId, 10));
      setSelectedBook(book || null);
    } else {
      setSelectedBook(null);
    }
  }, [formData.bookId, books]);

  const fetchBooks = async () => {
    try {
      setFetchingBooks(true);
      const allBooks = await booksApi.getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setFetchingBooks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    setLoading(true);
    try {
      await onRequest({
        bookId: parseInt(formData.bookId, 10),
        title: selectedBook.title,
        courseNumber: selectedBook.courseNumber,
        author: selectedBook.author,
        urgency: formData.urgency,
        notes: formData.notes,
        date: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error requesting book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      urgency: 'medium',
      notes: ''
    });
    setSelectedBook(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Book">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Selection */}
        <div>
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
            Select Book to Request
          </label>
          {fetchingBooks ? (
            <div className="mt-2 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">Loading books...</span>
            </div>
          ) : (
            <select
              id="bookId"
              name="bookId"
              required
              value={formData.bookId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Choose a book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.courseNumber}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Book Details */}
        {selectedBook && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-24 w-16 bg-gray-100 rounded-lg overflow-hidden">
                {selectedBook ? (
                  <img
                    src={`/coursesImages/${selectedBook.courseNumber}.png`}
                    alt={selectedBook.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/coursesImages/default-book-cover.png';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{selectedBook.title}</h4>
                <p className="text-sm text-gray-600">Course: {selectedBook.courseNumber}</p>
                {selectedBook.author && (
                  <p className="text-sm text-gray-600">Author: {selectedBook.author}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.bookId || fetchingBooks}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestBookModal;
