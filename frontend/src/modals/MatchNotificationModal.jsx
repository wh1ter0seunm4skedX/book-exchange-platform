import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import { matchesApi } from '../api/matches';
import BookCard from '../components/BookCard';
import Confetti from 'react-confetti'; // Import react-confetti

const MatchNotificationModal = ({ isOpen, onClose, match, onMatchUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 20000);
      return () => clearTimeout(timer); 
    }
  }, [isOpen]);

  if (!match) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      if (action === 'accept') {
        await matchesApi.acceptMatch(match.id);
      } else if (action === 'decline') {
        await matchesApi.declineMatch(match.id);
      }
      
      if (onMatchUpdate) {
        onMatchUpdate(match.id, action);
      }
      
      onClose();
    } catch (error) {
      console.error('Error handling match response:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCoverImage = '/images/default-book-cover.png';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200} // Adjust number of confetti pieces
          recycle={false} // Stop confetti after initial burst
          colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']} // Custom colors
        />
      )}

      <div className="bg-white px-6 pt-6 pb-6 sm:pb-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-start space-x-4">
            <BookCard
              book={{
                ...match.book,
                coverImage: match.book.coverImage ? `/coursesImages/${match.book.coverImage}` : '/coursesImages/default-book-cover.png'
              }}
              showRequestButton={false}
              status={match.status}
              date={match.matchDate}
            />
          </div>
        </motion.div>

        {/* Match Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm"
        >
          <div className="flex">
            <div className="space-y-4 w-full">
              <h3 className="text-sm font-semibold text-blue-900">
                Match Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Owner</p>
                      <p className="text-sm text-blue-700">{match.matchedUser?.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Location</p>
                      <p className="text-sm text-blue-700">{match.matchedUser?.preferredExchangeLocation}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900">Next Steps:</p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Accept the match to proceed</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Contact info shared after acceptance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Arrange meeting details</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => handleAction('decline')}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleAction('accept')}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 text-white">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                Processing...
              </>
            ) : (
              'Accept Match'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchNotificationModal;