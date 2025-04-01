import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const RequestedBookCard = ({ book, requestDate, onCancelRequest }) => {
  if (!book) {
    return (
      <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden p-4">
        <p className="text-gray-500">Book data not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md">
      <div className="flex h-32">
        {/* Book Cover */}
        <div className="flex-shrink-0 w-24 bg-gray-200 overflow-hidden">
          <img
            src= "https://placehold.co/150x200"
            alt={book.title || 'Book cover'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {book.title || 'Untitled Book'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Course: {book.courseNumber || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Requested on: {formatDate(requestDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="bg-blue-50 px-4 py-3 border-t border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-blue-700">
            Don't worry! We're looking for this book for you...
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-1 pl-7">
          We'll notify you as soon as we find a match!
        </p>
      </div>
      
      {/* Cancel Request Button */}
      {onCancelRequest && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => onCancelRequest()}
            className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestedBookCard;
