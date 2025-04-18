import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiUpload,
  HiDocumentAdd,
  HiXCircle,
  HiX,
  HiClock,
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiArrowRight,
  HiSparkles,
  HiCheck,
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker
} from 'react-icons/hi';
import BookCard from '../components/BookCard';
import BookActionModal from '../modals/BookActionModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { matchesApi } from '../api/matches';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { getCurrentUserId } from '../api/apiUtils';
import { useNavigate } from 'react-router-dom';

// Animation settings
const springTransition = { type: "spring", stiffness: 300, damping: 20 };
const gentleSpring = { type: "spring", stiffness: 200, damping: 25, mass: 1.2 };

// Main dashboard page
const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [mostWantedBooks, setMostWantedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookActionOpen, setIsBookActionOpen] = useState(false);
  const [actionMode, setActionMode] = useState(null); // 'publish' or 'request'
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [initialBookForPublish, setInitialBookForPublish] = useState(null);

  const navigate = useNavigate();
  const userId = getCurrentUserId();

  // Load all data when the page opens
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Pop up new matches automatically
  useEffect(() => {
    if (matches.length > 0) {
      const newMatch = matches.find(match => match.status === 'NEW');
      if (newMatch) {
        setSelectedMatch(newMatch);
        setShowMatchModal(true);
      }
    }
  }, [matches]);

  // Fetch user data, matches, and most wanted books
  const fetchDashboardData = async () => {
    setError(null);
    setLoading(true);
    try {
      const userData = await usersApi.getUserProfile(userId).catch(err => {
        console.error('Error fetching user profile:', err);
        return { fullName: 'User', email: 'Profile loading error' };
      });
      setUser(userData);

      const [userMatches, wantedBooks] = await Promise.all([
        matchesApi.getUserMatches(userId).catch(err => { console.error('Error fetching matches:', err); return []; }),
        booksApi.getMostWantedBooks().catch(err => { console.error('Error fetching wanted books:', err); return []; })
      ]);

      setMatches(userMatches || []);
      setMostWantedBooks(Array.isArray(wantedBooks) ? wantedBooks.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load some data. Try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  // Open the publish modal
  const openPublishModal = () => {
    setInitialBookForPublish(null);
    setActionMode('publish');
    setIsBookActionOpen(true);
  };

  // Open the request modal
  const openRequestModal = () => {
    setInitialBookForPublish(null);
    setActionMode('request');
    setIsBookActionOpen(true);
  };

  // Close modals and optionally refresh data
  const handleModalClose = (refreshData = false) => {
    setIsBookActionOpen(false);
    setShowMatchModal(false);
    setActionMode(null);
    setSelectedMatch(null);
    setInitialBookForPublish(null);
    if (refreshData) fetchDashboardData();
  };

  // Start publishing a book from "Most Wanted"
  const handleInitiatePublish = (book) => {
    setInitialBookForPublish(book);
    setActionMode('publish');
    setIsBookActionOpen(true);
  };

  // Show match details
  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  // Publish a book
  const handlePublishBook = async (bookData) => {
    try {
      setError(null);
      await booksApi.publishBook({
        bookId: bookData.bookId,
        title: bookData.title,
        courseNumber: bookData.courseNumber,
        coverImage: bookData.coverImage
      });
      handleModalClose(true);
    } catch (error) {
      console.error('Error publishing book:', error);
      setError('Failed to publish book. Try again.');
    }
  };

  // Request a book
  const handleRequestBook = async (requestData) => {
    try {
      setError(null);
      await booksApi.requestBook(requestData);
      handleModalClose(true);
    } catch (error) {
      console.error('Error requesting book:', error);
      setError('Failed to request book. Try again.');
    }
  };

  // Update match status (confirm, cancel, complete)
  const handleMatchUpdate = async (matchId, action) => {
    setError(null);
    setLoading(true);
    try {
      if (action === 'confirm') await matchesApi.confirmMatch(matchId);
      else if (action === 'cancel') await matchesApi.cancelMatch(matchId);
      else if (action === 'complete') await matchesApi.completeMatch(matchId);
      else throw new Error(`Unknown action: ${action}`);
      await fetchDashboardData();
      handleModalClose();
    } catch (error) {
      // After error, check if the match is actually completed
      try {
        const updatedMatches = await matchesApi.getUserMatches(userId);
        const updatedMatch = updatedMatches.find(m => m.id === matchId);
        if (updatedMatch && updatedMatch.status === 'COMPLETED') {
          await fetchDashboardData();
          handleModalClose();
          setError(null);
        } else {
          setError(`Failed to ${action} match. Try again.`);
        }
      } catch (e) {
        setError(`Failed to ${action} match. Try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show a loading spinner while data loads
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-radial">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
// Formats dates to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};
  
  // Turn status like "NEW" into "New"
  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-radial pb-16">
      {/* Floating shapes in the background */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Sticky user header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={springTransition}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <span className="text-white text-xl sm:text-2xl font-bold">
                  {user?.fullName?.[0]?.toUpperCase() || '?'}
                </span>
              </motion.div>
              <div className="min-w-0">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, ...springTransition }}
                  className="text-xl sm:text-2xl font-bold text-gray-900 truncate"
                >
                  Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
                </motion.h1>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={gentleSpring}
                onClick={openPublishModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
              >
                <HiUpload className="-ml-1 w-5 h-5 mr-2" aria-hidden="true" /> Publish Book
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={gentleSpring}
                onClick={openRequestModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
              >
                <HiDocumentAdd className="-ml-1 h-5 w-5 mr-2" aria-hidden="true" /> Request Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Error popup */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="dashboard-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center shadow-sm text-red-700"
              role="alert"
            >
              <HiXCircle className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <HiX className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Your Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="glass-effect hover-lift rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Matches
              </h2>
              <span className="text-sm text-gray-500">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {matches.length > 0 ? (
                <AnimatePresence initial={false}>
                  {matches.filter(m => m.status === 'NEW').map((match) => (
                    <motion.div
                      key={match.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      onClick={() => handleViewMatch(match)}
                      role="button" tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewMatch(match)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-800 truncate">{match.book?.title || 'Unknown Book'}</h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                          {formatStatus(match.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                        <span>Status updated: {formatDate(match.lastUpdated || Date.now())}</span>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(match);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgb(238, 242, 255)',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            mass: 0.5
                          }}
                          className={`
                            inline-flex items-center px-4 py-2 
                            text-sm font-medium rounded-lg
                            transition-all duration-200 ease-in-out
                            ${match.status === 'NEW' ? 
                              'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500' :
                              match.status === 'PENDING' ? 
                              'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' :
                              match.status === 'COMPLETED' ? 
                              'text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500' :
                              match.status === 'CANCELLED' ? 
                              'text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500' :
                              'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            group relative overflow-hidden
                          `}
                          aria-label={`View details for ${match.book?.title || 'book match'}`}
                        >
                          <span className="relative z-10 flex items-center">
                            <HiArrowRight 
                              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ease-in-out group-hover:translate-x-0.5
                                ${match.status === 'NEW' ? 'text-indigo-600' :
                                  match.status === 'PENDING' ? 'text-yellow-600' :
                                  match.status === 'COMPLETED' ? 'text-green-600' :
                                  match.status === 'CANCELLED' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}
                            />
                            <span className="relative">View Details</span>
                          </span>
                          <motion.span
                            className="absolute inset-0 transform origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                            }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {matches.filter(m => m.status === 'PENDING').map((match) => (
                    <motion.div
                      key={match.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      onClick={() => handleViewMatch(match)}
                      role="button" tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewMatch(match)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-800 truncate">{match.book?.title || 'Unknown Book'}</h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                          {formatStatus(match.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                        <span>Status updated: {formatDate(match.lastUpdated || Date.now())}</span>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(match);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgb(238, 242, 255)',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            mass: 0.5
                          }}
                          className={`
                            inline-flex items-center px-4 py-2 
                            text-sm font-medium rounded-lg
                            transition-all duration-200 ease-in-out
                            ${match.status === 'NEW' ? 
                              'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500' :
                              match.status === 'PENDING' ? 
                              'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' :
                              match.status === 'COMPLETED' ? 
                              'text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500' :
                              match.status === 'CANCELLED' ? 
                              'text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500' :
                              'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            group relative overflow-hidden
                          `}
                          aria-label={`View details for ${match.book?.title || 'book match'}`}
                        >
                          <span className="relative z-10 flex items-center">
                            <HiArrowRight 
                              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ease-in-out group-hover:translate-x-0.5
                                ${match.status === 'NEW' ? 'text-indigo-600' :
                                  match.status === 'PENDING' ? 'text-yellow-600' :
                                  match.status === 'COMPLETED' ? 'text-green-600' :
                                  match.status === 'CANCELLED' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}
                            />
                            <span className="relative">View Details</span>
                          </span>
                          <motion.span
                            className="absolute inset-0 transform origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                            }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {matches.filter(m => m.status === 'COMPLETED').map((match) => (
                    <motion.div
                      key={match.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      onClick={() => handleViewMatch(match)}
                      role="button" tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewMatch(match)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-800 truncate">{match.book?.title || 'Unknown Book'}</h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                          {formatStatus(match.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                        <span>Status updated: {formatDate(match.lastUpdated || Date.now())}</span>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(match);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgb(238, 242, 255)',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            mass: 0.5
                          }}
                          className={`
                            inline-flex items-center px-4 py-2 
                            text-sm font-medium rounded-lg
                            transition-all duration-200 ease-in-out
                            ${match.status === 'NEW' ? 
                              'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500' :
                              match.status === 'PENDING' ? 
                              'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' :
                              match.status === 'COMPLETED' ? 
                              'text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500' :
                              match.status === 'CANCELLED' ? 
                              'text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500' :
                              'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            group relative overflow-hidden
                          `}
                          aria-label={`View details for ${match.book?.title || 'book match'}`}
                        >
                          <span className="relative z-10 flex items-center">
                            <HiArrowRight 
                              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ease-in-out group-hover:translate-x-0.5
                                ${match.status === 'NEW' ? 'text-indigo-600' :
                                  match.status === 'PENDING' ? 'text-yellow-600' :
                                  match.status === 'COMPLETED' ? 'text-green-600' :
                                  match.status === 'CANCELLED' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}
                            />
                            <span className="relative">View Details</span>
                          </span>
                          <motion.span
                            className="absolute inset-0 transform origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                            }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {matches.filter(m => m.status === 'CANCELLED').map((match) => (
                    <motion.div
                      key={match.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      onClick={() => handleViewMatch(match)}
                      role="button" tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewMatch(match)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-800 truncate">{match.book?.title || 'Unknown Book'}</h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                          {formatStatus(match.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                        <span>Status updated: {formatDate(match.lastUpdated || Date.now())}</span>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(match);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgb(238, 242, 255)',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            mass: 0.5
                          }}
                          className={`
                            inline-flex items-center px-4 py-2 
                            text-sm font-medium rounded-lg
                            transition-all duration-200 ease-in-out
                            ${match.status === 'NEW' ? 
                              'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500' :
                              match.status === 'PENDING' ? 
                              'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' :
                              match.status === 'COMPLETED' ? 
                              'text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500' :
                              match.status === 'CANCELLED' ? 
                              'text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500' :
                              'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            group relative overflow-hidden
                          `}
                          aria-label={`View details for ${match.book?.title || 'book match'}`}
                        >
                          <span className="relative z-10 flex items-center">
                            <HiArrowRight 
                              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ease-in-out group-hover:translate-x-0.5
                                ${match.status === 'NEW' ? 'text-indigo-600' :
                                  match.status === 'PENDING' ? 'text-yellow-600' :
                                  match.status === 'COMPLETED' ? 'text-green-600' :
                                  match.status === 'CANCELLED' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}
                            />
                            <span className="relative">View Details</span>
                          </span>
                          <motion.span
                            className="absolute inset-0 transform origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                            }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {matches.filter(m => m.status === 'EXPIRED').map((match) => (
                    <motion.div
                      key={match.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      onClick={() => handleViewMatch(match)}
                      role="button" tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewMatch(match)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-gray-800 truncate">{match.book?.title || 'Unknown Book'}</h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                          {formatStatus(match.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                        <span>Status updated: {formatDate(match.lastUpdated || Date.now())}</span>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(match);
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgb(238, 242, 255)',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            mass: 0.5
                          }}
                          className={`
                            inline-flex items-center px-4 py-2 
                            text-sm font-medium rounded-lg
                            transition-all duration-200 ease-in-out
                            ${match.status === 'NEW' ? 
                              'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500' :
                              match.status === 'PENDING' ? 
                              'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' :
                              match.status === 'COMPLETED' ? 
                              'text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500' :
                              match.status === 'CANCELLED' ? 
                              'text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500' :
                              'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            group relative overflow-hidden
                          `}
                          aria-label={`View details for ${match.book?.title || 'book match'}`}
                        >
                          <span className="relative z-10 flex items-center">
                            <HiArrowRight 
                              className={`mr-2 h-4 w-4 transform transition-transform duration-200 ease-in-out group-hover:translate-x-0.5
                                ${match.status === 'NEW' ? 'text-indigo-600' :
                                  match.status === 'PENDING' ? 'text-yellow-600' :
                                  match.status === 'COMPLETED' ? 'text-green-600' :
                                  match.status === 'CANCELLED' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}
                            />
                            <span className="relative">View Details</span>
                          </span>
                          <motion.span
                            className="absolute inset-0 transform origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                            }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your book matches will appear here.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Most Wanted Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="glass-effect hover-lift rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Most Wanted Books
              </h2>
              <span className="text-sm text-gray-500">{mostWantedBooks.length} book{mostWantedBooks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {mostWantedBooks.length > 0 ? (
                <AnimatePresence initial={false}>
                  {mostWantedBooks.map((book) => (
                    <motion.div
                      key={book.id} layout initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={springTransition}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200"
                    >
                      <BookCard
                        book={book}
                        showRequestButton={false}
                        actionButton={
                          <motion.button
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
                            }} 
                            whileTap={{ scale: 0.98 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 15, 
                              mass: 0.8 
                            }}
                            onClick={() => handleInitiatePublish(book)}
                            className="w-full relative group overflow-hidden inline-flex justify-center items-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all duration-200 ease-in-out shadow-sm"
                          >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200 ease-in-out" />
                            <span className="relative flex items-center">
                              <HiSparkles className="w-4 h-4 mr-1.5 animate-pulse" aria-hidden="true" />
                              <span className="mr-1">I have this!</span>
                              <HiCheck className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200 ease-in-out" />
                            </span>
                            <motion.span
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <HiOutlineBookOpen className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No highly requested books</h3>
                  <p className="mt-1 text-sm text-gray-500">Most wanted books by others will show here.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isBookActionOpen && (
          <BookActionModal
            key="book-action-modal"
            isOpen={isBookActionOpen}
            mode={actionMode}
            initialBookData={initialBookForPublish}
            onSubmit={actionMode === 'publish' ? handlePublishBook : handleRequestBook}
            onClose={() => handleModalClose()}
          />
        )}
        {showMatchModal && selectedMatch && (
          <MatchNotificationModal
            key={`match-modal-${selectedMatch.id}`}
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