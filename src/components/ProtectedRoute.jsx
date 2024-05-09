import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role !== 'admin') {
    // Redirect non-admin users to the home page
    return <Navigate to="/" replace />;
  }

  return children;  // Render children directly if the user is an admin
};

export default ProtectedRoute;
