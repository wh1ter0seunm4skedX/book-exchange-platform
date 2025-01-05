import React, { useState } from 'react';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { useBooks } from '../hooks/useBooks';
import { useBookRequests } from '../hooks/useBookRequests';

export function BookList() {
  const { books, loading, markBookAsRequested, isBookRequested } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const { requestBook, isRequesting } = useBookRequests();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestBook = async (bookId: string) => {
    const success = await requestBook(bookId);
    if (success) {
      markBookAsRequested(bookId);
      console.log('Book requested successfully');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRequest={handleRequestBook}
              isRequesting={isRequesting(book.id)}
              isRequested={isBookRequested(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}