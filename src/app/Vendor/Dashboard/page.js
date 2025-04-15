"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaBox, FaUpload, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUser, FaFile, FaShoppingCart } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Mock Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load user data and initial content
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/Auth/Login");
      } else {
        setUser(user);
        // Load mock data
        loadMockData();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadMockData = () => {
    setProducts([
      { id: 1, name: "Business Cards", stock: 100, price: 45.99 },
      { id: 2, name: "Flyers", stock: 250, price: 75.00 },
      { id: 3, name: "Posters", stock: 50, price: 150.00 },
    ]);
    setOrders([
      { id: "ORD-1001", date: "2023-06-15", status: "Completed", total: "$125.99" },
      { id: "ORD-1002", date: "2023-06-20", status: "Processing", total: "$89.50" }
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/Auth/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  // Tab components
  const tabs = {
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.displayName || "Vendor"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Quick overview of your products and orders</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBox className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Products</p>
                  <p className="text-xl font-bold text-white">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaShoppingCart className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Orders</p>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <p className={`font-bold ${order.status === "Completed" ? "text-green-400" : "text-yellow-400"}`}>{order.status}</p>
                <p className="text-sm">{order.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    
    // Placeholder for other tabs: My Products, Create Order, Settings
    "My Products": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>
        {/* Placeholder content for products */}
        {/* Logic to list / manage products goes here */}
      </div>
    ),

    "Create Order": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
        {/* Placeholder content for creating orders */}
        {/* Logic for order creation goes here */}
      </div>
    ),

    "Settings": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        {/* Placeholder content for settings */}
        {/* Logic for account settings goes here */}
      </div>
    )
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden mr-4 text-white focus:outline-none"
              >
                {mobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <h1 className="text-xl font-bold">
                <span className="text-yellow-400">59Minutes</span>Print
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm hover:text-yellow-400 transition"
              >
                <FaSignOutAlt className="mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 
            w-64 bg-gray-800 shadow-lg 
            transform transition-transform duration-300 ease-in-out rounded
            ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:relative lg:translate-x-0 lg:w-64
            mt-16 lg:mt-0
          `}>
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-2 right-2">
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
                  <p className="font-medium text-white truncate">{user?.displayName || 'Vendor'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
              {Object.keys(tabs).map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => {
                    setActiveTab(tabName);
                    setMobileNavOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                    transition-all duration-200
                    ${activeTab === tabName
                      ? 'bg-yellow-400 text-black font-bold shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-base">
                    {tabName === "Dashboard" && <FaHome />}
                    {tabName === "My Products" && <FaBox />}
                    {tabName === "Create Order" && <FaUpload />}
                    {tabName === "Settings" && <FaCog />}
                  </span>
                  <span className="text-left">{tabName}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-4 flex lg:hidden items-center">
              {mobileNavOpen && (
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center text-sm text-yellow-400 mr-4"
                >
                  <FaTimes className="mr-1" /> Close Menu
                </button>
              )}
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            </div>

            {tabs[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}