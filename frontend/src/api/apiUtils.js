// Base URL for talking to the backend
const API_BASE_URL = 'http://localhost:8080';

// Grab the auth token from local storage
export const getAuthToken = () => localStorage.getItem('token');

// Get the current user’s ID
export const getCurrentUserId = () => localStorage.getItem('userId');

// Check if the user’s logged in
export const isAuthenticated = () => !!getAuthToken();

// Decode a JWT token to see what’s inside
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
    console.error('Trouble decoding JWT:', error);
    return null;
  }
};

// Pull the user ID from the token
export const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  const decodedToken = parseJwt(token);
  return decodedToken?.userId || null;
};

// Set up headers for API calls
export const createHeaders = (includeContentType = true) => {
  const headers = new Headers();
  const token = getAuthToken();
  if (token) headers.append('Authorization', `Bearer ${token}`);
  if (includeContentType) headers.append('Content-Type', 'application/json');
  return headers;
};

// Make a request to the API
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = { headers: createHeaders(options.body !== undefined) };
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: options.headers 
      ? new Headers({...Object.fromEntries(defaultOptions.headers), ...options.headers})
      : defaultOptions.headers
  };

  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error ${response.status}: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return response.text();
    }
    return await response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// Log the user out
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  window.location.href = '/login';
};