import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { mockUsers } from '../mockData';

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

  // For demo purposes, we'll use the first user
  const userId = mockUsers[0].id;
  const userName = mockUsers[0].name;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userMatches, wantedBooks] = await Promise.all([
        usersApi.getUserMatches(userId),
        booksApi.getMostWantedBooks()
      ]);

      setMatches(userMatches);
      // Only show top 3 most requested books
      setMostWantedBooks(wantedBooks.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBook = async (bookData) => {
    try {
      await booksApi.publishBook({ ...bookData, userId });
      setIsPublishModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error publishing book:', error);
    }
  };

  const handleRequestBook = async (bookData) => {
    try {
      await booksApi.requestBook({ ...bookData, userId });
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
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 mb-6">
          Find and exchange books with other students.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Publish a Book
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Request a Book
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matches Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Your Matches
            </h2>
            <span className="text-sm text-gray-500">
              {matches.length} matches
            </span>
          </div>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No matches found yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Keep publishing and requesting books to find matches!
                </p>
              </div>
            ) : (
              matches.map(match => (
                <div key={match.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div onClick={() => {
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
                </div>
              ))
            )}
          </div>
        </section>

        {/* Most Wanted Books Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Most Wanted Books
            </h2>
            <span className="text-sm text-gray-500">
              {mostWantedBooks.length} books
            </span>
          </div>
          <div className="space-y-4">
            {mostWantedBooks.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No books in high demand at the moment.</p>
              </div>
            ) : (
              mostWantedBooks.map(book => (
                <div key={book.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      {book.requestCount} {book.requestCount === 1 ? 'student needs' : 'students need'} this book
                    </span>
                  </div>
                  <BookCard
                    book={book}
                    showRequestButton={false}
                    actionButton={
                      <button
                        onClick={() => handleIHaveThisBook(book)}
                        className="w-full text-sm font-medium text-green-600 hover:text-green-700 py-2 border border-green-200 rounded-md hover:border-green-300 transition-colors"
                      >
                        I Have This Book
                      </button>
                    }
                  />
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
        selectedBook={selectedBook}
      />
      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setSelectedBook(null);
        }}
        onConfirm={handleRequestBook}
        preselectedBookId={selectedBook?.id}
      />
      <MatchNotificationModal
        isOpen={isMatchModalOpen}
        onClose={() => {
          setIsMatchModalOpen(false);
          setSelectedMatch(null);
        }}
        match={selectedMatch}
      />
    </div>
  );
};

export default Dashboard;
