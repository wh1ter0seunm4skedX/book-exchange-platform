import { Book } from '../types/book';
import { BookOpen, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRequest?: (bookId: string) => void;
}

export function BookCard({ book, onRequest }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {book.image_url ? (
        <img
          src={book.image_url}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 text-right">{book.title}</h3>
        <p className="text-sm text-gray-600 text-right">by {book.author}</p>
        <div className="mt-2 text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {book.condition}
          </span>
        </div>
        {book.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 text-right">
            {book.description}
          </p>
        )}
        <div className="mt-4 flex flex-row-reverse items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 ml-1" />
            <span>Posted by Student</span>
          </div>
          {book.is_available && onRequest && (
            <button
              onClick={() => onRequest(book.id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}