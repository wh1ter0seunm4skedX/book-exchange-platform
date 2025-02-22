import React from 'react';

const BookCard = ({ book, onRequest, showRequestButton = true }) => {
  const { title, author, description, coverImage, condition, available, owner } = book;

  const conditionColors = {
    New: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Used: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative pb-[150%]">
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{author}</p>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              conditionColors[condition] || 'bg-gray-100 text-gray-800'
            }`}>
              {condition}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm text-gray-500">
                <span className="block">Owner:</span>
                <span className="font-medium text-gray-900">{owner.name}</span>
              </div>
            </div>
            {showRequestButton && available && (
              <button
                onClick={() => onRequest(book)}
                className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
