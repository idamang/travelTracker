import { useUser } from '@/context/useUser';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { user, loading, setUser } = useUser();
  const token = localStorage.getItem('authToken'); // Check for the token in localStorage

  if (loading) return null;

  // If no token or user, redirect to login and clear context
  if (!token || !user) {
    setUser(null); // Clear any stale user data from context
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
