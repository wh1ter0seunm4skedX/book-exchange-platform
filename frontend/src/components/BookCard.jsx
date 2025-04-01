import React from 'react';
import { motion } from 'framer-motion';

const BookPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100">
    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  </div>
);

const BookCard = ({ 
  book, 
  showRequestButton = true, 
  onRequestClick,
  actionButton = null,
  status = null,
  date = null
}) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex h-32">
        {/* Book Cover */}
        <div className="flex-shrink-0 w-24 bg-gray-50 overflow-hidden">
          {book?.courseNumber && !showPlaceholder ? (
            <img
              src={`/coursesImages/${book.courseNumber}.png`}
              alt={book.title || 'Book cover'}
              className="w-full h-full object-cover"
              onError={() => setShowPlaceholder(true)}
            />
          ) : (
            <BookPlaceholder />
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                {book?.title || 'Untitled Book'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Course: {book?.courseNumber || 'N/A'}
              </p>
              {book.publication?.condition && (
                <p className="text-xs text-gray-600 mt-1">
                  Condition: {book.publication.condition}
                </p>
              )}
              {status && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                  status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status}
                </span>
              )}
              {date && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
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

      {/* Action Button */}
      {actionButton && (
        <div className="border-t border-gray-100">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default BookCard;
