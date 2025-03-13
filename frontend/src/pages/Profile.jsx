import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import RequestedBookCard from '../components/RequestedBookCard';
import EditProfileModal from '../modals/EditProfileModal';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { matchesApi } from '../api/matches';
import { getUserIdFromToken } from '../api/apiUtils';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the user ID from the JWT token
  const userId = getUserIdFromToken();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user profile data
      const userData = await usersApi.getUserProfile(userId);
      setUser(userData);
      
      // Get user's published books
      const userPublications = await matchesApi.getUserPublications(userId);
      setPublishedBooks(userPublications || []);
      
      // Get user's requested books
      const userRequests = await matchesApi.getUserRequests(userId);
      setRequestedBooks(userRequests || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
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

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.fullName ? user.fullName.charAt(0) : '?'}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.preferredExchangeLocation && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-block mr-1">📍</span> 
                  {user.preferredExchangeLocation}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Action Buttons - Mobile Only */}
      <div className="sm:hidden flex space-x-2 mb-6">
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Publish Book
        </button>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          Request Book
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Published Books Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              My Published Books
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                {publishedBooks.length} books
              </span>
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publish
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {publishedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Ready to share your knowledge?</p>
                <button 
                  onClick={() => setIsPublishModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Publish your first book
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {publishedBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    showRequestButton={false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Requested Books Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              My Requested Books
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                {requestedBooks.length} books
              </span>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Request
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {requestedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Looking for study materials?</p>
                <button 
                  onClick={() => setIsRequestModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Request your first book
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {requestedBooks.map(book => (
                  <RequestedBookCard
                    key={book.id}
                    book={book}
                    requestDate={book.requestDate}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateProfile}
        user={user}
      />

      {/* Publish Book Modal */}
      <PublishBookModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishBook}
      />

      {/* Request Book Modal */}
      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={handleRequestBook}
      />
    </div>
  );
};

export default Profile;
