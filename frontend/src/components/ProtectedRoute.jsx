import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/apiUtils';

// Locks a route behind authentication, sends unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Kick them to the login page if they're not signed in
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;