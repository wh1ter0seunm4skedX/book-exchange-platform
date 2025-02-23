import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { mockBooks } from '../mockData';

const PublishBookModal = ({ isOpen, onClose, onPublish }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    condition: 'Like New',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedBook = mockBooks.find(book => book.id === formData.bookId);
    onPublish({
      ...formData,
      title: selectedBook.title,
      courseNumber: selectedBook.courseNumber,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedBook = formData.bookId ? mockBooks.find(book => book.id === formData.bookId) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Publish a Book
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
              Select Book
            </label>
            <select
              name="bookId"
              id="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Choose a book</option>
              {mockBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.courseNumber}
                </option>
              ))}
            </select>
          </div>

          {selectedBook && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900">{selectedBook.title}</h4>
              <p className="text-sm text-gray-600">Course Number: {selectedBook.courseNumber}</p>
            </div>
          )}

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              id="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Add any additional details about the book's condition or other notes..."
            />
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
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
      </div>
    </Modal>
  );
};

export default PublishBookModal;
