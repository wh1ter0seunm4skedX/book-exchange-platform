import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For testing purposes, you can use any of the existing users
      // All users have the same password hash, but we'll send the plain password to the backend
      // The backend will handle the password verification
      await authApi.login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Book Exchange Platform</h1>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        
        {error && (
          <div className="p-3 sm:p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Register here
              </Link>
            </p>
          </div>
          
          {/* For testing purposes, show available test accounts */}
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Accounts:</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-600">Email: tal.cohen@example.com</p>
                <p className="text-xs text-gray-600">Password: password123</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({ email: 'tal.cohen@example.com', password: 'password123' })}
                className="mt-2 sm:mt-0 text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Note: All test accounts use the same password.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
