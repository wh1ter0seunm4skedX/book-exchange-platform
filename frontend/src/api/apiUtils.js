/**
 * API utilities for making authenticated requests to the backend
 */

// Base URL for all API requests
const API_BASE_URL = 'http://localhost:8080';

/**
 * Get the authentication token from local storage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => localStorage.getItem('token');

/**
 * Get the current user ID from local storage
 * @returns {string|null} The user ID or null if not found
 */
export const getCurrentUserId = () => localStorage.getItem('userId');

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => !!getAuthToken();

/**
 * Parse JWT token to get user information
 * @param {string} token JWT token
 * @returns {Object} Decoded token payload
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

/**
 * Get the user ID from the JWT token
 * @returns {number|null} User ID from token or null if not found
 */
export const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const decodedToken = parseJwt(token);
  // The 'sub' claim in JWT typically contains the user ID
  // Adjust this based on your backend JWT structure
  return decodedToken?.sub ? parseInt(decodedToken.sub, 10) : null;
};

/**
 * Create headers for API requests including authentication
 * @param {boolean} includeContentType Whether to include Content-Type header
 * @returns {Headers} Headers object with authentication
 */
export const createHeaders = (includeContentType = true) => {
  const headers = new Headers();
  const token = getAuthToken();
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  if (includeContentType) {
    headers.append('Content-Type', 'application/json');
  }
  
  return headers;
};

/**
 * Make an authenticated API request
 * @param {string} endpoint The API endpoint
 * @param {Object} options Request options
 * @returns {Promise<any>} The response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions = {
    headers: createHeaders(),
  };
  
  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: options.headers 
      ? { ...defaultOptions.headers, ...options.headers } 
      : defaultOptions.headers
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    // Parse JSON response if content exists
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  window.location.href = '/';
};
