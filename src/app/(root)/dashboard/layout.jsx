// app/dashboard/layout.jsx
"use client";

import { useState } from "react";
import SideNav from "./_components/SideNav";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Side Navigation with Mobile Overlay */}
          <div className={`
            fixed inset-0 z-50 lg:relative lg:inset-auto
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 transition-transform duration-300 ease-in-out
          `}>
            <SideNav onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>

          {/* Main Content Area */}
          <main className="flex-1 lg:ml-0 min-w-0">
            {children}
          </main>
        </div> 
      </div>
    </div>
  );
}