import React, { useState } from 'react';
import { BookOpen, LogIn, Search, Menu, X, Home, BookPlus, BookUp, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../mockData';

export function Header() {
  const { user, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-indigo-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-2xl font-bold hidden md:block">CS & Math Book Exchange</h1>
            <h1 className="text-2xl font-bold md:hidden">Book Exchange</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="flex items-center space-x-1 hover:text-indigo-200">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </a>
            <a href="/publish" className="flex items-center space-x-1 hover:text-indigo-200">
              <BookPlus className="h-5 w-5" />
              <span>Publish Book</span>
            </a>
            <a href="/request" className="flex items-center space-x-1 hover:text-indigo-200">
              <BookUp className="h-5 w-5" />
              <span>Request Book</span>
            </a>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="hidden md:block">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => login(mockUsers[0])}
                className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-indigo-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <a href="/" className="block py-2 hover:bg-indigo-700 px-4 rounded">Home</a>
            <a href="/publish" className="block py-2 hover:bg-indigo-700 px-4 rounded">Publish Book</a>
            <a href="/request" className="block py-2 hover:bg-indigo-700 px-4 rounded">Request Book</a>
          </div>
        )}
      </div>
    </header>
  );
}