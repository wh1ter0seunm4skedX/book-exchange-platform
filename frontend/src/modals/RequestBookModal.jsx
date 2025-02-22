import React, { useState } from 'react';
import Modal from '../components/Modal';

const RequestBookModal = ({ isOpen, onClose, book, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(book.id);
      onClose();
    } catch (error) {
      console.error('Error requesting book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Book">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-32 w-24 overflow-hidden rounded-lg">
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{book.author}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {book.condition}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Owner: {book.owner.name}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Before requesting this book
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Make sure you're available for in-person exchange</li>
                  <li>Check the book's condition description</li>
                  <li>Be ready to handle the book with care</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

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
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Requesting...' : 'Confirm Request'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestBookModal;
