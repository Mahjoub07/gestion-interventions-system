import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interventions from './pages/Interventions';
import Technicians from './pages/Technicians';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasAnyRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasAnyRole(allowedRoles)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/interventions" element={<ProtectedRoute><Interventions /></ProtectedRoute>} />
    <Route path="/technicians" element={<ProtectedRoute><Technicians /></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />
    <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;
