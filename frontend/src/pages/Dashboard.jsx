import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { matchesApi } from '../api/matches';
import { getUserIdFromToken } from '../api/apiUtils';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [mostWantedBooks, setMostWantedBooks] = useState([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get the user ID from the JWT token
  const userId = getUserIdFromToken();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userMatches, wantedBooks, userData] = await Promise.all([
        matchesApi.getUserMatches(userId),
        booksApi.getMostWantedBooks(),
        usersApi.getUserProfile(userId)
      ]);

      setMatches(userMatches || []);
      // Only show top 3 most requested books
      setMostWantedBooks(wantedBooks?.slice(0, 3) || []);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await matchesApi.publishBook({ ...bookData, userId });
      setIsPublishModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error publishing book:', error);
    }
  };

  const handleRequestBook = async (bookData) => {
    try {
      await matchesApi.requestBook({ ...bookData, userId });
      setIsRequestModalOpen(false);
      setSelectedBook(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error requesting book:', error);
    }
  };

  const handleIHaveThisBook = (book) => {
    setSelectedBook(book);
    setIsPublishModalOpen(true);
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      await matchesApi.acceptMatch(matchId);
      setIsMatchModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error accepting match:', error);
    }
  };

  const handleDeclineMatch = async (matchId) => {
    try {
      await matchesApi.declineMatch(matchId);
      setIsMatchModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error declining match:', error);
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          Welcome, {user?.fullName || 'User'}!
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 px-2">
          Find and exchange books with other students.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Publish a Book
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Request a Book
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Matches Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Your Matches
            </h2>
            <span className="text-sm text-gray-500">
              {matches.length} matches
            </span>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {matches.length === 0 ? (
              <div className="bg-white rounded-lg p-6 sm:p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No matches found yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Keep publishing and requesting books to find matches!
                </p>
              </div>
            ) : (
              matches.map(match => (
                <div key={match.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedMatch(match);
                    setIsMatchModalOpen(true);
                  }}>
                  <BookCard
                    book={match.book}
                    showRequestButton={false}
                    status={match.status}
                    date={match.createdAt}
                    actionButton={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatch(match);
                          setIsMatchModalOpen(true);
                        }}
                        className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded-md hover:border-blue-300 transition-colors"
                      >
                        View Match Details
                      </button>
                    }
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Most Wanted Books Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Most Wanted Books
            </h2>
            <span className="text-sm text-gray-500">
              {mostWantedBooks.length} books
            </span>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {mostWantedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-6 sm:p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No books in high demand at the moment.</p>
              </div>
            ) : (
              mostWantedBooks.map(book => (
                <div key={book.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      {book.requestCount} {book.requestCount === 1 ? 'student needs' : 'students need'} this book
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="sm:flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {book.author} • {book.year}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2">{book.subject}</span>
                        <span>{book.level}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleIHaveThisBook(book)}
                      className="w-full sm:w-auto whitespace-nowrap text-sm font-medium text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md transition-colors"
                    >
                      I Have This Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      <PublishBookModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setSelectedBook(null);
        }}
        onPublish={handlePublishBook}
        preselectedBook={selectedBook}
      />

      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={handleRequestBook}
      />

      <MatchNotificationModal
        isOpen={isMatchModalOpen}
        onClose={() => {
          setIsMatchModalOpen(false);
          setSelectedMatch(null);
        }}
        match={selectedMatch}
        onAccept={handleAcceptMatch}
        onDecline={handleDeclineMatch}
      />
    </div>
  );
};

export default Dashboard;
