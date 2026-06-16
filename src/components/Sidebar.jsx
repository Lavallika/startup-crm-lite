// Import NavLink from react-router-dom for navigation with active state styling
import { NavLink } from 'react-router-dom';

// Define the Sidebar functional component
const Sidebar = () => {
  // Define a helper function to determine link classes based on active state
  const navLinkClass = ({ isActive }) => 
    // Block display, padding, rounding, and transition for sidebar items
    'block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 mb-2 ' +
    // Conditional classes: active vs inactive
    (isActive 
      ? 'bg-indigo-800 text-white' 
      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white');

  return (
    // Aside element fixed to the left taking full height
    <aside className="w-64 bg-indigo-600 shadow-md h-screen flex flex-col fixed left-0 top-0">
      {/* Brand logo/name container */}
      <div className="p-6">
        <span className="text-white font-bold text-2xl tracking-tight">Startup CRM</span>
      </div>
      {/* Navigation links container, scrollable if too many links */}
      <div className="flex-1 px-4 overflow-y-auto">
        <nav className="space-y-1">
          {/* NavLink for the Dashboard page */}
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          {/* NavLink for the Lead Management page */}
          <NavLink to="/leads" className={navLinkClass}>
            Lead Management
          </NavLink>
          {/* NavLink for the Analytics page */}
          <NavLink to="/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

// Export the Sidebar component
export default Sidebar;
