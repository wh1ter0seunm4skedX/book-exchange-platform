import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import { booksApi } from '../api/books';
import {
  HiOutlineBookOpen,
  HiArrowPath,
  HiMagnifyingGlass,
  HiPaperAirplane,
  HiOutlinePaperAirplane,
  HiXMark,
  HiExclamationCircle,
} from 'react-icons/hi2';

// A modal for publishing or requesting books
const BookActionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode = 'request', // 'publish' or 'request'
  initialBookData = null
}) => {
  const isPublishMode = mode === 'publish';
  const modalTitle = isPublishMode ? "Publish a Book" : "Request a Book";
  const buttonText = isPublishMode ? "Publish" : "Send Request";
  
  const [allBooks, setAllBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [formData, setFormData] = useState({ bookId: '' });
  const [selectedBook, setSelectedBook] = useState(null);

  // Grab books when the modal opens
  useEffect(() => {
    if (isOpen && allBooks.length === 0) fetchBooks();
    if (isOpen) {
      resetFormFields();
      setFetchError('');
    }
  }, [isOpen]);

  // Pre-fill the form if we’re publishing with initial data
  useEffect(() => {
    if (initialBookData && isPublishMode) {
      setFormData({ bookId: initialBookData.id });
      setSelectedBook(initialBookData);
    }
  }, [initialBookData, isPublishMode]);

  // Update the preview when a book is picked
  useEffect(() => {
    if (formData.bookId) {
      const selected = allBooks.find(book => book.id === parseInt(formData.bookId, 10)) ||
                      (initialBookData && initialBookData.id === parseInt(formData.bookId, 10) ? initialBookData : null);
      setSelectedBook(selected || null);
    } else {
      setSelectedBook(null);
    }
  }, [formData.bookId, allBooks, initialBookData]);

  // Load the book list from the API
  const fetchBooks = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const booksData = await booksApi.getAllBooks();
      setAllBooks(booksData || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setFetchError('Could not load book list. Please try again.');
      setAllBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    if (!searchTerm) return allBooks;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return allBooks.filter(book =>
      book.title?.toLowerCase().includes(lowerCaseSearch) ||
      String(book.courseNumber)?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, allBooks]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    setSubmitLoading(true);
    try {
      const payload = {
        bookId: parseInt(formData.bookId, 10),
        title: selectedBook.title,
        courseNumber: selectedBook.courseNumber,
        coverImage: selectedBook.coverImage,
      };
      if (!isPublishMode) payload.date = new Date().toISOString();
      
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error(`Error ${isPublishMode ? 'publishing' : 'requesting'} book:`, error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update form when selection changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update search term as user types
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Clear the form when needed
  const resetFormFields = () => {
    if (!initialBookData || !isPublishMode) {
      setFormData({ bookId: '' });
      setSelectedBook(null);
    } else {
      setFormData({ bookId: initialBookData.id });
      setSelectedBook(initialBookData);
    }
    setSearchTerm('');
    setSubmitLoading(false);
  };

  // Close the modal and reset everything
  const handleClose = () => {
    resetFormFields();
    onClose();
  };

  const idPrefix = isPublishMode ? 'publish' : 'request';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Search bar for finding books */}
        <div>
          <label htmlFor={`${idPrefix}BookSearch`} className="block text-sm font-medium text-gray-700 mb-1.5">
            Search Book by Title or Course #
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMagnifyingGlass className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              id={`${idPrefix}BookSearch`}
              name="bookSearch"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Start typing to find book..."
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white"
            />
          </div>
        </div>

        {/* Dropdown to pick a book */}
        <div>
          <label htmlFor={`${idPrefix}BookId`} className="sr-only">Select Book</label>
          {isLoading && (
            <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
              <HiArrowPath className="animate-spin h-4 w-4 mr-2 text-blue-500" aria-hidden="true"/>
              Loading books...
            </div>
          )}
          {fetchError && !isLoading && (
            <div className="mt-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
              <HiExclamationCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{fetchError}</span>
              <button type="button" onClick={fetchBooks} className="ml-auto text-sm font-medium text-red-800 hover:underline">Retry</button>
            </div>
          )}
          {!isLoading && !fetchError && (
            <select
              id={`${idPrefix}BookId`}
              name="bookId"
              value={formData.bookId}
              onChange={handleSelectChange}
              className={`mt-1 block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white sm:text-sm disabled:opacity-50 ${!formData.bookId ? 'text-gray-400' : ''}`}
              required
              disabled={isLoading || !!fetchError}
            >
              <option value="" disabled>
                {searchTerm ? 'Select from results...' : 'Choose a book...'}
              </option>
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.courseNumber})
                  </option>
                ))
              ) : (
                !searchTerm && allBooks.length > 0 ? (
                  <option disabled>Type to search books</option>
                ) : searchTerm ? (
                  <option disabled>No books match "{searchTerm}"</option>
                ) : (
                  <option disabled>No books available</option>
                )
              )}
            </select>
          )}
        </div>

        {/* Preview of the selected book */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              key={`${idPrefix}-preview`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 overflow-hidden"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-24 w-16 bg-gray-100 rounded-md overflow-hidden shadow-sm">
                  <img
                    key={selectedBook.courseNumber}
                    src={`/coursesImages/${selectedBook.courseNumber}.png`}
                    alt={`Cover for ${selectedBook.title}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="h-full w-full flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                    <HiOutlineBookOpen className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">{selectedBook.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">Course: {selectedBook.courseNumber}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons to submit or cancel */}
        <div className={isPublishMode ? 
          "mt-5 pt-5 border-t border-gray-200 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3" :
          "mt-6 pt-5 border-t border-gray-200 flex justify-end space-x-3"
        }>
          {!isPublishMode && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleClose}
              disabled={submitLoading}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <HiXMark className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
              Cancel
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitLoading || !selectedBook || isLoading || !!fetchError}
            className={`inline-flex ${isPublishMode ? 'w-full' : ''} justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 ${isPublishMode ? 'text-base' : 'text-sm'} font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isPublishMode ? 'sm:col-start-2 sm:text-sm' : ''} disabled:opacity-60 disabled:cursor-not-allowed transition-opacity`}
          >
            {submitLoading ? (
              <HiArrowPath className="animate-spin -ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
            ) : isPublishMode ? (
              <HiPaperAirplane className="-ml-1 mr-2 h-5 w-5 transform rotate-[-45deg]" aria-hidden="true"/>
            ) : (
              <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5 transform rotate-[-45deg]" aria-hidden="true"/>
            )}
            {submitLoading ? 'Sending...' : buttonText}
          </motion.button>
          {isPublishMode && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            >
              <HiXMark className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default BookActionModal;