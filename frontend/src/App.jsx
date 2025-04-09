// Main app setup with routing
import { useState, useEffect } from 'react';
import './App.css';
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

  // Keep login state in sync
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Anyone can enter these */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Logged-in users only */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="flex-grow">
                <Dashboard />
              </main>
              <Footer />
            </>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="flex-grow">
                <Profile />
              </main>
              <Footer />
            </>
          </ProtectedRoute>
        } />
        
        {/* Redirect based on login status */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/register"} />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/register"} />} />
      </Routes>
    </div>
  );
}

export default App;