import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ children, ...rest }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role !== 'admin') {
    // Redirect them to the home page if they are not an admin
    return <Navigate to="/" replace />;
  }

  return <Route {...rest}>{children}</Route>;
};

export default ProtectedRoute;
