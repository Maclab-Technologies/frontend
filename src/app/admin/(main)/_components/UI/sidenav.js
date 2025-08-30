"use client";
import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaTimes,
  FaUser,
  FaBars
} from "react-icons/fa";
import Navigation from "./navigation";
import { AdminAuthContext } from "../../_provider/useAdminProvider";

const SideNav = () => {
  const { authAdmin, isLoggedIn } = useContext(AdminAuthContext)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Get active tab from current path
  const getActiveTabFromPath = () => {
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/orders')) return 'orders';
    if (pathname.includes('/designs')) return 'designs';
    if (pathname.includes('/payments')) return 'payments';
    if (pathname.includes('/payouts')) return 'payouts';
    if (pathname.includes('/users')) return 'users';
    if (pathname.includes('/vendors')) return 'vendors';
    return 'dashboard';
  };

  // Handle navigation
  const handleNavigation = (tabKey) => {
    setMobileNavOpen(false);
    
    // For routing
    router.push(`/admin/${tabKey}`);
    
  };

  // if(!isLoggedIn) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg"
        aria-label="Toggle navigation menu"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay for mobile */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 
          w-64 bg-gray-800 shadow-lg 
          transform transition-transform duration-300 ease-in-out
          ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:relative lg:translate-x-0 lg:w-64 lg:shrink-0
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none rounded-md"
            aria-label="Close navigation menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
              <FaUser className="text-yellow-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-white truncate">
                {authAdmin?.businessName || "Admin User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {authAdmin?.businessEmail || "admin@59minutesprints.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <Navigation
          activeTab={getActiveTabFromPath()}
          onNavigate={handleNavigation}
          setMobileNavOpen={setMobileNavOpen}
        />
      </aside>
    </>
  );
};

export default SideNav;