import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import { matchesApi } from '../api/matches';
import { getCurrentUserId } from '../api/apiUtils';
import BookCard from '../components/BookCard';
import Confetti from 'react-confetti';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiCheck, 
  HiChat, 
  HiCalendar, 
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiUsers
} from 'react-icons/hi';

const MatchNotificationModal = ({ isOpen, onClose, match, onMatchUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && match && match.status === 'NEW') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 10000);
      return () => clearTimeout(timer); 
    }
  }, [isOpen, match]);

  if (!match) return null;

  // Extract user information for display
  const exchangePartner = match.requester?.id === getCurrentUserId() 
    ? match.provider 
    : match.requester;

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
          numberOfPieces={200} 
          recycle={false} 
          colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']} 
        />
      )}

      <div className="bg-white px-6 pt-6 pb-6 sm:pb-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            <HiUsers className="h-6 w-6 text-blue-600" aria-hidden="true" />
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
                <HiUser className="h-5 w-5 text-blue-500 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Exchange Partner</p>
                  <p className="text-sm text-blue-700">
                    {exchangePartner?.fullName || 'Unknown User'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <HiMail className="h-5 w-5 text-blue-500 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Contact</p>
                  <p className="text-sm text-blue-700">{exchangePartner?.email || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <HiPhone className="h-5 w-5 text-blue-500 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Phone</p>
                  <p className="text-sm text-blue-700">{exchangePartner?.phoneNumber || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start">
                <HiLocationMarker className="h-5 w-5 text-blue-500 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Location</p>
                  <p className="text-sm text-blue-700">{exchangePartner?.preferredExchangeLocation || 'Not specified'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Next Steps:</p>
              {match.status === 'NEW' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <HiCheck className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Confirm the match to proceed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiChat className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Contact info shared after confirmation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCalendar className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Arrange meeting details</span>
                  </li>
                </ul>
              )}

              {match.status === 'PENDING' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <HiCheck className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Contact the other person</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCalendar className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Meet and exchange the book</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCheckCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Complete the exchange after meeting</span>
                  </li>
                </ul>
              )}

              {match.status === 'COMPLETED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <HiCheckCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Exchange completed successfully</span>
                  </li>
                </ul>
              )}

              {match.status === 'CANCELLED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <HiXCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>Exchange was cancelled</span>
                  </li>
                </ul>
              )}

              {match.status === 'EXPIRED' && (
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <HiClock className="h-4 w-4 text-blue-500" aria-hidden="true" />
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