'use client';

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  FaChevronDown,
  FaBell,
  FaStore,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { batchRequests, post } from "@/app/_hooks/fetch-hook";
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

  // Check authentication on component mount
  useEffect(() => {
    if (!vendorToken || !authVendor?.id) {
      toast.error("Please login to access vendor dashboard");
      router.push("/vendor/login");
      return;
    }
  }, [vendorToken, authVendor, router]);

  // Load user data and initial content
  useEffect(() => {
    const loadInitialData = async () => {
      if (!vendorToken || !authVendor?.id) return;
      
      setLoading(true);
      try {
        let token = vendorToken;

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

        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        } else if (productsResult.data?.data?.length === 0) {
          console.log("No products found");
        } else if (productsResult._failed) {
          console.warn("Failed to fetch products");
        }

        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        } else if (ordersResult._failed) {
          console.warn("Failed to fetch orders");
        }

        if (earningsResult.success) {
          setEarnings(earningsResult.data?.data || []);
        } else if (earningsResult._failed) {
          console.warn("Failed to fetch earnings");
        }

        if (earningStats.success) {
          setEarningsStats(earningStats.data?.data || {});
        } else if (earningStats._failed) {
          console.warn("Failed to fetch earnings stats");
        }

        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || {});
        } else if (statsSummary._failed) {
          console.warn("Failed to fetch vendor summary");
        }

      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [vendorToken, authVendor]);

  const handleLogout = () => {
    logoutVendor();
    toast.success("Logged out successfully");
    router.push("/vendor/login");
  };

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
    orders: (
      <Orders orders={orders} loading={loading} />
    ),
    addProduct: (
      <AddProduct
        products={products}
        setProducts={setProducts}
        vendorToken={vendorToken}
        vendorId={authVendor?.id}
      />
    ),
    manageProduct: (
      <ManageProducts 
        products={products}
        setProducts={setProducts}
        vendorToken={vendorToken}
      />
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

  if (!vendorToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
          
          {/* Mobile User Menu */}
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
                      w-full flex items-center px-4 py-4 text-base rounded-xl 
                      transition-all duration-300 group relative
                      ${
                        activeTab === key
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold shadow-lg shadow-yellow-400/25"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-lg"
                      }
                    `}
                  >
                    <span className={`mr-4 text-lg transition-transform duration-300 ${
                      activeTab === key ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <Icon />
                    </span>
                    <span className="text-left font-medium">{label}</span>
                    
                    {/* Active indicator */}
                    {activeTab === key && (
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
                  {activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <p className="text-gray-400 mt-2">
                  Manage your store and track performance
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
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <p className="text-gray-400 text-sm">
                Manage your store on the go
              </p>
            </div>

            {/* Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 lg:p-8">
                {tabs[activeTab]}
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