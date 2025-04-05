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
    if (isOpen && match && match.status === 'NEW') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer); 
    }
  }, [isOpen, match]);

  if (!match) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      if (action === 'confirm') {
        await matchesApi.confirmMatch(match.id);
      } else if (action === 'cancel') {
        await matchesApi.cancelMatch(match.id);
      } else if (action === 'complete') {
        await matchesApi.completeMatch(match.id);
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
      
      if (onMatchUpdate) {
        onMatchUpdate(match.id, action);
      }
      
      onClose();
    } catch (error) {
      console.error('Error handling match action:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate status colors
  const getStatusColors = (status) => {
    switch (status) {
      case 'NEW':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          ring: 'ring-1 ring-indigo-200'
        };
      case 'PENDING':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          ring: 'ring-1 ring-yellow-200'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          ring: 'ring-1 ring-green-200'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          ring: 'ring-1 ring-red-200'
        };
      case 'EXPIRED':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          ring: 'ring-1 ring-gray-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          ring: 'ring-1 ring-gray-200'
        };
    }
  };

  const statusColors = getStatusColors(match.status);
  const isActive = match.status === 'NEW' || match.status === 'PENDING';
  const defaultCoverImage = '/images/default-book-cover.png';

  // Get title based on status
  const getStatusTitle = () => {
    switch (match.status) {
      case 'NEW':
        return 'Book Match Found!';
      case 'PENDING':
        return 'Pending Exchange';
      case 'COMPLETED':
        return 'Completed Exchange';
      case 'CANCELLED':
        return 'Cancelled Exchange';
      case 'EXPIRED':
        return 'Expired Exchange';
      default:
        return 'Book Exchange';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Confetti effect for new matches only */}
      {showConfetti && match.status === 'NEW' && (
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
              {getStatusTitle()}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {match.status === 'NEW' && "Great news! We found a match for your book request."}
                {match.status === 'PENDING' && "Exchange is in progress. Meet up to complete the exchange."}
                {match.status === 'COMPLETED' && "This book exchange has been successfully completed."}
                {match.status === 'CANCELLED' && "This book exchange was cancelled."}
                {match.status === 'EXPIRED' && "This book exchange has expired."}
              </p>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.ring}`}>
                {match.status}
              </span>
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
              date={match.expirationDate}
            />
          </div>
        </motion.div>

        {/* Match Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-100"
        >
          <h4 className="text-sm font-medium text-blue-900 mb-3">Exchange Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex space-x-3 items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Exchange Partner</p>
                  <p className="text-sm text-blue-700">
                    {match.provider?.fullName === match.requester?.fullName ? 'Unknown User' : 
                      match.provider?.id === match.requester?.id ? 'Unknown User' : 
                      (match.provider?.fullName || 'Provider')}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Contact</p>
                  <p className="text-sm text-blue-700">{(match.provider?.email || 'Not available')}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Phone</p>
                  <p className="text-sm text-blue-700">{(match.provider?.phone || 'Not available')}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Location</p>
                  <p className="text-sm text-blue-700">{match.provider?.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Next Steps:</p>
              {match.status === 'NEW' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Confirm the match to proceed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Contact info shared after confirmation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Arrange meeting details</span>
                  </li>
                </ul>
              )}

              {match.status === 'PENDING' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Contact the other person</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Meet and exchange the book</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Complete the exchange after meeting</span>
                  </li>
                </ul>
              )}

              {match.status === 'COMPLETED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Exchange completed successfully</span>
                  </li>
                </ul>
              )}

              {match.status === 'CANCELLED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Exchange was cancelled</span>
                  </li>
                </ul>
              )}

              {match.status === 'EXPIRED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Exchange time has expired</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Close
          </button>

          {match.status === 'NEW' && (
            <>
              <button
                type="button"
                onClick={() => handleAction('cancel')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction('confirm')}
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
                  'Confirm Match'
                )}
              </button>
            </>
          )}

          {match.status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => handleAction('cancel')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction('complete')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  'Complete Exchange'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MatchNotificationModal;