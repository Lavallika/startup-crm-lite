import React, { useState } from "react";
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/index';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token, isLoading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">Loading CRM...</div>
      </div>
    );
  }

  // If on login/register pages, or not authenticated, render without sidebar and mobile top nav
  if (isAuthPage || !token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full flex items-center justify-center">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full max-w-[1680px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transform-gpu relative 2xl:shadow-2xl 2xl:ring-1 2xl:ring-gray-200 2xl:dark:ring-gray-800 overflow-hidden">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-20 lg:ml-64 h-full">
        
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Startup CRM</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 
        Outer wrapper: On ultra-wide screens (>1440px), center the application.
        Provides a distinct background outside the app bounds.
      */}
      <div className="min-h-screen bg-slate-200/50 dark:bg-black w-full flex justify-center items-center">
        <Toaster position="top-right" />
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
