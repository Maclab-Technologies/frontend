"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaPlus,
  FaMoneyBillWave,
  FaWallet,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaBell,
} from "react-icons/fa";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import Dashboard from "../Components/dashboard";
import AddProduct from "../Components/create-product";
import ManageProducts from "../Components/manage-product";
import Earnings from "../Components/earning";
import Withdraw from "../Components/withdraw";
import Orders from "../Components/order";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function VendorDashboard() {
  const { vendorToken, authVendor, logoutVendor } = useContext(VendorAuthContext);
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [earningsStats, setEarningsStats] = useState({});
  const [summary, setSummary] = useState({});

  // Load user data and initial content
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (!vendorToken) {
          throw new Error("No token found");
        }
        let token = vendorToken;

        // Using batchRequests for parallel API calls
        const result = await batchRequests([
          {
            url: `/products/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/payments/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/payments/earnings/stats/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/payments/vendor/${authVendor.id}/summary`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
        ]);

        const [
          productsResult,
          ordersResult,
          earningsResult,
          earningStats,
          statsSummary,
        ] = result;

        // Handle products - no alerts
        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        }

        // Handle orders - no alerts
        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        }

        // Handle earnings - no alerts
        if (earningsResult.success) {
          setEarnings(earningsResult.data?.data || []);
        }

        // Handle earnings stats - no alerts
        if (earningStats.success) {
          setEarningsStats(earningStats.data?.data || {});
        }

        // Handle summary - no alerts
        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || {});
        }

      } catch (error) {
        console.error("Error loading initial data:", error);
        // No error alert
      } finally {
        setLoading(false);
      }
    };

    if (vendorToken && authVendor?.id) {
      loadInitialData();
    }
  }, [vendorToken, authVendor?.id]);

  const tabs = {
    dashboard: (
      <Dashboard
        vendorData={authVendor}
        orders={orders}
        products={products}
        summary={summary}
        loading={loading}
      />
    ),
    orders: <Orders orders={orders} loading={loading} />,
    addProduct: (
      <AddProduct products={products} setProducts={setProducts} />
    ),
    manageProduct: (
      <ManageProducts products={products} setProducts={setProducts} />
    ),
    earnings: (
      <Earnings
        earnings={earnings}
        earningsStats={earningsStats}
        loading={loading}
      />
    ),
    withdraw: (
      <Withdraw
        vendorData={authVendor}
        summary={summary}
        vendorToken={vendorToken}
      />
    ),
  };

  const handleLogout = () => {
    logoutVendor();
    router.push("/vendor/login");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Menu Toggle & Brand */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>

              {/* Brand */}
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 p-2 rounded-lg">
                  <FaBoxOpen className="text-black text-sm" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white">Vendor Dashboard</h1>
                  <p className="text-xs text-gray-400">59Minutes Prints</p>
                </div>
              </div>
            </div>

            {/* Center Section - Current Page Title */}
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
            </div>

            {/* Right Section - User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <FaBell size={18} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="User menu"
                >
                  <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
                    <FaUser className="text-yellow-400 text-sm" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">
                      {authVendor?.businessName || "Vendor"}
                    </p>
                    <p className="text-xs text-gray-400">Vendor Account</p>
                  </div>
                  <FaChevronDown 
                    className={`text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} 
                    size={12} 
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">
                        {authVendor?.businessName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {authVendor?.businessEmail}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <FaHome className="mr-3" size={14} />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("manageProduct");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <FaBoxOpen className="mr-3" size={14} />
                      Manage Products
                    </button>

                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="flex">
          {/* Side Navigation */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 
              w-64 bg-gray-800 shadow-xl 
              transform transition-transform duration-300 ease-in-out
              ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 lg:static lg:w-64
              mt-16 lg:mt-0
            `}
          >
            {/* Mobile Header */}
            <div className="lg:hidden p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Menu</h3>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700 lg:border-t-0">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
                  <FaUser className="text-yellow-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">
                    {authVendor?.businessName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {authVendor?.businessEmail || "Guest@59minutesprints.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2">
              {[
                { key: "dashboard", label: "Dashboard", icon: FaHome },
                { key: "orders", label: "Orders", icon: FaClipboardList },
                { key: "addProduct", label: "Create Product", icon: FaPlus },
                { key: "manageProduct", label: "Manage Products", icon: FaBoxOpen },
                { key: "earnings", label: "Earnings", icon: FaMoneyBillWave },
                { key: "withdraw", label: "Withdraw", icon: FaWallet },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setMobileNavOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm rounded-lg 
                    transition-all duration-200 group
                    ${
                      activeTab === key
                        ? "bg-yellow-400 text-black font-semibold shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <Icon 
                    className={`mr-3 text-base ${
                      activeTab === key ? "text-black" : "text-gray-400 group-hover:text-yellow-400"
                    }`} 
                  />
                  <span className="text-left">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-h-screen bg-gray-900">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Mobile Page Header */}
              <div className="lg:hidden mb-6">
                <h1 className="text-2xl font-bold text-white capitalize">
                  {activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your vendor account and products
                </p>
              </div>

              {/* Content */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                {tabs[activeTab]}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}