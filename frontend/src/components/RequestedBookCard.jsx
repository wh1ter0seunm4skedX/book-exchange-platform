import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const RequestedBookCard = ({ book, requestDate }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md">
      <div className="flex h-32">
        {/* Book Cover */}
        <div className="flex-shrink-0 w-24 bg-gray-200 overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Course: {book.courseNumber}
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
    </div>
  );
};

export default RequestedBookCard;
