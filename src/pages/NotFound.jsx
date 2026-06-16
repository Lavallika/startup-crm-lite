// Import Link component for navigation back to home
import { Link } from 'react-router-dom';

// NotFound functional component for 404 routes
const NotFound = () => {
  // Return JSX for the 404 page
  return (
    // Main container centered vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      {/* Large 404 text */}
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      {/* Title text for not found */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
      {/* Description text explaining the error */}
      <p className="text-gray-600 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      {/* Link to navigate back to the Dashboard */}
      <Link 
        to="/" 
        // Styling for the button
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

// Export the component as default for lazy loading
export default NotFound;
