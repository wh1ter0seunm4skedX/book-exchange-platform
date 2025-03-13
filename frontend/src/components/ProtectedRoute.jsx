import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/apiUtils';

/**
 * A wrapper component that redirects to the login page if the user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
