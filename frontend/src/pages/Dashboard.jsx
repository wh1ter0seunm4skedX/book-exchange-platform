import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import icons from react-icons
import {
  HiPlus,                // Used in header and action button
  HiXCircle,             // For error message
  HiClock,               // For match item timestamp/status
  HiOutlineDocumentText, // For empty matches state
  HiOutlineBookOpen      // For empty wanted books state
// Assuming HiXCircle, HiClock, HiOutlineDocumentText, HiOutlineBookOpen are needed from 'hi'
// If BookActionModal uses icons from hi2, ensure those are imported there or here if passed as props.
} from 'react-icons/hi';

// Import Components and Modals
import BookCard from '../components/BookCard';
import BookActionModal from '../modals/BookActionModal'; // Using the consolidated modal
import MatchNotificationModal from '../modals/MatchNotificationModal';

// Import API functions and utils
import { matchesApi } from '../api/matches';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { getCurrentUserId } from '../api/apiUtils';
import { useNavigate } from 'react-router-dom';

// Animation Constants
const springTransition = { type: "spring", stiffness: 300, damping: 20 };
const gentleSpring = { type: "spring", stiffness: 200, damping: 25, mass: 1.2 };

const Dashboard = () => {
  // State declarations
  const [matches, setMatches] = useState([]);
  const [mostWantedBooks, setMostWantedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the consolidated BookActionModal
  const [isBookActionOpen, setIsBookActionOpen] = useState(false);
  const [actionMode, setActionMode] = useState(null); // 'publish' or 'request'

  // State for Match Modal
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // State for passing initial data to publish mode
  const [initialBookForPublish, setInitialBookForPublish] = useState(null);

  const navigate = useNavigate(); // Keep if used for navigation actions later
  const userId = getCurrentUserId(); // Assuming this reliably gets the user ID

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty dependency array means run once on mount

  // Auto display NEW matches when they're loaded
  useEffect(() => {
    if (matches && matches.length > 0) {
      // Find the first match with NEW status, if any
      const newMatch = matches.find(match => match.status === 'NEW');
      if (newMatch) {
        setSelectedMatch(newMatch);
        setShowMatchModal(true);
      }
    }
  }, [matches]);

  // --- Data Fetching ---
  const fetchDashboardData = async () => {
    setError(null); // Reset error before fetching
    setLoading(true);
    try {
      // Fetch user profile
      try {
        const userData = await usersApi.getUserProfile(userId);
        setUser(userData);
      } catch (userError) {
        console.error('Error fetching user profile:', userError);
        setUser({ fullName: 'User', email: 'Profile loading error' }); // Provide fallback
      }

      // Fetch matches and wanted books in parallel
      const [userMatches, wantedBooks] = await Promise.all([
        matchesApi.getUserMatches(userId).catch(err => { console.error('Error fetching user matches:', err); return []; }),
        booksApi.getMostWantedBooks().catch(err => { console.error('Error fetching most wanted books:', err); return []; })
      ]);

      setMatches(userMatches || []);
      setMostWantedBooks(Array.isArray(wantedBooks) ? wantedBooks.slice(0, 5) : []); // Show top 5

    } catch (error) { // Catch unexpected errors during Promise.all or setup
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load some dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Control ---
  const openPublishModal = () => {
    setInitialBookForPublish(null); // Clear any previous initial book
    setActionMode('publish');
    setIsBookActionOpen(true);
  };

  const openRequestModal = () => {
    setInitialBookForPublish(null); // Ensure no initial book for request mode
    setActionMode('request');
    setIsBookActionOpen(true);
  };

  // Consolidated close handler for all modals triggered from Dashboard
  const handleModalClose = (refreshData = false) => {
    setIsBookActionOpen(false); // Close the BookActionModal
    setShowMatchModal(false);   // Close the MatchModal
    setActionMode(null);        // Reset mode
    setSelectedMatch(null);     // Clear selected match
    setInitialBookForPublish(null); // Clear initial book data

    if (refreshData) {
      fetchDashboardData(); // Refetch data if needed (e.g., after publish/request)
    }
  };

  // Handler for "I have this!" button in Most Wanted section
  const handleInitiatePublish = (book) => {
    setInitialBookForPublish(book); // Set the book to pre-fill in the modal
    setActionMode('publish');       // Set the mode to publish
    setIsBookActionOpen(true);      // Open the modal
  };

  // Handler to open the match details modal
  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  // --- Action Handlers (Called by Modals) ---
  const handlePublishBook = async (bookData) => {
    // Assuming bookData contains { bookId, title, courseNumber, coverImage } from BookActionModal
    try {
      setError(null); // Clear previous errors
      await booksApi.publishBook({
        bookId: bookData.bookId,
        title: bookData.title,
        courseNumber: bookData.courseNumber,
        coverImage: bookData.coverImage // Ensure your API uses/needs this
      });
      handleModalClose(true); // Close modal and refresh dashboard data
    } catch (error) {
      console.error('Error publishing book:', error);
      setError('Failed to publish book. Please try again.');
      // Consider keeping modal open by not calling handleModalClose here on error
    }
    // Note: Loading state during publish might be handled within BookActionModal
  };

  const handleRequestBook = async (requestData) => {
    // Assuming requestData contains { bookId, title, courseNumber, urgency, notes } from BookActionModal
    try {
      setError(null); // Clear previous errors
       await booksApi.requestBook(requestData); // Ensure API function matches
       handleModalClose(true); // Close modal and refresh dashboard data
    } catch (error) {
      console.error('Error requesting book:', error);
      setError('Failed to request book. Please try again.');
      // Consider keeping modal open by not calling handleModalClose here on error
    }
     // Note: Loading state during request might be handled within BookActionModal
  };

  const handleMatchUpdate = async (matchId, action) => {
    setError(null);
    setLoading(true);
    try {
      // Execute the appropriate API call based on the action
      if (action === 'confirm') {
        await matchesApi.confirmMatch(matchId);
      } else if (action === 'cancel') {
        await matchesApi.cancelMatch(matchId);
      } else if (action === 'complete') {
        await matchesApi.completeMatch(matchId);
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
      
      // Refresh data after successful update
      await fetchDashboardData();
      
      // Show success message (optional)
      // setSuccessMessage(`Match ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing match:`, error);
      setError(`Failed to ${action} match. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to format status from uppercase to title case
  const formatStatus = (status) => {
    if (!status) return '';
    // Convert status like "NEW" to "New"
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 pb-16">
      {/* Sticky Header Section within Dashboard */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-16 z-40"> {/* Adjust top offset based on main App Header height */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* User Info */}
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
            {/* Header Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={gentleSpring}
                onClick={openPublishModal} // Use correct handler
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
              >
                <HiPlus className="-ml-1 w-5 h-5 mr-2" aria-hidden="true" /> Publish
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={gentleSpring}
                onClick={openRequestModal} // Use correct handler
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
              >
                <HiPlus className="-ml-1 h-5 w-5 mr-2" aria-hidden="true" /> Request
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display Area */}
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
                 <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700" aria-label="Dismiss error">
                    <HiXMark className="h-5 w-5" />
                 </button>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Grid Layout for Matches and Wanted Books */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Matches Section */}
          <motion.div
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springTransition}
             className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Matches
              </h2>
              <span className="text-sm text-gray-500">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
            </div>
            {/* Matches List */}
            <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Ensure custom-scrollbar class is needed/styled globally */}
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${ match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                            {formatStatus(match.status)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                          <span>Status updated: {new Date(match.lastUpdated || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewMatch(match)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            View Details
                          </button>
                          {match.status === 'NEW' && (
                            <button
                              type="button"
                              onClick={() => handleMatchUpdate(match.id, 'confirm')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-150"
                            >
                              Confirm
                            </button>
                          )}
                          {match.status === 'NEW' && (
                            <button
                              type="button"
                              onClick={() => handleMatchUpdate(match.id, 'cancel')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-150"
                            >
                              Cancel
                            </button>
                          )}
                          {match.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => handleMatchUpdate(match.id, 'complete')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-150"
                            >
                              Complete
                            </button>
                          )}
                          {match.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => handleMatchUpdate(match.id, 'cancel')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-150"
                            >
                              Cancel
                            </button>
                          )}
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${ match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                            {formatStatus(match.status)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                          <span>Status updated: {new Date(match.lastUpdated || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewMatch(match)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMatchUpdate(match.id, 'complete')}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-150"
                          >
                            Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMatchUpdate(match.id, 'cancel')}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-150"
                          >
                            Cancel
                          </button>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${ match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                            {formatStatus(match.status)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                          <span>Status updated: {new Date(match.lastUpdated || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewMatch(match)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            View Details
                          </button>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${ match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                            {formatStatus(match.status)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                          <span>Status updated: {new Date(match.lastUpdated || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewMatch(match)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            View Details
                          </button>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${ match.status === 'NEW' ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200' : match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' : match.status === 'COMPLETED' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : match.status === 'CANCELLED' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'}`}>
                            {formatStatus(match.status)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <HiClock className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                          <span>Status updated: {new Date(match.lastUpdated || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewMatch(match)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150"
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              ) : (
                 // Empty State for Matches
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your book matches will appear here.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Most Wanted Books Section */}
          <motion.div
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springTransition}
             className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Most Wanted Books
              </h2>
              <span className="text-sm text-gray-500">{mostWantedBooks.length} book{mostWantedBooks.length !== 1 ? 's' : ''}</span>
            </div>
            {/* Most Wanted List */}
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
                          showRequestButton={false} // Don't show default request button here
                          // Pass the enhanced "I have this!" button
                          actionButton={
                            <motion.button
                              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => handleInitiatePublish(book)} // Use correct handler
                              className="w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-colors duration-150 ease-in-out shadow-sm"
                            >
                              <HiPlus className="w-4 h-4 mr-1.5" aria-hidden="true" /> I have this!
                            </motion.button>
                          }
                          // Optional: Display request count if available
                          // requestCount={book.requestCount}
                        />
                      </motion.div>
                    ))}
                 </AnimatePresence>
              ) : (
                // Empty State for Most Wanted
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

      {/* Modal Rendering Area */}
      <AnimatePresence>
         {/* Render BookActionModal */}
        {isBookActionOpen && (
          <BookActionModal
            key="book-action-modal" // Consistent key
            isOpen={isBookActionOpen}
            mode={actionMode} // 'publish' or 'request'
            initialBookData={initialBookForPublish} // Data for pre-filling publish
            // Pass appropriate submit handler based on mode
            onSubmit={actionMode === 'publish' ? handlePublishBook : handleRequestBook}
            onClose={() => handleModalClose()} // Use the consolidated close handler
          />
        )}

         {/* Render MatchNotificationModal */}
        {showMatchModal && selectedMatch && (
          <MatchNotificationModal
            key={`match-modal-${selectedMatch.id}`}
            isOpen={showMatchModal}
            onClose={() => handleModalClose()} // Use the consolidated close handler
            match={selectedMatch}
            onMatchUpdate={handleMatchUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;