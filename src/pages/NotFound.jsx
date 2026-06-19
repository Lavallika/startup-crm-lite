import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 md:p-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-100 dark:text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 min-h-[44px] flex items-center justify-center bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
