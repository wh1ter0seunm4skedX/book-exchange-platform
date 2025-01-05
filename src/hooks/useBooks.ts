import { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { mockBooks } from '../data/mockBooks';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setBooks(mockBooks);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addBook = (book: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_available'>) => {
    const newBook: Book = {
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      user_id: '1',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setBooks(prev => [newBook, ...prev]);
  };

  return { books, loading, addBook };
}