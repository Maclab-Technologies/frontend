"use client";

import { useState } from "react";
import SideNav from "./_components/SideNav";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Side Navigation with Mobile Overlay */}
          <div className={`
            fixed inset-0 z-50 lg:relative lg:inset-auto
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 transition-transform duration-300 ease-in-out
          `}>
            <SideNav onClose={() => setSidebarOpen(false)} />
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