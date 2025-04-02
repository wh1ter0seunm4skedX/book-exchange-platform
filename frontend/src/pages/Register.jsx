import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { motion, AnimatePresence } from 'framer-motion';
// Import React Icons
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiXCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiChevronDown,
  HiArrowPath, // Spinner
  HiOutlineUser, // For Full Name input
  HiOutlineEnvelope, // For Email input
  HiOutlineDevicePhoneMobile, // For Phone input
  HiOutlineLockClosed, // For Password input
  HiOutlineMapPin, // For Location input
  HiArrowRight, // For Next button
  HiArrowLeft, // For Previous button
} from 'react-icons/hi2'; // Using v2 icons

// Background animation definitions (kept as is)
// const blobKeyframes = { /* ... keyframes ... */ };
// const styles = { '@keyframes blob': blobKeyframes };

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    preferredExchangeLocation: ''
  });
  // Use single error state primarily for API errors or general step issues
  const [apiError, setApiError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const campusLocations = [
    'Raanana Campus',
    'Tel Aviv Campus',
    'Jerusalem Campus',
    'Haifa Campus',
    'Beer Sheva Campus'
    // Consider adding 'Other' or allowing free text?
  ];

  // Per-field validation state
  const [validationState, setValidationState] = useState({
    fullName: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    phoneNumber: { isValid: true, message: '' },
    preferredExchangeLocation: { isValid: true, message: '' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'phoneNumber' ? value.replace(/\D/g, '') : value; // Allow only digits for phone

    setFormData(prevData => ({
      ...prevData,
      [name]: processedValue
    }));

    // Clear validation error for the field being changed
    if (validationState[name] && !validationState[name].isValid) {
      setValidationState(prevState => ({
        ...prevState,
        [name]: { isValid: true, message: '' }
      }));
    }
     // Clear general API error when user starts typing again
    if (apiError) setApiError(''); 
  };

  // Updated validation logic for per-field messages
  const validateStep = () => {
    const newValidationState = { ...validationState };
    let isStepValid = true;
    // Always reset errors for fields in the current step before validating
    const fieldsInStep1 = ['fullName', 'email'];
    const fieldsInStep2 = ['password', 'phoneNumber'];
    const fieldsInStep3 = ['preferredExchangeLocation'];

    const resetValidation = (fields) => {
        fields.forEach(field => {
            newValidationState[field] = { isValid: true, message: '' };
        });
    };

    if (step === 1) {
      resetValidation(fieldsInStep1);
      if (!formData.fullName.trim()) {
        newValidationState.fullName = { isValid: false, message: 'Full name is required' };
        isStepValid = false;
      }
      if (!formData.email.trim()) {
        newValidationState.email = { isValid: false, message: 'Email is required' };
        isStepValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newValidationState.email = { isValid: false, message: 'Please enter a valid email address' };
        isStepValid = false;
      }
    } else if (step === 2) {
       resetValidation(fieldsInStep2);
      if (!formData.password) {
        newValidationState.password = { isValid: false, message: 'Password is required' };
        isStepValid = false;
      } else if (formData.password.length < 6) { // Changed from 8 to 6 for consistency with Login example
        newValidationState.password = { isValid: false, message: 'Password must be at least 6 characters' };
        isStepValid = false;
      }
      if (!formData.phoneNumber.trim()) {
        newValidationState.phoneNumber = { isValid: false, message: 'Phone number is required' };
        isStepValid = false;
       } // Using a simple regex for common international formats (digits, maybe +,-,(,))
        else if (!/^\+?[\d\s()-]{10,20}$/.test(formData.phoneNumber) && !/^\d{10,15}$/.test(formData.phoneNumber)) {
        newValidationState.phoneNumber = { isValid: false, message: 'Please enter a valid phone number' };
        isStepValid = false;
      }
    } else if (step === 3) {
       resetValidation(fieldsInStep3);
      if (!formData.preferredExchangeLocation) {
        newValidationState.preferredExchangeLocation = { isValid: false, message: 'Please select a preferred location' };
        isStepValid = false;
      }
    }

    setValidationState(newValidationState);
    // Clear general API error if step validation passes
    if (isStepValid) setApiError(''); 
    return isStepValid;
  };


  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
      setStep(step - 1);
      // Clear general API error when going back
      setApiError(''); 
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return; // Final validation before submit
    setIsLoading(true);
    setApiError(''); // Clear previous API errors
    try {
      await authApi.register(formData);
      // Try to login immediately after successful registration
      await authApi.login({
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard'); // Navigate to dashboard on success
    } catch (err) {
      console.error("Registration/Login failed:", err);
      // Handle potential duplicate email errors specifically if API provides codes
      if (err.response?.data?.message?.includes('duplicate') || err.message?.includes('duplicate')) {
           setApiError('An account with this email already exists.');
           // Optionally go back to step 1 and highlight email field
           setStep(1);
           setValidationState(prev => ({...prev, email: {isValid: false, message: 'Email already in use'}}));
      } else {
          setApiError(err.message || 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

   // Input field base classes
   const inputBaseClasses = "appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white";
   const inputErrorClasses = "border-red-500 focus:ring-red-500 bg-red-50";
   const inputValidClasses = "border-gray-300 hover:border-gray-400";


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Animated background patterns (kept as is) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* ... background divs ... */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Changed container structure slightly for better centering */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-between relative z-10">
        {/* Left Panel - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block w-1/2 max-w-lg" // Added max-w
        >
          <div className="p-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-5">Join the <span className="text-blue-600">BookExchange</span> Community</h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
              Share your textbooks, discover new reads, and connect with fellow students. Let's make learning more sustainable and accessible, together. 📚✨
            </p>
            <div className="flex space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                 {/* Replaced SVG */}
                <HiOutlineBookOpen className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <div className="p-3 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                 {/* Replaced SVG */}
                <HiOutlineUsers className="w-7 h-7 text-purple-600" aria-hidden="true" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/2 max-w-md" // Consistent max-width
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/20">
            <div className="text-center">
              {/* Logo */}
              <motion.div
                className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              >
                 {/* Replaced SVG */}
                <HiOutlineUserPlus className="h-7 w-7 sm:h-8 sm:h-8 text-white" aria-hidden="true"/>
              </motion.div>
              {/* Titles */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Your Account</h1>
              <p className="mt-1 text-sm text-gray-600">Let's get you started!</p>
            </div>

             {/* General API Error Message */}
            <AnimatePresence>
              {apiError && (
                  <motion.div
                  key="api-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200 flex items-center gap-2"
                  role="alert"
                  >
                  <HiXCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{apiError}</span>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Progress Steps Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <React.Fragment key={i}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                      <span className="text-sm font-medium">{i}</span>
                    </div>
                    {i < 3 && (
                      <div className={`h-0.5 flex-1 rounded transition-colors duration-300 ${step > i ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Form Steps Content */}
              <AnimatePresence mode="wait">
                {/* Step 1: Name & Email */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    {/* Full Name Input */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <HiOutlineUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          className={`${inputBaseClasses} ${!validationState.fullName.isValid ? inputErrorClasses : inputValidClasses}`}
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          aria-invalid={!validationState.fullName.isValid}
                          aria-describedby={!validationState.fullName.isValid ? "fullName-error" : undefined}
                        />
                      </div>
                      <AnimatePresence>
                         {!validationState.fullName.isValid && (
                             <motion.p key="fullName-error" id="fullName-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-600">{validationState.fullName.message}</motion.p>
                         )}
                      </AnimatePresence>
                    </div>
                    {/* Email Input */}
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
                           className={`${inputBaseClasses} ${!validationState.email.isValid ? inputErrorClasses : inputValidClasses}`}
                           placeholder="you@example.com"
                           value={formData.email}
                           onChange={handleChange}
                           aria-invalid={!validationState.email.isValid}
                           aria-describedby={!validationState.email.isValid ? "email-error" : undefined}
                         />
                      </div>
                       <AnimatePresence>
                         {!validationState.email.isValid && (
                             <motion.p key="email-error" id="email-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-600">{validationState.email.message}</motion.p>
                         )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Password & Phone */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                     {/* Password Input */}
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
                          autoComplete="new-password"
                          required
                          className={`${inputBaseClasses} pr-10 ${!validationState.password.isValid ? inputErrorClasses : inputValidClasses}`} // Added pr-10 for button space
                          placeholder="Create a password (min. 6 chars)"
                          value={formData.password}
                          onChange={handleChange}
                          aria-invalid={!validationState.password.isValid}
                           aria-describedby={!validationState.password.isValid ? "password-error" : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:z-10"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" aria-hidden="true"/> : <HiOutlineEye className="h-5 w-5" aria-hidden="true"/>}
                        </button>
                      </div>
                       <AnimatePresence>
                         {!validationState.password.isValid && (
                             <motion.p key="password-error" id="password-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-600">{validationState.password.message}</motion.p>
                         )}
                      </AnimatePresence>
                    </div>
                    {/* Phone Number Input */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <HiOutlineDevicePhoneMobile className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel" // Use tel type
                            required
                            className={`${inputBaseClasses} ${!validationState.phoneNumber.isValid ? inputErrorClasses : inputValidClasses}`}
                            placeholder="e.g., 0501234567 or +972501234567" // Updated placeholder
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            aria-invalid={!validationState.phoneNumber.isValid}
                           aria-describedby={!validationState.phoneNumber.isValid ? "phoneNumber-error" : undefined}
                          />
                       </div>
                       <AnimatePresence>
                         {!validationState.phoneNumber.isValid && (
                             <motion.p key="phoneNumber-error" id="phoneNumber-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-600">{validationState.phoneNumber.message}</motion.p>
                         )}
                      </AnimatePresence>
                       {/* Removed specific format instruction, relying on validation */}
                      {/* <p className="mt-1 text-xs text-gray-500">Format: 972 followed by phone number without leading 0</p> */}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Location */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="preferredExchangeLocation" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Preferred Exchange Location
                      </label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineMapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                         </div>
                        <select
                          id="preferredExchangeLocation"
                          name="preferredExchangeLocation"
                          required
                          // Adjusted select styling for icon padding
                          className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/60 hover:bg-white ${!validationState.preferredExchangeLocation.isValid ? inputErrorClasses : inputValidClasses} ${formData.preferredExchangeLocation ? 'text-gray-900' : 'text-gray-400'}`} // Show placeholder color if no value
                          value={formData.preferredExchangeLocation}
                          onChange={handleChange}
                           aria-invalid={!validationState.preferredExchangeLocation.isValid}
                           aria-describedby={!validationState.preferredExchangeLocation.isValid ? "location-error" : undefined}
                        >
                          <option value="" disabled>Select a campus</option> {/* Disabled placeholder */}
                          {campusLocations.map(location => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                           {/* Replaced SVG */}
                          <HiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                      <AnimatePresence>
                         {!validationState.preferredExchangeLocation.isValid && (
                             <motion.p key="location-error" id="location-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-600">{validationState.preferredExchangeLocation.message}</motion.p>
                         )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4"> {/* Added padding top */}
                {/* Previous Button */}
                <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400'}`} // Disabled styles
                    whileHover={step > 1 ? { scale: 1.03 } : {}}
                    whileTap={step > 1 ? { scale: 0.97 } : {}}
                  >
                     <HiArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true"/>
                     Previous
                  </motion.button>

                 {/* Next / Submit Button */}
                {step < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <HiArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true"/>
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-wait' : ''}`} // Changed color for final step
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={isLoading ? "Creating account..." : "Create account"}
                  >
                    {isLoading ? (
                      <>
                        <HiArrowPath className="animate-spin w-4 h-4 mr-2" aria-hidden="true"/>
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            {/* Link to Login */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150">
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