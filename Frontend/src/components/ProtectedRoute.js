import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is logged in

  if (!isAuthenticated) {
    alert('You must be logged in to access this page.');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
