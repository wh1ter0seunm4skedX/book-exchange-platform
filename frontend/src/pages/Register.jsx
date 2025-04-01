import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    preferredExchangeLocation: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const campusLocations = [
    'Raanana Campus',
    'Tel Aviv Campus',
    'Jerusalem Campus',
    'Haifa Campus',
    'Beer Sheva Campus'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'phoneNumber' ? value.replace(/\D/g, '') : value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        setError('Please fill in all fields.');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.password || !formData.phoneNumber) {
        setError('Please fill in all fields.');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
      if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
        setError('Please enter a valid phone number (10-15 digits).');
        return false;
      }
    } else if (step === 3) {
      if (!formData.preferredExchangeLocation) {
        setError('Please select a preferred exchange location.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsLoading(true);
    try {
      await authApi.register(formData);
      await authApi.login({
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto flex items-center justify-center">
        {/* Left Panel - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-1/2 pr-16"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl filter blur-3xl"></div>
            <div className="relative p-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Book Exchange Community</h2>
              <p className="text-lg text-gray-700 mb-8">
  Welcome to BookXChange — where every book tells a story, and every student is part of something bigger. By joining our community, you're not just registering for an app — you're helping build a culture of sharing, sustainability, and support among students. Whether you're passing on knowledge or discovering it, we’re here to make the exchange simple, meaningful, and personal.
</p>
<p className="text-xl text-gray-700 mt-4">
  Let’s make textbooks live longer — <span className="font-bold">together</span>. ✌🏼
</p>
<div className="mt-8"></div>
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 relative z-10 border border-white/20">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </motion.div>
              <h1 className="text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                BookXChange
              </h1>
              <h2 className="mt-4 text-xl font-semibold text-gray-700">Create your account right now</h2>
              <p className="mt-2 text-sm text-gray-600">Join our community!</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-center"
                role="alert"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {i}
                    </div>
                    {i < 3 && (
                      <div className={`h-1 w-16 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white"
                        placeholder="972XXXXXXXXX"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">Format: 972 followed by phone number without leading 0</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="preferredExchangeLocation" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Exchange Location
                      </label>
                      <div className="relative">
                        <select
                          id="preferredExchangeLocation"
                          name="preferredExchangeLocation"
                          required
                          className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white"
                          value={formData.preferredExchangeLocation}
                          onChange={handleChange}
                        >
                          <option value="">Select a campus</option>
                          {campusLocations.map(location => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Previous
                  </motion.button>
                )}

                {step < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : 'Create account'}
                  </motion.button>
                )}
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;