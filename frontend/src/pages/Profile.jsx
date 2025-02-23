import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import RequestedBookCard from '../components/RequestedBookCard';
import EditProfileModal from '../modals/EditProfileModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { mockUsers } from '../mockData';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, we'll use the first user from mockUsers
  const userId = mockUsers[0].id;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userData, userPublished, userRequests] = await Promise.all([
        usersApi.getUserProfile(userId),
        booksApi.getUserPublishedBooks(userId),
        booksApi.getUserRequestedBooks(userId)
      ]);

      setUser(userData);
      setPublishedBooks(userPublished);
      setRequestedBooks(userRequests);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (userData) => {
    try {
      const updatedUser = await usersApi.updateUserProfile(userId, userData);
      setUser(updatedUser);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Published Books Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              My Published Books
            </h2>
            <span className="text-sm text-gray-500">
              {publishedBooks.length} books
            </span>
          </div>
          <div className="space-y-4">
            {publishedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Ready to share your knowledge?</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  + Publish your first book
                </button>
              </div>
            ) : (
              publishedBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  showRequestButton={false}
                />
              ))
            )}
          </div>
        </section>

        {/* Requested Books Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              My Requested Books
            </h2>
            <span className="text-sm text-gray-500">
              {requestedBooks.length} books
            </span>
          </div>
          <div className="space-y-4">
            {requestedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Looking for study materials?</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  + Request your first book
                </button>
              </div>
            ) : (
              requestedBooks.map(book => (
                <RequestedBookCard
                  key={book.id}
                  book={book}
                  requestDate={book.requestDate}
                />
              ))
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
    </div>
  );
};

export default Profile;
