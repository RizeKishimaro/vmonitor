
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.log("redirected")
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
