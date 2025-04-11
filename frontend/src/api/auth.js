// Handy functions for user auth
import { apiRequest } from './apiUtils';

export const authApi = {
  // Sign up a new user
  register: async (userData) => {
    return apiRequest('/book_exchange_platform/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Log in a user
  login: async (credentials) => {
    const response = await apiRequest('/book_exchange_platform/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Save login info to local storage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('email', response.email);
    }
    
    return response;
  }
};