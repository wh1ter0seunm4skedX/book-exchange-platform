import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Library } from 'lucide-react';
import { BookForm } from './components/BookForm';
import { BookList } from './pages/BookList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-2 py-2 text-gray-900 hover:text-blue-600"
                >
                  <BookOpen className="h-6 w-6 mr-2" />
                  <span className="font-bold text-xl">Scaffold</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  to="/add"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <PlusCircle className="h-5 w-5" />
                </Link>
                <Link
                  to="/my-books"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <Library className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route
              path="/add"
              element={
                <div className="max-w-lg mx-auto">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Add a New Book
                  </h1>
                  <BookForm />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;