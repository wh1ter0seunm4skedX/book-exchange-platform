import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import PublishBookModal from '../modals/PublishBookModal';
import RequestBookModal from '../modals/RequestBookModal';
import MatchNotificationModal from '../modals/MatchNotificationModal';
import { matchesApi } from '../api/matches';
import { booksApi } from '../api/books';
import { usersApi } from '../api/users';
import { getCurrentUserId } from '../api/apiUtils';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [mostWantedBooks, setMostWantedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      try {
        const userData = await usersApi.getUserProfile(userId);
        setUser(userData);
      } catch (userError) {
        console.error('Error fetching user profile:', userError);
        setUser({ name: 'User', email: 'user@example.com' });
      }
      
      // Fetch user matches using the correct endpoint
      try {
        const userMatches = await matchesApi.getUserMatches(userId);
        if (userMatches && userMatches.length > 0) {
          console.log('Fetched matches:', userMatches);
          setMatches(userMatches);
        } else {
          console.warn('No matches found for user, using empty array');
          setMatches([]);
        }
      } catch (matchesError) {
        console.error('Error fetching user matches:', matchesError);
        setMatches([]);
      }
      
      // Fetch most wanted books using the correct endpoint
      try {
        const wantedBooks = await booksApi.getMostWantedBooks();
        if (wantedBooks && wantedBooks.length > 0) {
          console.log('Fetched most wanted books:', wantedBooks);
          // Only show top 3 most requested books
          setMostWantedBooks(wantedBooks.slice(0, 3));
        } else {
          console.warn('No most wanted books found, using empty array');
          setMostWantedBooks([]);
        }
      } catch (booksError) {
        console.error('Error fetching most wanted books:', booksError);
        setMostWantedBooks([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBook = () => {
    setShowPublishModal(true);
  };

  const handleRequestBook = () => {
    setShowRequestModal(true);
  };

  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      await matchesApi.acceptMatch(matchId);
      // Refresh matches after accepting
      fetchDashboardData();
      setShowMatchModal(false);
    } catch (error) {
      console.error('Error accepting match:', error);
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      await matchesApi.rejectMatch(matchId);
      // Refresh matches after rejecting
      fetchDashboardData();
      setShowMatchModal(false);
    } catch (error) {
      console.error('Error rejecting match:', error);
    }
  };

  const handleModalClose = (refreshData = false) => {
    setShowPublishModal(false);
    setShowRequestModal(false);
    setShowMatchModal(false);
    
    if (refreshData) {
      fetchDashboardData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matches Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
          
          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <div 
                  key={match.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewMatch(match)}
                >
                  <h3 className="font-medium">{match.book?.title || 'Unknown Book'}</h3>
                  <p className="text-sm text-gray-600">Status: {match.status}</p>
                  <p className="text-sm text-gray-500">Click to respond</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any matches yet.</p>
          )}
        </div>
        
        {/* Most Wanted Books Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Most Wanted Books</h2>
          
          {mostWantedBooks.length > 0 ? (
            <div className="space-y-4">
              {mostWantedBooks.map((book) => (
                <div key={book.id} className="flex items-start space-x-4">
                  <div className="bg-gray-200 w-16 h-20 flex-shrink-0 rounded">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-gray-600">Course: {book.course || 'N/A'}</p>
                    <button
                      onClick={() => handleRequestBook(book)}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Request Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No most wanted books available.</p>
          )}
        </div>
      </div>

      
      {/* Modals */}
      {showPublishModal && (
        <PublishBookModal onClose={handleModalClose} />
      )}
      
      {showRequestModal && (
        <RequestBookModal onClose={handleModalClose} />
      )}
      
      {showMatchModal && selectedMatch && (
        <MatchNotificationModal 
          match={selectedMatch}
          onAccept={() => handleAcceptMatch(selectedMatch.id)}
          onReject={() => handleRejectMatch(selectedMatch.id)}
          onClose={() => handleModalClose()}
        />
      )}
    </div>
  );
};

export default Dashboard;
