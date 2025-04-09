import React from 'react';
import { motion } from 'framer-motion';
// Import necessary icons
import { HiX } from 'react-icons/hi'; // Import HiX from v1 Heroicons
import {
  HiOutlineBookOpen,      // Placeholder icon
  HiClock,                // Date/Time icon
  HiArrowPath,            // Spinner icon
  HiCheckCircle,          // Available status icon
  HiExclamationCircle,    // Pending/Other status icon
  HiLightBulb,            // Available status icon
  HiLink                  // Adding link icon for matched status
} from 'react-icons/hi2'; // Using Hi2 for potentially newer/updated icons

// Reusable placeholder component with React Icons
const BookPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-l-lg">
    <HiOutlineBookOpen className="w-10 h-10 text-gray-300" aria-hidden="true" />
  </div>
);

// Date formatting utility
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    // Using en-GB for DD/MM/YYYY format. Changed from previous thought of en-IL as en-GB is more standard for this format.
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

const BookCard = ({
  book,
  showRequestButton = true,
  onRequestClick,
  actionButton = null,
  status = null,
  date = null,
  isRequested = false,
  requestDate = null,
  onCancelRequest = null,
  isMatched = false
}) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState(!book?.courseNumber);

  // Debug logs for props
  console.log('BookCard Props:', {
    bookTitle: book?.title,
    status,
    isRequested,
    isMatched,
    hasActionButton: !!actionButton,
    hasOnCancelRequest: !!onCancelRequest
  });

  React.useEffect(() => {
    setShowPlaceholder(!book?.courseNumber);
  }, [book?.courseNumber]);

  if (!book) {
    return (
      <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden p-4 h-36 animate-pulse">
         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const getStatusInfo = (currentStatus) => {
    switch (currentStatus?.toUpperCase()) {
      case 'AVAILABLE':
      case 'ACCEPTED':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800', Icon: HiCheckCircle };
      case 'PENDING':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', Icon: HiClock };
      case 'MATCHED':
        return { bgColor: 'bg-purple-100', textColor: 'text-purple-800', Icon: HiLink };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800', Icon: HiExclamationCircle };
    }
  };
  const statusInfo = getStatusInfo(status);

  // Determine if the card should be grayed out
  const isGrayedOut = status?.toUpperCase() === 'MATCHED' || isMatched;
  
  // Debug log for grayed out status
  console.log('Card Grayed Out Status:', {
    bookTitle: book?.title,
    isGrayedOut,
    statusUpperCase: status?.toUpperCase(),
    isMatched,
    statusCondition: status?.toUpperCase() === 'MATCHED',
    finalCondition: isGrayedOut
  });
  
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border ${
        isGrayedOut ? 'border-purple-200 opacity-80' : isRequested ? 'border-blue-100' : 'border-gray-100'
      }`}
    >
      {/* Top Section: Image and Info */}
      <div className={`flex h-36 ${isGrayedOut ? 'bg-gray-50' : ''}`}>
        {/* Book Cover Area with overflow hidden */}
        <div className="flex-shrink-0 w-28 bg-gray-100 rounded-l-lg overflow-hidden">
          {book?.courseNumber && !showPlaceholder ? (
             // Use motion.img for hover effect on the image itself
            <motion.img
              src={`/coursesImages/${book.courseNumber}.png`}
              alt={`Cover for ${book.title || 'book'}`}
              className={`w-full h-full object-cover ${isGrayedOut ? 'filter grayscale-[30%]' : ''}`}
              onError={() => setShowPlaceholder(true)}
              loading="lazy"
              whileHover={{ scale: isGrayedOut ? 1.02 : 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
          ) : (
            <BookPlaceholder />
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
              {book?.title || 'Untitled Book'}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              Course: {book?.courseNumber || 'N/A'}
            </p>

            {isRequested ? (
              <>
                {/* Show both request date and status for requested books */}
                {requestDate && (
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <HiClock className="w-3.5 h-3.5 mr-1 text-gray-400" aria-hidden="true" />
                    Requested: {formatDate(requestDate)}
                  </div>
                )}
                {/* Add status tag for requested books */}
                {status && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                    <statusInfo.Icon className="w-3.5 h-3.5 mr-1" aria-hidden="true"/>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </span>
                )}
                {/* Display matched status badge if matched but no status is provided */}
                {isMatched && !status && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 bg-purple-100 text-purple-800">
                    <HiLink className="w-3.5 h-3.5 mr-1" aria-hidden="true"/>
                    Matched
                  </span>
                )}
              </>
            ) : (
              <>
                {status && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                     <statusInfo.Icon className="w-3.5 h-3.5 mr-1" aria-hidden="true"/>
                     {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </span>
                )}
                {date && !status && (
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <HiClock className="w-3.5 h-3.5 mr-1 text-gray-400" aria-hidden="true" />
                    Published: {formatDate(date)}
                  </div>
                )}
                {/* Display matched status badge if matched but no status is provided */}
                {isMatched && !status && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 bg-purple-100 text-purple-800">
                    <HiLink className="w-3.5 h-3.5 mr-1" aria-hidden="true"/>
                    Matched
                  </span>
                )}
              </>
            )}
            
            {/* Display matched status badge if matched */}
            {isMatched && !isRequested && status && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 bg-purple-100 text-purple-800">
                <HiLink className="w-3.5 h-3.5 mr-1" aria-hidden="true"/>
                Matched
              </span>
            )}
          </div>

           {!isRequested && showRequestButton && !actionButton && onRequestClick && !isGrayedOut && (
             <div className="mt-2">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                    e.stopPropagation();
                    onRequestClick(book);
                    }}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-150"
                >
                    Request Book
                </motion.button>
             </div>
            )}
        </div>
      </div>
      {/* Bottom Section: Status/Actions */}
      {/* Loading Animation for Requested Books */}
      {isRequested && !isMatched && (
        <div className="bg-blue-50 px-3 sm:px-4 py-3 border-t border-blue-100">
          <div className="flex items-center space-x-2">
            <HiArrowPath className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" aria-hidden="true"/>
            <div className="flex-1">
                {/* Single line of text now */}
                <p className="text-xs sm:text-sm text-blue-700 font-medium">
                  Don't worry! We're looking this book for you! 👀
                </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Matched Status Notification */}
      {isMatched && (
        <div className="bg-purple-50 px-3 sm:px-4 py-3 border-t border-purple-100">
          <div className="flex items-center space-x-2">
            <HiLink className="w-4 h-4 text-purple-600 flex-shrink-0" aria-hidden="true"/>
            <div className="flex-1">
                <p className="text-xs sm:text-sm text-purple-700 font-medium">
                  This book is matched! The exchange is in progress.
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Button for Requested Books */}
      {isRequested && onCancelRequest && (
        <div className="border-t border-gray-200">
           {/* Debug log for cancel button rendering */}
           {console.log('Rendering cancel button:', {
             bookTitle: book?.title,
             isMatched,
             showingDisabledButton: isMatched,
             showingActiveButton: !isMatched
           })}
           
           {isMatched ? (
             // Disabled button for matched requests
             <button
                disabled
                className="w-full text-sm text-gray-400 flex items-center justify-center py-2 focus:outline-none rounded-b-lg cursor-not-allowed bg-gray-50"
              >
                <HiX className="h-4 w-4 mr-1" aria-hidden="true" />
                Cannot Cancel Matched Request
             </button>
           ) : (
             // Regular cancel button for non-matched requests
             <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onCancelRequest();
                }}
                className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center py-2 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-b-lg"
              >
                <HiX className="h-4 w-4 mr-1" aria-hidden="true" />
                Cancel Request
             </motion.button>
           )}
        </div>
      )}
      
      {/* Custom Action Button Slot */}
      {!isRequested && actionButton && (
        <div className="border-t border-gray-200 rounded-b-lg overflow-hidden">
          {/* Debug log for action button rendering */}
          {console.log('Rendering action button:', {
            bookTitle: book?.title,
            isMatched,
            actionButtonType: typeof actionButton
          })}
          
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default BookCard;