import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../components/BookCard';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { matchesApi } from '../api/matches';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { getCurrentUserId } from '../api/apiUtils';
import { useNavigate } from 'react-router-dom';

const springTransition = { type: "spring", stiffness: 300, damping: 20 };

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [mostWantedBooks, setMostWantedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      try {
        const userData = await usersApi.getUserProfile(userId);
        setUser(userData);
      } catch (userError) {
        console.error('Error fetching user profile:', userError);
        setUser({ name: 'User', email: 'user@example.com' });
      }
      
      // Fetch user matches
      try {
        const userMatches = await matchesApi.getUserMatches(userId);
        setMatches(userMatches || []);
      } catch (matchesError) {
        console.error('Error fetching user matches:', matchesError);
        setMatches([]);
      }
      
      // Fetch most wanted books
      try {
        const wantedBooks = await booksApi.getMostWantedBooks();
        setMostWantedBooks(wantedBooks?.slice(0, 3) || []);
      } catch (booksError) {
        console.error('Error fetching most wanted books:', booksError);
        setMostWantedBooks([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await booksApi.publishBook(bookData);
      handleModalClose(true);
    } catch (error) {
      console.error('Error publishing book:', error);
      setError('Failed to publish book. Please try again.');
    }
  };

  const handleRequestBook = async (requestData) => {
    try {
      await booksApi.requestBook(requestData);
      handleModalClose(true);
    } catch (error) {
      console.error('Error requesting book:', error);
      setError('Failed to request book. Please try again.');
    }
  };

  const handleMatchUpdate = async (matchId, action) => {
    try {
      if (action === 'accept') {
        await matchesApi.acceptMatch(matchId);
      } else if (action === 'decline') {
        await matchesApi.declineMatch(matchId);
      }
      fetchDashboardData();
      setShowMatchModal(false);
    } catch (error) {
      console.error('Error updating match:', error);
      setError(`Failed to ${action} match. Please try again.`);
    }
  };

  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  const handleModalClose = (refreshData = false) => {
    setShowPublishModal(false);
    setShowRequestModal(false);
    setShowMatchModal(false);
    
    if (refreshData) {
      fetchDashboardData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-2xl font-bold">
                  {user?.fullName?.[0] || '?'}
                </span>
              </motion.div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  Welcome back, {user?.fullName || 'User'}!
                </motion.h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={() => setShowPublishModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-colors duration-300 shadow-md"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Publish Book
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Request Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center shadow-sm"
            role="alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}

        {/* Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Matches Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Matches
              </h2>
              <span className="text-sm text-gray-500">{matches.length} matches</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => handleViewMatch(match)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{match.book?.title || 'Unknown Book'}</h3>
                        <p className="mt-1 text-sm text-gray-500">Status: {match.status}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click to respond
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by publishing or requesting a book.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Most Wanted Books Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Most Wanted Books
              </h2>
              <span className="text-sm text-gray-500">{mostWantedBooks.length} books</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {mostWantedBooks.length > 0 ? (
                mostWantedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-gray-100 to-gray-200">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">Course: {book.course || 'N/A'}</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPublishModal(true)}
                        className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Publish Book
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No wanted books</h3>
                  <p className="mt-1 text-sm text-gray-500">Be the first to request a book!</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPublishModal && (
          <PublishBookModal 
            isOpen={showPublishModal}
            onClose={() => handleModalClose()}
            onPublish={handlePublishBook}
          />
        )}
        
        {showRequestModal && (
          <RequestBookModal 
            isOpen={showRequestModal}
            onClose={() => handleModalClose()}
            onRequest={handleRequestBook}
          />
        )}
        
        {showMatchModal && selectedMatch && (
          <MatchNotificationModal 
            isOpen={showMatchModal}
            onClose={() => handleModalClose()}
            match={selectedMatch}
            onMatchUpdate={handleMatchUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
