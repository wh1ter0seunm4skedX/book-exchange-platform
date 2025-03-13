import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './api/apiUtils';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  // Update login state when authentication changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };

    // Check auth on mount
    checkAuth();

    // Set up event listener for storage changes (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && <Header />}
      <main className={`flex-grow ${!isLoggedIn ? 'p-0' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to dashboard if logged in, otherwise to login */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </main>
      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App
