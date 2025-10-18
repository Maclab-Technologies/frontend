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
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
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

        // Using batchRequests for parallel API calls
        const result = await batchRequests([
          {
            // Vendor Products
            url: `/products/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor orders
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor earnings
            url: `/payments/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor earnings stats
            url: `/payments/earnings/stats/${authVendor.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor stats summary
            url: `/payments/vendor/${authVendor.id}/summary`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
        ]);

        // Destructure results (batchRequests returns array in same order)
        const [
          productsResult,
          ordersResult,
          earningsResult,
          earningStats,
          statsSummary,
        ] = result;

        // Handle products
        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        } else if (productsResult.data?.data?.length === 0) {
          console.log("No products found");
        } else if (productsResult._failed) {
          console.warn("Failed to fetch products");
        }

        // Handle orders
        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        } else if (ordersResult._failed) {
          console.warn("Failed to fetch orders");
        }

        // Handle earnings
        if (earningsResult.success) {
          setEarnings(earningsResult.data?.data || []);
        } else if (earningsResult._failed) {
          console.warn("Failed to fetch earnings");
        }

        // Handle earnings stats
        if (earningStats.success) {
          setEarningsStats(earningStats.data?.data || {});
        } else if (earningStats._failed) {
          console.warn("Failed to fetch earnings stats");
        }

        // Handle vendor summary
        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || {});
        } else if (statsSummary._failed) {
          console.warn("Failed to fetch vendor summary");
        }

        // Check if any critical requests failed
        const criticalFailures = result.filter((r) => r._failed).length;
        if (criticalFailures > 0) {
          toast.warning(
            `${criticalFailures} requests failed. Some data may be incomplete.`
          );
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

  // If no vendor token, show loading
  if (!vendorToken) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 z-50 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-white font-bold text-lg">Vendor Dashboard</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside
            className={`
            fixed inset-y-0 left-0 z-40 
            w-64 bg-gray-800 shadow-lg 
            transform transition-transform duration-300 ease-in-out rounded
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64
            mt-14 lg:mt-0
          `}
          >
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-4 right-4">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
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
                    {authVendor?.businessName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {authVendor?.businessEmail || "vendor@59minutesprints.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
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
                    w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                    transition-all duration-200
                    ${
                      activeTab === key
                        ? "bg-yellow-400 text-black font-bold shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <span className="mr-3 text-base">
                    <Icon />
                  </span>
                  <span className="text-left">{label}</span>
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 mt-4"
              >
                <span className="mr-3 text-base">
                  <FaSignOutAlt />
                </span>
                <span className="text-left">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <FaBars size={20} />
              </button>
            </div>

            {/* Mobile Header for active tab */}
            <div className="lg:hidden mb-6">
              <h2 className="text-xl font-bold text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
            </div>

            {/* Content */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 lg:p-6">
              {tabs[activeTab]}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}