import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
import { PublishBookForm } from './components/PublishBookForm';
import { AuthProvider } from './context/AuthContext';
import { Book } from './types';
import { mockBooks } from './mockData';
import { PlusCircle, Search, BookOpen, Calculator, GraduationCap } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handlePublish = (newBook: Omit<Book, 'id' | 'owner'>) => {
    const book: Book = {
      ...newBook,
      id: String(books.length + 1),
      owner: mockBooks[0].owner,
    };
    setBooks([...books, book]);
    setShowPublishForm(false);
  };

  const handleRequest = (book: Book) => {
    alert(`Request sent for "${book.title}"`);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const categories = [
    { name: 'Computer Science', icon: <BookOpen className="h-6 w-6" />, color: 'bg-blue-500' },
    { name: 'Mathematics', icon: <Calculator className="h-6 w-6" />, color: 'bg-green-500' },
    { name: 'Both', icon: <GraduationCap className="h-6 w-6" />, color: 'bg-purple-500' },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        {/* Main Content */}
        <main className="container mx-auto px-4 pt-20 pb-8">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to CS & Math Book Exchange
            </h1>
            <p className="text-gray-600 mb-6">
              Share and discover academic books with fellow students and faculty members.
            </p>
            <button
              onClick={() => setShowPublishForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Share Your Books
            </button>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedSubject(category.name)}
                className={`${category.color} text-white p-6 rounded-lg shadow-md hover:opacity-90 transition-opacity
                  ${selectedSubject === category.name ? 'ring-4 ring-offset-2 ring-indigo-500' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <span className="text-lg font-semibold">{category.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search books by title or author..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Filters
                </button>
                <button
                  onClick={() => setShowPublishForm(true)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Publish Book</span>
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="all">All Subjects</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRequest={handleRequest}
              />
            ))}
          </div>
          
          {showPublishForm && (
            <PublishBookForm
              onPublish={handlePublish}
              onClose={() => setShowPublishForm(false)}
            />
          )}
        </main>
      </div>
    </AuthProvider>
  );
}