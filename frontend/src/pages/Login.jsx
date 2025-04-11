import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBookOpen,
  HiXCircle,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiArrowPath,
  HiOutlineBolt
} from 'react-icons/hi2';

// Background animation stuff
const blobKeyframes = { /* ... keyframes ... */ };
const styles = { '@keyframes blob': blobKeyframes };

// Login page
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Update form fields as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (validationState[name] && !validationState[name].isValid) {
      setValidationState(prevState => ({
        ...prevState,
        [name]: { isValid: true, message: '' }
      }));
    }
  };

  const [validationState, setValidationState] = useState({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' }
  });

  // Check if the form looks good
  const validateForm = () => {
    const newValidationState = {
      email: { isValid: true, message: '' },
      password: { isValid: true, message: '' }
    };
    if (!formData.email) {
      newValidationState.email = { isValid: false, message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newValidationState.email = { isValid: false, message: 'Please enter a valid email address' };
    }
    if (!formData.password) {
      newValidationState.password = { isValid: false, message: 'Password is required' };
    } else if (formData.password.length < 6) {
      newValidationState.password = { isValid: false, message: 'Password must be at least 6 characters' };
    }
    setValidationState(newValidationState);
    return Object.values(newValidationState).every(field => field.isValid);
  };

  // Try to log in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await authApi.login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Log detailed error for developers
      console.error('Login error:', err);
      
      // Parse the error response
      let errorMessage = 'An unexpected error occurred. Please try again.';
      try {
        if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response?.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message) {
          // Try to parse the error message from the response
          const errorData = JSON.parse(err.message);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        }
      } catch (parseError) {
        console.error('Error parsing error message:', parseError);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Cool background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.1 }} />
            </linearGradient>
            <pattern id="pattern1" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <rect width="100%" height="100%" fill="url(#pattern1)" />
        </svg>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/20">
          <div className="text-center">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <HiOutlineBookOpen className="h-8 w-8 text-white" aria-hidden="true" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-1">
              Book Exchange Platform
            </h1>
            <h2 className="mt-2 text-lg sm:text-xl font-semibold text-gray-700">Welcome back!</h2>
            <p className="mt-1 text-sm text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Error popup */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200 flex items-center gap-2"
                role="alert"
              >
                <HiXCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white ${!validationState.email.isValid ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-label="Email address"
                  aria-invalid={!validationState.email.isValid}
                  aria-describedby={!validationState.email.isValid ? "email-error" : undefined}
                />
                <AnimatePresence>
                  {!validationState.email.isValid && (
                    <motion.p
                      key="email-error"
                      id="email-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-red-600"
                    >
                      {validationState.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white ${!validationState.password.isValid ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-label="Password"
                  aria-invalid={!validationState.password.isValid}
                  aria-describedby={!validationState.password.isValid ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:z-10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                <AnimatePresence>
                  {!validationState.password.isValid && (
                    <motion.p
                      key="password-error"
                      id="password-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-red-600"
                    >
                      {validationState.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sign-in button */}
            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
                aria-label={isLoading ? "Signing in..." : "Sign in"}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <HiArrowPath className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" aria-hidden="true"/>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </div>

            {/* Register link */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150">
                  Register here
                </Link>
              </p>
            </div>
          </form>

          {/* Test account info */}
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50/80 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Account:</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-gray-700">Email:</span> tal.cohen@example.com
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-gray-700">Password:</span> password123
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setFormData({ email: 'tal.cohen@example.com', password: 'password123' })}
                className="mt-2 sm:mt-0 text-xs px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 font-medium inline-flex items-center transition-colors duration-150"
              >
                <HiOutlineBolt className="h-4 w-4 mr-1" aria-hidden="true" />
                Auto-fill
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;