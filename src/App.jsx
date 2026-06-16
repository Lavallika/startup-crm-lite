// Import React
import React from "react";
// Import BrowserRouter from react-router-dom to enable routing based on the browser's URL
import { BrowserRouter } from 'react-router-dom';
// Import the centralized routes component we created
import AppRoutes from './routes/index';
// Import the Sidebar component
import Sidebar from './components/Sidebar';

// Define the main App component
function App() {
  // Return the main application structure
  return (
    // Wrap the entire app with BrowserRouter to provide routing context
    <BrowserRouter>
      {/* Flex container to place sidebar and main content side-by-side */}
      <div className="flex min-h-screen bg-gray-50 font-sans">
        {/* Render the Sidebar fixed on the left */}
        <Sidebar />
        
        {/* Main content area takes remaining space, with a left margin to accommodate the fixed 64 (16rem) wide sidebar */}
        <main className="flex-1 ml-64 p-8">
          {/* Render the current route's corresponding component here */}
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

// Export the App component as the default export
export default App;
