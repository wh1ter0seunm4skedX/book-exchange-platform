import React, { useState } from 'react';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { useBooks } from '../hooks/useBooks';

export function BookList() {
  const { books, loading } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onRequest={(bookId) => {
                console.log('Requesting book:', bookId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}