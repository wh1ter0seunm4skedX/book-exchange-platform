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
  HiOutlineBolt,
  HiOutlineUsers,
  HiXMark
} from 'react-icons/hi2';

// Login page
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Track mouse position for blob interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update form fields
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

  // Validate form
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

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await authApi.login(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      try {
        if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response?.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-purple-200 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Gradient Pulse Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-purple-300/20"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Interactive Blobs */}
      <div className="absolute inset-0 z-1 overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.1 }} />
            </linearGradient>
            <pattern id="pattern1" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <rect width="100%" height="100%" fill="url(#pattern1)" />
        </svg>
        <motion.div
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60, scale: [1, 1.1, 1] }}
          transition={{ scale: { duration: 2.5, repeat: Infinity }, x: { duration: 0.2 }, y: { duration: 0.2 } }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
          style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
        ></motion.div>
        <motion.div
          animate={{ x: mousePos.x * -60, y: mousePos.y * -60, scale: [1, 1.1, 1] }}
          transition={{ scale: { duration: 2.5, repeat: Infinity }, x: { duration: 0.2 }, y: { duration: 0.2 } }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
          style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
        ></motion.div>
        <motion.div
          animate={{ x: mousePos.x * 30, y: mousePos.y * 30, scale: [1, 1.1, 1] }}
          transition={{ scale: { duration: 2.5, repeat: Infinity }, x: { duration: 0.2 }, y: { duration: 0.2 } }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
          style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
        ></motion.div>
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-white/30 ring-2 ring-blue-200/50">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 5, -5, 0] }}
              transition={{ scale: { duration: 0.5, type: 'spring', stiffness: 200 }, opacity: { duration: 0.5 }, rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-300/50"
            >
              <HiOutlineBookOpen className="h-8 w-8 text-white" aria-hidden="true" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-1"
            >
              Book Exchange Platform
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-2 text-lg sm:text-xl font-semibold text-gray-700"
            >
              Welcome back!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-1 text-sm text-gray-600"
            >
              Sign in to continue your journey
            </motion.p>
          </div>

          {/* Error popup */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 text-sm flex items-center gap-2 rounded-lg border bg-red-100 text-red-800 border-red-200"
                role="alert"
                aria-live="assertive"
              >
                <HiXCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto p-1 rounded-full text-red-600 hover:bg-red-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  aria-label="Dismiss error"
                >
                  <HiXMark className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form with progressive animation */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 120 }}
            >
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
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 120 }}
            >
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
            </motion.div>

            {/* Sign-in button */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 150 }}
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
                aria-label={isLoading ? "Signing in..." : "Sign in"}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <HiArrowPath className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" aria-hidden="true" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </motion.div>

            {/* Register link */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 120 }}
              className="text-center pt-2"
            >
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
                  Register here
                </Link>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Floating Test Users Button and Panel */}
      <div className="fixed bottom-6 right-6 z-20 group">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowTestUsers(!showTestUsers)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ring-2 ring-blue-300/50"
          aria-label={showTestUsers ? "Hide test accounts" : "Show test accounts"}
        >
          <HiOutlineUsers className="h-6 w-6" aria-hidden="true" />
        </motion.button>
        <div className="absolute bottom-16 right-0 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View Test Accounts
        </div>

        <AnimatePresence>
          {showTestUsers && (
            <motion.div
              initial={{ x: 300, opacity: 0, rotateY: 10 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: 300, opacity: 0, rotateY: 10 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="fixed bottom-20 right-6 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-gray-200 max-h-[70vh] overflow-y-auto ring-2 ring-blue-200/50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <HiOutlineUsers className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  Test Accounts
                </h3>
                <button
                  onClick={() => setShowTestUsers(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close test accounts panel"
                >
                  <HiXMark className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Tal Cohen", email: "tal.cohen@example.com", password: "password123" },
                  { name: "Noa Levi", email: "noa.levi@example.com", password: "password123" },
                  { name: "Amit Shapira", email: "amit.shapira@example.com", password: "password123" },
                  { name: "Maya Golan", email: "maya.golan@example.com", password: "password123" },
                  { name: "Yoav Stern", email: "yoav.stern@example.com", password: "password123" },
                ].map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/80 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-gray-700">{account.name}</span>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => {
                        setFormData({ email: account.email, password: account.password });
                        setShowTestUsers(false);
                      }}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <HiOutlineBolt className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      Auto-fill
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
