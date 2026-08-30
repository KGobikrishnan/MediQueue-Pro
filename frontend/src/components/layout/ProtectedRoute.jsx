import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppLayout } from './AppLayout';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'DOCTOR':
        return <Navigate to="/doctor/consultation" replace />;
      case 'RECEPTIONIST':
        return <Navigate to="/reception/walk-in" replace />;
      case 'PATIENT':
        return <Navigate to="/patient/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/analytics" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return (
    <ErrorBoundary>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ErrorBoundary>
  );
};
