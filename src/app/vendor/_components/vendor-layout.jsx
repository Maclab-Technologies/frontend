// vendor/components/vendor-layout.jsx
"use client";

import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaPlus,
  FaMoneyBillWave,
  FaWallet,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaBell,
  FaStore,
} from "react-icons/fa";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function VendorLayout({ children }) {
  const { authVendor, logoutVendor } = useContext(VendorAuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigationItems = [
    { key: "dashboard", label: "Dashboard", icon: FaHome, path: "/vendor/dashboard" },
    { key: "orders", label: "Orders", icon: FaClipboardList, path: "/vendor/order" },
    { key: "create-product", label: "Create Product", icon: FaPlus, path: "/vendor/create-product" },
    { key: "manage-products", label: "Manage Products", icon: FaBoxOpen, path: "/vendor/manage-products" },
    { key: "earnings", label: "Earnings", icon: FaMoneyBillWave, path: "/vendor/earnings" },
    { key: "withdraw", label: "Withdraw", icon: FaWallet, path: "/vendor/withdraw" },
  ];

  const handleLogout = () => {
    logoutVendor();
    router.push("/vendor/login");
  };

  const isActive = (path) => pathname === path;

  const getPageTitle = () => {
    const currentPath = navigationItems.find(item => item.path === pathname);
    if (currentPath) {
      return currentPath.label;
    }
    
    // Handle nested routes like order details
    if (pathname.includes('/orders/')) {
      return "Order Details";
    }
    
    return "Dashboard";
  };

  const getPageDescription = () => {
    const currentPath = navigationItems.find(item => item.path === pathname);
    if (currentPath) {
      switch(currentPath.key) {
        case 'dashboard':
          return "Overview of your store performance";
        case 'orders':
          return "Manage and track customer orders";
        case 'create-product':
          return "Add new products to your store";
        case 'manage-products':
          return "Edit and manage your product catalog";
        case 'earnings':
          return "Track your revenue and commissions";
        case 'withdraw':
          return "Withdraw your earnings to your bank";
        default:
          return "Manage your store and track performance";
      }
    }
    return "Manage your store and track performance";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg z-50 p-4 border-b border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <FaBars size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <FaStore className="text-black text-sm" />
              </div>
              <h1 className="text-white font-bold text-lg">Vendor Hub</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200 relative">
              <FaBell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 
              w-80 max-w-[85vw] bg-gray-800/95 backdrop-blur-lg shadow-2xl 
              transform transition-transform duration-300 ease-in-out
              ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 lg:static lg:w-64
              mt-16 lg:mt-0 border-r border-gray-700
            `}
          >
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-4 right-4">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-700 lg:border-t-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUser className="text-black text-lg" />
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="font-bold text-white truncate text-lg">
                    {authVendor?.businessName || "Guest Vendor"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {authVendor?.businessEmail || "vendor@59minutesprints.com"}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 h-[calc(100%-120px)] overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map(({ key, label, icon: Icon, path }) => (
                  <button
                    key={key}
                    onClick={() => {
                      router.push(path);
                      setMobileNavOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-4 text-base rounded-xl 
                      transition-all duration-300 group relative
                      ${
                        isActive(path)
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold shadow-lg shadow-yellow-400/25"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-lg"
                      }
                    `}
                  >
                    <span className={`mr-4 text-lg transition-transform duration-300 ${
                      isActive(path) ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <Icon />
                    </span>
                    <span className="text-left font-medium">{label}</span>
                    
                    {isActive(path) && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-4 text-base rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
                >
                  <span className="mr-4 text-lg group-hover:scale-110 transition-transform duration-300">
                    <FaSignOutAlt />
                  </span>
                  <span className="text-left font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white capitalize">
                  {getPageTitle()}
                </h2>
                <p className="text-gray-400 mt-2">
                  {getPageDescription()}
                </p>
              </div>
              
              {/* Desktop Header Actions */}
              <div className="flex items-center space-x-4">
                <button className="p-3 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200 relative">
                  <FaBell size={18} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
                </button>
                
                <div className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <FaUser className="text-black text-sm" />
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">
                      {authVendor?.businessName?.split(" ")[0] || "Vendor"}
                    </p>
                    <p className="text-gray-400 text-xs">Store Owner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Header for active tab */}
            <div className="lg:hidden mb-6">
              <h2 className="text-2xl font-bold text-white capitalize mb-2">
                {getPageTitle()}
              </h2>
              <p className="text-gray-400 text-sm">
                {getPageDescription()}
              </p>
            </div>

            {/* Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}