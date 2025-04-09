import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiUpload,
  HiDocumentAdd,
  HiPhone, 
  HiLocationMarker, 
  HiPencil, 
  HiOutlineDocumentText, 
  HiTrash,             
  HiOutlineBookOpen,   
  HiX
} from 'react-icons/hi'; 

import BookCard from '../components/BookCard';
import EditProfileModal from '../modals/EditProfileModal';
import BookActionModal from '../modals/BookActionModal';
import { matchesApi } from '../api/matches';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { getCurrentUserId } from '../api/apiUtils';

const gentleSpring = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1.2
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookActionOpen, setIsBookActionOpen] = useState(false);
  const [actionMode, setActionMode] = useState('publish');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = getCurrentUserId();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userData = await usersApi.getUserProfile(userId);
      setUser(userData);
      
      const publicationsResponse = await matchesApi.getUserPublications(userId);
      const requestsResponse = await matchesApi.getUserRequests(userId);
      
      // Sort publications: available first, then matched
      const sortedPublications = publicationsResponse.sort((a, b) => {
        const aIsMatched = a.status?.toUpperCase() === 'MATCHED';
        const bIsMatched = b.status?.toUpperCase() === 'MATCHED';
        return aIsMatched - bIsMatched; // false (0) comes before true (1)
      });
      
      // Sort requests: available first, then matched
      const sortedRequests = requestsResponse.sort((a, b) => {
        const aIsMatched = a.status?.toUpperCase() === 'MATCHED';
        const bIsMatched = b.status?.toUpperCase() === 'MATCHED';
        return aIsMatched - bIsMatched; // false (0) comes before true (1)
      });
      
      setPublishedBooks(sortedPublications);
      setRequestedBooks(sortedRequests);
    } catch (error) {
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (userData) => {
    try {
      // Start with user ID and data from the modal *except* password
      const { password, ...otherUserData } = userData; 
      const payload = {
        ...otherUserData,
        id: userId, 
      };

      // Only add the password to the payload if it was provided by the modal
      if (password !== undefined && password !== null && password !== '') {
        payload.password = password;
      } else {
        // Explicitly set password to null if not provided, so the backend will take a nice care of it :)
        payload.password = null;
      }

      const updatedUser = await usersApi.updateUserProfile(payload);
      
      // Update local state *without* the password hash
      const { password: _, ...userToSet } = updatedUser;
      setUser(userToSet);
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await booksApi.publishBook({
        bookId: bookData.bookId,
        title: bookData.title,
        courseNumber: bookData.courseNumber,
        coverImage: bookData.coverImage
      });
      fetchProfileData(); 
      setIsBookActionOpen(false);
    } catch (error) {
      console.error('Error publishing book:', error);
    }
  };

  const handleRequestBook = async (bookData) => {
    try {
      await matchesApi.addBookRequest(bookData, userId);
      fetchProfileData(); 
      setIsBookActionOpen(false);
    } catch (error) {
      console.error('Error requesting book:', error);
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      // Check if the request is matched based on status instead of matchId
      if (request.status?.toUpperCase() === 'MATCHED') {
        // Show an error message that matched books cannot be removed
        alert("This book request cannot be canceled because it's already matched with another user.");
        return;
      }
      
      if (window.confirm(`Are you sure you want to cancel your request for "${request.book.title}"?`)) {
        await matchesApi.deleteUserRequest(request.id); 
        fetchProfileData(); 
      }
    } catch (error) {
      console.error('Error removing book request:', error);
    }
  };

  const handleRemovePublication = async (publication) => {
     try {
      // Check if the publication is matched based on status instead of matchId
      if (publication.status?.toUpperCase() === 'MATCHED') {
        // Show an error message that matched books cannot be removed
        alert("This book publication cannot be removed because it's already matched with another user.");
        return;
      }
      
      if (window.confirm(`Are you sure you want to remove the publication "${publication.book.title}"?`)) { 
        await matchesApi.deleteUserPublication(publication.id); 
        fetchProfileData(); 
      }
    } catch (error) {
      console.error('Error removing book publication:', error);
    }
  };

  const openPublishModal = () => {
    setActionMode('publish');
    setIsBookActionOpen(true);
  };

  const openRequestModal = () => {
    setActionMode('request');
    setIsBookActionOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
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
    return <div className="flex items-center justify-center min-h-screen text-gray-500">User data could not be loaded.</div>; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <div className="animated-gradient-background"></div>
      <div className="radial-overlay"></div>
      <div className="floating-shapes-container">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* User Info and Edit Button */}
            <div className="flex items-center space-x-4 flex-grow">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={gentleSpring}
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <span className="text-white text-2xl font-bold">
                  {user?.fullName?.[0]?.toUpperCase() || '?'} 
                </span>
              </motion.div>
              <div className="flex-1 min-w-0"> 
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...gentleSpring, delay: 0.1 }}
                  className="text-2xl font-bold text-gray-900 truncate" 
                >
                  {user?.fullName}
                </motion.h1>
                <p className="text-gray-600 truncate">{user?.email}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  {user?.phoneNumber && (
                    <span className="flex items-center">
                      <HiPhone className="h-4 w-4 mr-1 flex-shrink-0" /> 
                      {user.phoneNumber}
                    </span>
                  )}
                  {user?.preferredExchangeLocation && (
                    <span className="flex items-center">
                      <HiLocationMarker className="h-4 w-4 mr-1 flex-shrink-0" />
                      {user.preferredExchangeLocation}
                    </span>
                  )}
                </div>
              </div>
              {/* Edit Profile Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={gentleSpring}
                onClick={() => setIsEditModalOpen(true)}
                className="ml-auto sm:ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md"
              >
                <HiPencil className="h-4 w-4 mr-1" aria-hidden="true" /> 
                Edit Profile
              </motion.button>
            </div>
            
            {/* Publish and Request Buttons */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={gentleSpring}
                onClick={openPublishModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <HiUpload className="w-5 h-5 mr-2" aria-hidden="true" />
                Publish Book
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={gentleSpring}
                onClick={openRequestModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <HiDocumentAdd className="h-5 w-5 mr-2" aria-hidden="true" />
                Request Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Published Books Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...gentleSpring, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Published Books
              </h2>
              <span className="text-sm text-gray-500">{publishedBooks.length} book{publishedBooks.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {publishedBooks.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No published books</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by publishing your first book.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={gentleSpring}
                    onClick={openPublishModal}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <HiUpload className="h-4 w-4 mr-1" aria-hidden="true" />
                    Publish Book
                  </motion.button>
                </div>
              ) : (
                publishedBooks.map(publication => {
                  // Check if the publication is matched based on status instead of matchId
                  const isMatched = publication.status?.toUpperCase() === 'MATCHED';
                  
                  return (
                    <motion.div
                      key={publication.id}
                      layout 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={gentleSpring}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:border-gray-200 hover:shadow-md"
                    >
                      <BookCard
                        book={publication.book}
                        status={publication.status}
                        date={publication.publicationDate}
                        isMatched={isMatched}
                        actionButton={
                          isMatched ? (
                            // Disabled button for matched publications
                            <button
                              disabled
                              className="w-full text-sm text-gray-400 flex items-center justify-center py-2 focus:outline-none cursor-not-allowed bg-gray-50"
                            >
                              <HiX className="h-4 w-4 mr-1" aria-hidden="true" />
                              Cannot Remove Matched Book
                            </button>
                          ) : (
                            // Regular remove button for non-matched publications
                            <motion.button
                              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleRemovePublication(publication)}
                              className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                            >
                              <HiTrash className="h-4 w-4 mr-1" aria-hidden="true" />
                              Remove Publication
                            </motion.button>
                          )
                        }
                      />
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Requested Books Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...gentleSpring, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Requested Books
              </h2>
              <span className="text-sm text-gray-500">{requestedBooks.length} book{requestedBooks.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {requestedBooks.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <HiOutlineBookOpen className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No requested books</h3>
                  <p className="mt-1 text-sm text-gray-500">Search for a book to request it.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={gentleSpring}
                    onClick={openRequestModal}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <HiDocumentAdd className="h-4 w-4 mr-1" aria-hidden="true" />
                    Request Book
                  </motion.button>
                </div>
              ) : (
                 <AnimatePresence initial={false}>
                   {requestedBooks.map(request => {
                     // Check if the request is matched based on status instead of matchId
                     const isMatched = request.status?.toUpperCase() === 'MATCHED';
                     
                     return (
                       <motion.div
                         key={request.id}
                         layout
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         transition={gentleSpring}
                         className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:border-gray-200 hover:shadow-md"
                       >
                         <BookCard
                           book={request.book}
                           isRequested={true}
                           requestDate={request.requestDate}
                           status={request.status}
                           isMatched={isMatched}
                           onCancelRequest={
                             isMatched 
                               ? () => {
                                   alert("This book request cannot be canceled because it's already matched with another user.");
                                 }
                               : () => handleRemoveRequest(request)
                           }
                         />
                       </motion.div>
                     );
                   })}
                 </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            key="edit-profile-modal"
            isOpen={isEditModalOpen}
            user={user}
            onSave={handleUpdateProfile}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        
        {isBookActionOpen && (
          <BookActionModal
            key={`book-action-${actionMode}`}
            isOpen={isBookActionOpen}
            mode={actionMode}
            onSubmit={actionMode === 'publish' ? handlePublishBook : handleRequestBook}
            onClose={() => setIsBookActionOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;