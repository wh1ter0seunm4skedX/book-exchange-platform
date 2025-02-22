import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import EditProfileModal from '../modals/EditProfileModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user ID - in a real app, this would come from auth context
  const userId = '1';

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userData, ownedBooks, userRequests] = await Promise.all([
        usersApi.getUserProfile(userId),
        booksApi.getUserBooks(userId),
        booksApi.getRequestedBooks(userId)
      ]);

      setUser(userData);
      setUserBooks(ownedBooks);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            {user.phone && (
              <p className="mt-1 text-sm text-gray-500">{user.phone}</p>
            )}
            {user.bio && (
              <p className="mt-4 text-gray-700">{user.bio}</p>
            )}
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-gray-50 px-4 py-5 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Books Owned</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {userBooks.length}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Books Requested</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {requestedBooks.length}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Active Exchanges</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {requestedBooks.filter(book => !book.available).length}
            </dd>
          </div>
        </div>
      </div>

      {/* Your Books Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Published Books</h2>
        {userBooks.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't published any books yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                showRequestButton={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Requested Books Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Requested Books</h2>
        {requestedBooks.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't requested any books yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requestedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                showRequestButton={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
