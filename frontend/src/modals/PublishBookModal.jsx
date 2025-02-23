import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { mockBooks } from '../mockData';

const PublishBookModal = ({ isOpen, onClose, onPublish, selectedBook }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseNumber: '',
    author: '',
    edition: '',
    condition: 'Like New',
    notes: ''
  });

  useEffect(() => {
    if (selectedBook) {
      setFormData({
        ...formData,
        title: selectedBook.title,
        courseNumber: selectedBook.courseNumber,
        author: selectedBook.author,
        edition: selectedBook.edition,
        condition: 'Like New', // Default to Like New
        notes: '' // Clear notes for new entry
      });
    }
  }, [selectedBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPublish(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {selectedBook ? 'Publish Selected Book' : 'Publish a Book'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              readOnly={!!selectedBook}
            />
          </div>
          <div>
            <label htmlFor="courseNumber" className="block text-sm font-medium text-gray-700">
              Course Number
            </label>
            <input
              type="text"
              name="courseNumber"
              id="courseNumber"
              value={formData.courseNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              readOnly={!!selectedBook}
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              readOnly={!!selectedBook}
            />
          </div>
          <div>
            <label htmlFor="edition" className="block text-sm font-medium text-gray-700">
              Edition
            </label>
            <input
              type="text"
              name="edition"
              id="edition"
              value={formData.edition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              readOnly={!!selectedBook}
            />
          </div>
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
