import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Redirect to appropriate dashboard if the user is authenticated
  if (isAuthenticated) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />; // User dashboard
    }
  }

  // If not authenticated, allow access to the public route
  return children;
};

export default PublicRoute;
