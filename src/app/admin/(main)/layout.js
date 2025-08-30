"use client";

import SideNav from "./_components/UI/sidenav";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main layout container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SideNav />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Content wrapper with proper spacing */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
