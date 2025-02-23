import React, { useState } from 'react';
import Modal from '../components/Modal';
import { mockBooks, mockUsers, mockPublishedBooks } from '../mockData';

const RequestBookModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    urgency: 'medium',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(formData);
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

  // Get available books (those with active publications)
  const availableBooks = mockBooks.filter(book => 
    mockPublishedBooks.some(pub => pub.bookId === book.id && pub.status === 'active')
  );

  const selectedBook = mockBooks.find(book => book.id === formData.bookId);
  const selectedBookPublication = selectedBook 
    ? mockPublishedBooks.find(pub => pub.bookId === selectedBook.id && pub.status === 'active')
    : null;
  const bookOwner = selectedBookPublication 
    ? mockUsers.find(user => user.id === selectedBookPublication.userId)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Book">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Selection */}
        <div>
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
            Select Available Book
          </label>
          <select
            id="bookId"
            name="bookId"
            required
            value={formData.bookId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Choose a book</option>
            {availableBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.courseNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Book Details */}
        {selectedBook && selectedBookPublication && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{selectedBook.title}</h4>
              <p className="text-sm text-gray-600">Author: {selectedBook.author}</p>
              <p className="text-sm text-gray-600">Edition: {selectedBook.edition}</p>
              <p className="text-sm text-gray-600">Course: {selectedBook.courseNumber}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Book Condition</h5>
              <p className="text-sm text-gray-600 capitalize">Condition: {selectedBookPublication.condition}</p>
              <div className="mt-1 space-x-2">
                {selectedBookPublication.hasHighlights && <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Has highlights</span>}
                {selectedBookPublication.hasPencilMarks && <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Has pencil marks</span>}
                {selectedBookPublication.missingPages && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Missing pages</span>}
              </div>
              {selectedBookPublication.additionalNotes && (
                <p className="mt-2 text-sm text-gray-500 italic">{selectedBookPublication.additionalNotes}</p>
              )}
            </div>

            {bookOwner && (
              <div className="border-t border-gray-200 pt-3">
                <h5 className="text-sm font-medium text-gray-900 mb-1">Owner Information</h5>
                <p className="text-sm text-gray-600">{bookOwner.name}</p>
                <p className="text-sm text-gray-600">Exchange Location: {selectedBookPublication.preferredExchangeLocation}</p>
              </div>
            )}
          </div>
        )}

        {/* Request Urgency */}
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
            Request Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="low">Low - No rush</option>
            <option value="medium">Medium - Need within a few weeks</option>
            <option value="high">High - Need as soon as possible</option>
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Any additional information for the book owner..."
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.bookId}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestBookModal;
