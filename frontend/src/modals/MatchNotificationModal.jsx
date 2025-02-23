import React, { useState } from 'react';
import Modal from '../components/Modal';

const MatchNotificationModal = ({ isOpen, onClose, match }) => {
  const [loading, setLoading] = useState(false);

  if (!match) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log(`${action} match:`, match.id);
      onClose();
    } catch (error) {
      console.error('Error handling match response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Book Match Found!
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Great news! We found a match for your book request.
              </p>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="mt-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-32 w-24 overflow-hidden rounded-lg">
              <img
                src={match.book.coverImage}
                alt={match.book.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900">{match.book.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{match.book.author}</p>
              <p className="mt-1 text-sm text-gray-500">Edition: {match.book.edition}</p>
              <p className="mt-1 text-sm text-gray-500">Course: {match.book.courseNumber}</p>
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Match Details
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p><strong>Owner:</strong> {match.matchedUser.name}</p>
                <p><strong>Location:</strong> {match.matchedUser.preferredLocation}</p>
                <p className="mt-2"><strong>Next Steps:</strong></p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Accept the match to proceed with the exchange</li>
                  <li>Contact information will be shared after acceptance</li>
                  <li>Arrange a meeting place and time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleAction('accept')}
            disabled={loading}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            {loading ? 'Processing...' : 'Accept Match'}
          </button>
          <button
            type="button"
            onClick={() => handleAction('decline')}
            disabled={loading}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchNotificationModal;
