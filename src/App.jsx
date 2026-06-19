import React, { useState } from "react";
import { BrowserRouter } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/index';
import Sidebar from './components/Sidebar';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* 
        Outer wrapper: On ultra-wide screens (>1440px), center the application.
        Provides a distinct background outside the app bounds.
      */}
      <div className="min-h-screen bg-black dark:bg-slate-200/50 w-full flex justify-center items-center">
        
        {/* 
          Inner app container: 
          - Fluid up to 1440px.
          - On extra large screens, it locks to 1440px width and centers.
          - `transform-gpu` establishes a local containing block so `fixed` 
            elements (Sidebar, bottom nav) stick to THIS container, not the browser window.
          - `h-screen overflow-hidden` prevents double-scrollbars and ensures 
            fixed elements behave correctly at the bottom.
        */}
        <div className="flex h-screen w-full max-w-[1440px] bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 transition-colors duration-500 font-sans transform-gpu relative 2xl:shadow-2xl 2xl:ring-1 2xl:ring-gray-800 2xl:dark:ring-slate-200 overflow-hidden">
          <Toaster position="top-right" />
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />

          {/* 
            Main content wrapper
            Mobile: no left margin
            Tablet: ml-20 to clear icon sidebar
            Desktop: ml-64 to clear full sidebar
          */}
          <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-20 lg:ml-64 h-full">
            
            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-800 dark:bg-white border-b border-gray-700 dark:border-slate-200 z-30 shadow-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Startup CRM</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 hover:bg-gray-700 dark:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>
    </BrowserRouter>
  );
}

export default App;
