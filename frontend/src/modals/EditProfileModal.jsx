import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiLockClosed,
  HiCheck,
  HiEye,
  HiEyeOff,
  HiKey
} from 'react-icons/hi';
import { motion } from 'framer-motion';

// Modal for editing user profile details
const EditProfileModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredExchangeLocation: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load user data into the form when it changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        preferredExchangeLocation: user.preferredExchangeLocation || '',
        password: ''
      });
    }
  }, [user]);

  // Save the updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        id: user.id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        preferredExchangeLocation: formData.preferredExchangeLocation
      };
      
      if (changePassword && formData.password && formData.password.trim() !== '') {
        dataToSubmit.password = formData.password;
      }
      
      await onSave(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update form fields as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phoneNumber' ? (parseInt(value, 10) || null) : value
    }));
  };

  const campusLocations = [
    'Raanana Campus',
    'Tel Aviv Campus',
    'Jerusalem Campus',
    'Haifa Campus',
    'Beer Sheva Campus'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name input */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 flex items-center">
            <HiUser className="h-5 w-5 mr-2 text-blue-500" />
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Email input (locked) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
            <HiMail className="h-5 w-5 mr-2 text-blue-500" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
            disabled
          />
        </div>

        {/* Phone number input */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 flex items-center">
            <HiPhone className="h-5 w-5 mr-2 text-blue-500" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., 9721234567"
          />
          <p className="mt-1 text-xs text-gray-500">Format: 972 followed by phone number without leading 0</p>
        </div>

        {/* Campus location picker */}
        <div>
          <label htmlFor="preferredExchangeLocation" className="block text-sm font-medium text-gray-700 flex items-center">
            <HiLocationMarker className="h-5 w-5 mr-2 text-blue-500" />
            Preferred Exchange Location
          </label>
          <select
            id="preferredExchangeLocation"
            name="preferredExchangeLocation"
            required
            value={formData.preferredExchangeLocation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a campus</option>
            {campusLocations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle for changing password */}
        <div className="flex items-center">
          <input
            id="changePassword"
            name="changePassword"
            type="checkbox"
            checked={changePassword}
            onChange={() => setChangePassword(!changePassword)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-700 flex items-center">
            <HiLockClosed className="h-5 w-5 mr-2 text-blue-500" />
            Change Password
          </label>
        </div>

        {/* Password input (shows if toggled) */}
        {changePassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
              <HiKey className="h-5 w-5 mr-2 text-blue-500" />
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required={changePassword}
                value={formData.password || ''}
                onChange={handleChange}
                className="block w-full pr-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
          </motion.div>
        )}

        {/* Buttons to save or cancel */}
        <motion.div 
          className="mt-5 sm:mt-6 flex justify-end space-x-3"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <HiCheck className="h-4 w-4 mr-1.5" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;