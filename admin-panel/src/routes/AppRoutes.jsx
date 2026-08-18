import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import AdminLogin from '../pages/auth/AdminLogin';
import AdminSignup from '../pages/auth/AdminSignup';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin Core Pages
import Dashboard from '../pages/admin/Dashboard';
import Students from '../pages/admin/Students';
import StudentProfile from '../pages/admin/StudentProfile';
import Lecturers from '../pages/admin/Lecturers';
import Faculties from '../pages/admin/Faculties';
import EmotionalAnalytics from '../pages/admin/EmotionalAnalytics';
import LearningResources from '../pages/admin/LearningResources';
import Announcements from '../pages/admin/Announcements';
import Settings from '../pages/admin/Settings';

// Security Shell & Components
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

// Centralized Layout for Administrative viewports
function AdminLayout({ pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="main-content">
        <Header title={pageTitle} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' }}>
        <LoadingSpinner size="40px" />
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC AUTHENTICATION PORTAL ROUTES */}
      <Route 
        path="/admin/login" 
        element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} 
      />
      <Route 
        path="/admin/signup" 
        element={!isAuthenticated ? <AdminSignup /> : <Navigate to="/admin/dashboard" replace />} 
      />
      <Route path="/admin/verify-email" element={<VerifyEmail />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

      {/* PROTECTED ADMINISTRATIVE ROUTES */}
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route element={<AdminLayout pageTitle="Dashboard" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<AdminLayout pageTitle="Student Directory" />}>
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/students/:id" element={<StudentProfile />} />
        </Route>

        <Route element={<AdminLayout pageTitle="Lecturer Directory" />}>
          <Route path="/admin/lecturers" element={<Lecturers />} />
        </Route>

        <Route element={<AdminLayout pageTitle="Faculties Directory" />}>
          <Route path="/admin/faculties" element={<Faculties />} />
        </Route>

        <Route element={<AdminLayout pageTitle="Well-being Analytics" />}>
          <Route path="/admin/emotions" element={<EmotionalAnalytics />} />
        </Route>

        <Route element={<AdminLayout pageTitle="Learning Materials" />}>
          <Route path="/admin/resources" element={<LearningResources />} />
        </Route>

        <Route element={<AdminLayout pageTitle="Announcement Board" />}>
          <Route path="/admin/announcements" element={<Announcements />} />
        </Route>

        <Route element={<AdminLayout pageTitle="System Settings" />}>
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* FALLBACK ROOT REDIRECTS */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
      />
    </Routes>
  );
}
