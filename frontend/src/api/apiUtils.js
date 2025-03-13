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
  return decodedToken?.userId || null;
};

/**
 * Create headers for API requests including authentication
 * @param {boolean} includeContentType Whether to include Content-Type header
 * @returns {Headers} Headers object with authentication
 */
export const createHeaders = (includeContentType = true) => {
  const headers = new Headers();
  
  // Add authentication header if token exists
  const token = getAuthToken();
  if (token) {
    // Ensure token is sent with 'Bearer ' prefix as required by backend
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  // Add content type for JSON requests
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
  
  // Set up default options with authentication
  const defaultOptions = {
    headers: createHeaders(options.body !== undefined),
  };
  
  // Merge default options with provided options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: options.headers 
      ? new Headers({...Object.fromEntries(defaultOptions.headers), ...options.headers})
      : defaultOptions.headers
  };
  
  // Convert body to JSON string if it's an object
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error ${response.status}: ${response.statusText}`);
    }
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return response.text();
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
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
  
  // Redirect to login page
  window.location.href = '/login';
};
