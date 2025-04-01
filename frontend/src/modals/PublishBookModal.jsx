import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { booksApi } from '../api/books';

const PublishBookModal = ({ isOpen, onClose, onPublish, initialBookData = null }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    condition: 'Like New',
    notes: ''
  });
  const [currentBook, setCurrentBook] = useState(null);

  // Fetch all books when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBooks();
    }
  }, [isOpen]);

  // Update form when initialBook changes
  useEffect(() => {
    if (initialBookData) {
      setFormData(prev => ({
        ...prev,
        bookId: initialBookData.id
      }));
      setCurrentBook(initialBookData);
    }
  }, [initialBookData]);

  // Update currentBook when bookId changes
  useEffect(() => {
    if (formData.bookId && books.length > 0) {
      const selected = books.find(book => book.id === parseInt(formData.bookId, 10));
      setCurrentBook(selected || null);
    } else {
      setCurrentBook(null);
    }
  }, [formData.bookId, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await booksApi.getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentBook) return;
    
    onPublish({
      bookId: parseInt(formData.bookId, 10),
      title: currentBook.title,
      courseNumber: currentBook.courseNumber,
      author: currentBook.author,
      coverImage: currentBook.coverImage,
      condition: formData.condition,
      notes: formData.notes
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Book">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
            Select Book to Publish
          </label>
          <div>
            {loading ? (
              <div className="mt-2 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-500">Loading books...</span>
              </div>
            ) : (
              <select
                name="bookId"
                id="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
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

          {currentBook && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-24 w-16 bg-gray-100 rounded-lg overflow-hidden">
                  {currentBook ? (
                    <img
                      src={`/coursesImages/${currentBook.courseNumber}.png`}
                      alt={currentBook.title}
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
                  <h4 className="text-sm font-medium text-gray-900">{currentBook.title}</h4>
                  <p className="text-sm text-gray-600">Course Number: {currentBook.courseNumber}</p>
                  {currentBook.author && (
                    <p className="text-sm text-gray-600">Author: {currentBook.author}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              disabled={!currentBook || loading}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>

    </Modal>
  );
};

export default PublishBookModal;
