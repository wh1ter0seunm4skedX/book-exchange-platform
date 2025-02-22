import React, { useState } from 'react';
import Modal from '../components/Modal';

const MatchNotificationModal = ({ isOpen, onClose, match, book, onAccept, onDecline }) => {
  const [loading, setLoading] = useState(false);

  if (!match || !book) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      if (action === 'accept') {
        await onAccept(match.id);
      } else {
        await onDecline(match.id);
      }
      onClose();
    } catch (error) {
      console.error('Error handling match response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Match Found!">
      <div className="space-y-6">
        {/* Book Details */}
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
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Match Found!
              </span>
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Next Steps
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Accept the match to proceed with the exchange</li>
                  <li>Contact information will be shared after acceptance</li>
                  <li>Arrange a meeting place and time</li>
                  <li>Handle the book with care during the exchange</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => handleAction('decline')}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleAction('accept')}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Processing...' : 'Accept Match'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchNotificationModal;
