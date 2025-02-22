import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user ID - in a real app, this would come from auth context
  const userId = '1';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allBooks, ownedBooks, userMatches] = await Promise.all([
        booksApi.getAllBooks(),
        booksApi.getUserBooks(userId),
        usersApi.getUserMatches(userId)
      ]);

      setBooks(allBooks.filter(book => book.owner.id !== userId));
      setUserBooks(ownedBooks);
      setMatches(userMatches);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await booksApi.publishBook({
        ...bookData,
        owner: { id: userId }
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error publishing book:', error);
    }
  };

  const handleRequestBook = async (bookId) => {
    try {
      const match = await booksApi.requestBook(bookId, userId);
      setSelectedMatch(match);
      setIsMatchModalOpen(true);
    } catch (error) {
      console.error('Error requesting book:', error);
    }
  };

  const handleMatchResponse = async (matchId, accepted) => {
    try {
      await usersApi.updateMatchStatus(matchId, accepted ? 'accepted' : 'declined');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating match status:', error);
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
            onClick={fetchDashboardData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard 🙃</h1>
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Publish Book
        </button>
      </div>

      {/* Your Books Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Books</h2>
        {userBooks.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't published any books yet.</p>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Publish Your First Book
            </button>
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

      {/* Available Books Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Books</h2>
        {books.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No books available for exchange at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onRequest={() => {
                  setSelectedBook(book);
                  setIsRequestModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <PublishBookModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishBook}
      />

      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        book={selectedBook}
        onConfirm={handleRequestBook}
      />

      <MatchNotificationModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        match={selectedMatch}
        book={selectedBook}
        onAccept={(matchId) => handleMatchResponse(matchId, true)}
        onDecline={(matchId) => handleMatchResponse(matchId, false)}
      />
    </div>
  );
};

export default Dashboard;
