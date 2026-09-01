import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Public Pages
import { AuthPage } from '../pages/public/AuthPage';
import { TVQueueDisplay } from '../pages/public/TVQueueDisplay';

// Doctor Pages
import { ConsultationRoom } from '../pages/doctor/ConsultationRoom';
import { PrescriptionBuilder } from '../pages/doctor/PrescriptionBuilder';
import { DoctorSchedule } from '../pages/doctor/DoctorSchedule';

// Receptionist Pages
import { WalkInRegistration } from '../pages/reception/WalkInRegistration';
import { QueueManager } from '../pages/reception/QueueManager';

// Patient Pages
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { BookAppointment } from '../pages/patient/BookAppointment';
import { MyPrescriptions } from '../pages/patient/MyPrescriptions';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { DoctorManagement } from '../pages/admin/DoctorManagement';
import { PatientManagement } from '../pages/admin/PatientManagement';
import { DeptManagement } from '../pages/admin/DeptManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/live-queue" element={<TVQueueDisplay />} />

      {/* Doctor Role Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]} />}>
        <Route path="/doctor/consultation" element={<ConsultationRoom />} />
        <Route path="/doctor/prescription" element={<PrescriptionBuilder />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      </Route>

      {/* Receptionist Role Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST, ROLES.ADMIN]} />}>
        <Route path="/reception/walk-in" element={<WalkInRegistration />} />
        <Route path="/reception/queue" element={<QueueManager />} />
      </Route>

      {/* Patient Role Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT, ROLES.ADMIN]} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/prescriptions" element={<MyPrescriptions />} />
      </Route>

      {/* Admin Role Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<DoctorManagement />} />
        <Route path="/admin/patients" element={<PatientManagement />} />
        <Route path="/admin/departments" element={<DeptManagement />} />
      </Route>

      {/* Fallback to Consultation Room or Login */}
      <Route path="/" element={<Navigate to="/doctor/consultation" replace />} />
      <Route path="*" element={<Navigate to="/doctor/consultation" replace />} />
    </Routes>
  );
};
