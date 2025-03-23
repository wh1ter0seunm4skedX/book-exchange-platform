import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../components/BookCard';
import RequestedBookCard from '../components/RequestedBookCard';
import EditProfileModal from '../modals/EditProfileModal';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { matchesApi } from '../api/matches';
import { getCurrentUserId } from '../api/apiUtils';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('published');

  // Get the user ID from the JWT token
  const userId = getCurrentUserId();

  useEffect(() => {
    console.log('Profile component mounted');
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching profile data for user:', userId);
      
      // Get user profile data
      const userData = await usersApi.getUserProfile(userId);
      console.log('User data received:', userData);
      setUser(userData);
      
      // Get user's published books
      try {
        const userPublications = await matchesApi.getUserPublications(userId);
        console.log('User publications:', userPublications);
        setPublishedBooks(userPublications || []);
      } catch (pubError) {
        console.error('Error fetching user publications:', pubError);
        setPublishedBooks([]);
      }
      
      // Get user's requested books
      try {
        const userRequests = await matchesApi.getUserRequests(userId);
        console.log('User requests:', userRequests);
        setRequestedBooks(userRequests || []);
      } catch (reqError) {
        console.error('Error fetching user requests:', reqError);
        setRequestedBooks([]);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
      console.log('Profile data loading completed');
    }
  };

  const handleUpdateProfile = async (userData) => {
    try {
      const updatedUser = await usersApi.updateUserProfile({
        ...userData,
        id: userId
      });
      setUser(updatedUser);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await matchesApi.publishBook(bookData, userId);
      fetchProfileData(); // Refresh data after publishing
      setIsPublishModalOpen(false);
    } catch (error) {
      console.error('Error publishing book:', error);
    }
  };

  const handleRequestBook = async (bookData) => {
    try {
      await matchesApi.addBookRequest(bookData, userId);
      fetchProfileData(); // Refresh data after requesting
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error('Error requesting book:', error);
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      await matchesApi.deleteRequest(request);
      fetchProfileData(); // Refresh data after removing request
    } catch (error) {
      console.error('Error removing book request:', error);
    }
  };

  const handleRemovePublication = async (publication) => {
    try {
      await matchesApi.deletePublication(publication);
      fetchProfileData(); // Refresh data after removing publication
    } catch (error) {
      console.error('Error removing book publication:', error);
    }
  };

  if (loading) {
    console.log('Profile is in loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.log('Profile has error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchProfileData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user data available');
    return null;
  }

  console.log('Rendering profile with user:', user);
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
                  {user?.fullName}
                </motion.h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  {user?.phoneNumber && (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user?.phoneNumber}
                    </span>
                  )}
                  {user?.preferredExchangeLocation && (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user?.preferredExchangeLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons - Mobile Only */}
        <div className="sm:hidden flex space-x-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPublishModalOpen(true)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-colors shadow-md"
          >
            Publish Book
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRequestModalOpen(true)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
          >
            Request Book
          </motion.button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Published Books Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Published Books
              </h2>
              <span className="text-sm text-gray-500">{publishedBooks.length} books</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {publishedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No published books</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by publishing your first book.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPublishModalOpen(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Publish Book
                  </motion.button>
                </div>
              ) : (
                publishedBooks.map(publication => (
                  <motion.div
                    key={publication.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <BookCard
                      book={publication.book}
                      showRequestButton={false}
                      status={publication.status}
                      date={publication.publicationDate}
                      actionButton={
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRemovePublication(publication)}
                          className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center py-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Publication
                        </motion.button>
                      }
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Requested Books Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Requested Books
              </h2>
              <span className="text-sm text-gray-500">{requestedBooks.length} books</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {requestedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No requested books</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by requesting your first book.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsRequestModalOpen(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request Book
                  </motion.button>
                </div>
              ) : (
                requestedBooks.map(request => (
                  <motion.div
                    key={request.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <RequestedBookCard
                      book={request.book}
                      requestDate={request.requestDate}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onUpdate={handleUpdateProfile}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        
        {isPublishModalOpen && (
          <PublishBookModal
            onClose={() => setIsPublishModalOpen(false)}
          />
        )}
        
        {isRequestModalOpen && (
          <RequestBookModal
            onClose={() => setIsRequestModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
