import React, { useState } from "react";
import { BrowserRouter } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AppRoutes from './routes/index';
import Sidebar from './components/Sidebar';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
        
        {/* Responsive Sidebar (handles mobile drawer, tablet narrow, desktop wide) */}
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />

        {/*
          Main content area:
          - Mobile: no left margin, padding-bottom to clear the fixed bottom nav, padding-top to clear the mobile top header
          - Tablet: ml-20 to clear the narrow icon sidebar (w-20)
          - Desktop: ml-64 to clear the full sidebar (w-64)
        */}
        <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-20 lg:ml-64">
          
          {/* Mobile Top Header */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Startup CRM</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 pb-20 md:pb-0">
            <AppRoutes />
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
