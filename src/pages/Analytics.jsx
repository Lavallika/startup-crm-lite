// Analytics functional component
const Analytics = () => {
  // Return JSX for the Analytics page
  return (
    // Main container for the page content, with padding
    <div className="p-6">
      {/* Page title with text styling */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
      {/* A placeholder card for content */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        {/* Content description text */}
        <p className="text-gray-600">View detailed reports and charts analyzing your CRM data and performance metrics.</p>
      </div>
    </div>
  );
};

// Export the component as default for lazy loading
export default Analytics;
