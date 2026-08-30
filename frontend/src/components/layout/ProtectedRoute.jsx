import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header, Sidebar } from './AppLayout';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their default page based on role
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
