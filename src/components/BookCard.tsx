import React from 'react';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Star, AlertCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRequest: (book: Book) => void;
}

export function BookCard({ book, onRequest }: BookCardProps) {
  const { user } = useAuth();

  const getConditionColor = (condition: Book['condition']) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Like New':
        return 'bg-blue-100 text-blue-800';
      case 'Very Good':
        return 'bg-indigo-100 text-indigo-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
          <div className="flex items-center space-x-1 text-indigo-600">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">{book.subject}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">Edition: {book.edition}</p>
          {book.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={book.owner.avatar}
              alt={book.owner.name}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{book.owner.name}</p>
              <p className="text-xs text-gray-500">{book.owner.department}</p>
            </div>
          </div>

          {user && user.id !== book.ownerId && book.available && (
            <button
              onClick={() => onRequest(book)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}