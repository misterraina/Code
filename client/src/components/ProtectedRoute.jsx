import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // If not authenticated or role doesn't match allowed roles, redirect to login
  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
