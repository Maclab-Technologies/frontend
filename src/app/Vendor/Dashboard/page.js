"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseconfig";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    completedOrders: 0,
    earnings: 0,
  });
  const [businessName, setBusinessName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const router = useRouter();

  // Sample orders data
  const [orders, setOrders] = useState([
    { id: "#12345", customer: "John Doe", date: "2023-05-15", amount: "$45.99", status: "Completed" },
    { id: "#12346", customer: "Jane Smith", date: "2023-05-14", amount: "$29.99", status: "Processing" },
    { id: "#12347", customer: "Robert Johnson", date: "2023-05-14", amount: "$89.99", status: "Shipped" },
    { id: "#12348", customer: "Emily Davis", date: "2023-05-13", amount: "$15.99", status: "Completed" },
    { id: "#12349", customer: "Michael Wilson", date: "2023-05-12", amount: "$120.99", status: "Completed" },
  ]);

  // Sample products data
  const [products, setProducts] = useState([
    { id: "PRD-001", name: "Premium T-Shirt", price: "$24.99", stock: 142, status: "Active", image: "/placeholder-product.jpg" },
    { id: "PRD-002", name: "Art Print", price: "$19.99", stock: 87, status: "Active", image: "/placeholder-product.jpg" },
    { id: "PRD-003", name: "Mug", price: "$12.99", stock: 0, status: "Out of Stock", image: "/placeholder-product.jpg" }
  ]);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Check for business name in multiple possible locations
        const storedBusinessName = 
          user.displayName || 
          localStorage.getItem("businessName") || 
          "Your Business";
        setBusinessName(storedBusinessName);
        
        fetchVendorData(user.uid);
      } else {
        router.push("/Vendor/Login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchVendorData = async (vendorId) => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setStats({
          totalSales: 1245,
          pendingOrders: 8,
          completedOrders: 42,
          earnings: 8960,
        });
      }, 500);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("businessName");
      toast.success("Logged out successfully");
      router.push("/Vendor/Login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Update Firebase display name
      await updateProfile(auth.currentUser, {
        displayName: businessName
      });
      
      // Update local storage
      localStorage.setItem("businessName", businessName);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Add password change logic here
    toast.success("Password changed successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleProductAction = (action, productId) => {
    if (action === "delete") {
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    } else {
      // Handle edit action
      toast.info("Edit product functionality coming soon");
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {[
        { title: "Total Sales", value: stats.totalSales, icon: "💰", trend: "↑ 12% from last month", trendColor: "text-green-600" },
        { title: "Pending Orders", value: stats.pendingOrders, icon: "🔄", trend: "↓ 5% from last month", trendColor: "text-red-600" },
        { title: "Completed Orders", value: stats.completedOrders, icon: "✅", trend: "↑ 24% from last month", trendColor: "text-green-600" },
        { title: "Total Earnings", value: `$${stats.earnings.toLocaleString()}`, icon: "💳", trend: "↑ 18% from last month", trendColor: "text-green-600" }
      ].map((stat, index) => (
        <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl md:text-2xl">
              {stat.icon}
            </div>
          </div>
          <div className={`mt-2 md:mt-4 text-xs md:text-sm ${stat.trendColor}`}>
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSalesChart = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h3>
      <div className="h-48 md:h-64 bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Sales chart will appear here</p>
      </div>
    </div>
  );

  const renderRecentOrders = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
        <button 
          onClick={() => setActiveTab("orders")}
          className="text-xs md:text-sm text-yellow-600 hover:text-yellow-500"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{order.customer}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{order.date}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{order.amount}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "Completed" ? "bg-green-100 text-green-800" :
                    order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Your Products</h3>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium">
          Add New Product
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                      <img className="rounded-md" src={product.image} alt={product.name} />
                    </div>
                    <div className="ml-2 md:ml-4">
                      <div className="text-xs md:text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs md:text-sm text-gray-500">#{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{product.price}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{product.stock}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === "Active" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                  <button 
                    onClick={() => handleProductAction("edit", product.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-2 md:mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleProductAction("delete", product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">59Minutes Vendor</h1>
        <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-medium">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative z-50 w-64 h-full bg-white shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">59Minutes Vendor</h1>
                <p className="text-sm text-gray-500">
                  {businessName || user?.email}
                </p>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  {["dashboard", "products", "orders", "earnings", "settings"].map((tab) => (
                    <li key={tab}>
                      <button
                        onClick={() => {
                          setActiveTab(tab);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md capitalize ${
                          activeTab === tab ? "bg-yellow-100 text-yellow-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {tab}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">59Minutes Vendor</h1>
            <p className="text-sm text-gray-500">
              {businessName || user?.email}
            </p>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {["dashboard", "products", "orders", "earnings", "settings"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-2 rounded-md capitalize ${
                      activeTab === tab ? "bg-yellow-100 text-yellow-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
              {activeTab === "dashboard" ? "Vendor Dashboard" : activeTab}
            </h2>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-1 md:p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <>
              {renderStatsCards()}
              {renderSalesChart()}
              {renderRecentOrders()}
            </>
          )}

          {activeTab === "products" && renderProductsTab()}

          {activeTab === "orders" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">All Orders</h3>
              {renderRecentOrders()}
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Earnings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-sm md:text-md font-medium text-gray-700 mb-2">This Month</h4>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">$1,245</p>
                  <p className="text-xs md:text-sm text-green-600 mt-2">↑ 12% from last month</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-sm md:text-md font-medium text-gray-700 mb-2">Last Month</h4>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">$1,112</p>
                  <p className="text-xs md:text-sm text-green-600 mt-2">↑ 8% from previous</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-sm md:text-md font-medium text-gray-700 mb-2">Total Earnings</h4>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">${stats.earnings.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-green-600 mt-2">All time earnings</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4 md:mb-6">Account Settings</h3>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-sm md:text-md font-medium text-gray-700 mb-2 md:mb-3">Profile Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={user?.email || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your business name"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm md:text-md font-medium text-gray-700 mb-2 md:mb-3">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}