// Import React to use lazy and Suspense features
import React, { Suspense } from 'react';
// Import Routes, Route and Navigate components from react-router-dom
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Use React.lazy to dynamically import page components for code splitting
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Leads = React.lazy(() => import('../pages/Leads'));
const Pipeline = React.lazy(() => import('../pages/Pipeline'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// ProtectedRoute checks if user is logged in
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">Loading session...</div>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Define a fallback component to show while the lazy-loaded components are fetching
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">Loading...</div>
  </div>
);

// Define the AppRoutes component which contains all route definitions
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Export the AppRoutes component to be used in App.jsx
export default AppRoutes;
