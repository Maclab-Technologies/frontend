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
    earnings: 1000,
  });
  const [businessName, setBusinessName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [withdrawal, setWithdrawal] = useState({
    accountName: "",
    accountNumber: "",
    bank: "",
    mode: "daily",
  });
  const [savedEarningsDuration, setSavedEarningsDuration] = useState("2 months");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    material: "",
    color: ""
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
        const storedBusinessName = user.displayName || localStorage.getItem("businessName") || "Your Business";
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

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (newProduct.images.length > 5) {
      toast.error("Please upload a maximum of 5 images.");
      return;
    }

    const product = {
      id: `PRD-${new Date().getTime()}`,
      name: newProduct.name,
      description: newProduct.description,
      images: newProduct.images,
      price: newProduct.price,
      stock: newProduct.stock,
      material: newProduct.material,
      color: newProduct.color,
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      description: "",
      images: [],
      price: "",
      stock: "",
      material: "",
      color: ""
    });

    toast.success("Product added successfully!");
  };

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    toast.success(`Withdrawal submitted: Account Name: ${withdrawal.accountName}, Account Number: ${withdrawal.accountNumber}, Bank: ${withdrawal.bank}, Mode: ${withdrawal.mode}`);
    setWithdrawal({ accountName: "", accountNumber: "", bank: "", mode: "daily" });
  };

  const handleSaveEarnings = () => {
    toast.success(`Earnings saved for: ${savedEarningsDuration}`);
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
      await updateProfile(auth.currentUser, {
        displayName: businessName,
      });
      localStorage.setItem("businessName", businessName);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const renderCreateProductForm = () => (
    <form onSubmit={handleAddProduct} className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Product</h3>
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          id="productName"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="productDescription"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Images (max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files).slice(0, 5);
            setNewProduct({ ...newProduct, images: files });
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Price */}
      <div className="mt-4">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="productPrice"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Stock */}
      <div className="mt-4">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          id="productStock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Material */}
      <div className="mt-4">
        <label htmlFor="productMaterial" className="block text-sm font-medium text-gray-700">Material</label>
        <input
          type="text"
          id="productMaterial"
          value={newProduct.material}
          onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Color */}
      <div className="mt-4">
        <label htmlFor="productColor" className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="text"
          id="productColor"
          value={newProduct.color}
          onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2">
        Add Product
      </button>
    </form>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {[
        { title: "Total Sales", value: stats.totalSales, icon: "💰", trend: "↑ 12% from last month", trendColor: "text-green-600" },
        { title: "Pending Orders", value: stats.pendingOrders, icon: "🔄", trend: "↓ 5% from last month", trendColor: "text-red-600" },
        { title: "Completed Orders", value: stats.completedOrders, icon: "✅", trend: "↑ 24% from last month", trendColor: "text-green-600" },
        { title: "Total Earnings", value: `$${stats.earnings.toLocaleString()}`, icon: "💳", trend: "↑ 18% from last month", trendColor: "text-green-600" }
      ].map((stat, index) => (
        <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl md:text-2xl text-black">
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
        <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-medium rounded-full">This Month</span>
      </div>
      <div className="h-48 md:h-64 bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Sales chart will appear here</p>
      </div>
    </div>
  );

  const renderRecentOrders = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
        <button 
          onClick={() => setActiveTab("orders")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium transition-colors"
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
                    order.status === "Processing" ? "bg-yellow-400 text-black" :
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">59Minutes Vendor</h1>
        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md border-b border-gray-200 p-4">
          <nav>
            <ul className="space-y-1">
              {["dashboard", "products", "orders", "withdrawal", "earnings", "save-earnings", "settings"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false); // Close menu after selection
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md capitalize font-medium ${
                      activeTab === tab 
                        ? "bg-yellow-400 text-black shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white shadow-md h-screen sticky top-0 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">59Minutes Vendor</h1>
            <p className="text-sm text-gray-500">{businessName || user?.email}</p>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {["dashboard", "products", "orders", "withdrawal", "earnings", "save-earnings", "settings"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-md capitalize font-medium ${
                      activeTab === tab 
                        ? "bg-yellow-400 text-black shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
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
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Render content based on active tab */}
          {activeTab === "dashboard" && (
            <>
              {renderStatsCards()}
              {renderSalesChart()}
              {renderRecentOrders()}
            </>
          )}
          
          {activeTab === "products" && renderProductsTab()}

          {activeTab === "orders" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-gray-800">All Orders</h3>
              <p className="text-gray-500">All order details will be shown here.</p>
            </div>
          )}

          {activeTab === "withdrawal" && renderWithdrawalTab()}

          {activeTab === "earnings" && renderEarningsReportTab()}

          {activeTab === "save-earnings" && renderSavedEarningsTab()}

          {activeTab === "settings" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Account Settings</h3>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Password changed successfully"); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md py-2">
                  Change Password
                </button>
              </form>
              <div className="mt-4">
                <button 
                  onClick={handleSaveProfile} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-md py-2"
                >
                  Update Business Name
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}