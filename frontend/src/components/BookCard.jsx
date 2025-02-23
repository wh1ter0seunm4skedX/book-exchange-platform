import React from 'react';

const BookCard = ({ book, showRequestButton = true, onRequestClick }) => {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden h-32 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
      {/* Book Cover */}
      <div className="flex-shrink-0 w-24 bg-gray-200 overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
        />
      </div>

      {/* Book Info */}
      <div className="flex-1 p-3 min-w-0">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
              {book.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {book.courseNumber} • {book.author}
            </p>
            {book.publication?.condition && (
              <p className="text-xs text-gray-600 mt-1">
                Condition: {book.publication.condition}
              </p>
            )}
          </div>

          {showRequestButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestClick?.(book);
              }}
              className="mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Request Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
