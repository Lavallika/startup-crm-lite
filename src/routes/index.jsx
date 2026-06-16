// Import React to use lazy and Suspense features
import React, { Suspense } from 'react';
// Import Routes and Route components from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Use React.lazy to dynamically import page components for code splitting
// This improves initial load performance by only loading the code when the route is visited
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Leads = React.lazy(() => import('../pages/Leads'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Define a fallback component to show while the lazy-loaded components are fetching
// This is a simple loading text, but could be a spinner
const LoadingSpinner = () => (
  // Container to center the loading text
  <div className="flex items-center justify-center min-h-[50vh]">
    {/* Loading text styling */}
    <div className="text-lg font-medium text-gray-600 animate-pulse">Loading...</div>
  </div>
);

// Define the AppRoutes component which contains all route definitions
const AppRoutes = () => {
  // Return the JSX for routing
  return (
    // Suspense wraps the routes and provides the fallback UI during lazy loading
    <Suspense fallback={<LoadingSpinner />}>
      {/* Routes container to match the current URL with the defined Route components */}
      <Routes>
        {/* Route for the Dashboard at the root path '/' */}
        <Route path="/" element={<Dashboard />} />
        {/* Route for the Lead Management page at '/leads' */}
        <Route path="/leads" element={<Leads />} />
        {/* Route for the Analytics page at '/analytics' */}
        <Route path="/analytics" element={<Analytics />} />
        {/* Catch-all route ('*') to handle any undefined paths, showing the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Export the AppRoutes component to be used in App.jsx
export default AppRoutes;
