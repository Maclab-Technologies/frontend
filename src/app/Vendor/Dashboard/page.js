"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseconfig";
import { onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
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
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [withdrawalInfo, setWithdrawalInfo] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    frequency: "daily",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    material: "",
    color: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();

  // Sample orders data
  const [orders, setOrders] = useState([]);
  // Sample products data
  const [products, setProducts] = useState([]);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const storedBusinessName = user.displayName || localStorage.getItem("businessName") || "Your Business Name";
        setBusinessName(storedBusinessName);
        setEmail(user.email); // Set user email
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
      setStats({
        totalSales: 2000,
        pendingOrders: 3,
        completedOrders: 10,
        earnings: 16000,
      });
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Unable to load dashboard data.");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
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
    resetNewProductForm();
    toast.success("Product added successfully!");
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      images: [],
      price: "",
      stock: "",
      material: "",
      color: "",
    });
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    toast.success(`Withdrawal request submitted for ${withdrawalInfo.accountName}`);
    resetWithdrawalInfo();
  };

  const resetWithdrawalInfo = () => {
    setWithdrawalInfo({ accountName: "", accountNumber: "", bankName: "", frequency: "daily" });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("businessName");
      toast.success("You've been logged out successfully.");
      router.push("/Vendor/Login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (businessName) {
        await updateProfile(auth.currentUser, { displayName: businessName });
        localStorage.setItem("businessName", businessName);
        toast.success("Business name updated successfully.");
      }

      if (email) {
        await updateEmail(auth.currentUser, email);
        toast.success("Email updated successfully.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use.");
      } else {
        toast.error("Failed to update profile.");
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordForm.newPassword === passwordForm.confirmPassword) {
        const userCredential = await auth.signInWithEmailAndPassword(user.email, passwordForm.currentPassword);
        await userCredential.user.updatePassword(passwordForm.newPassword);
        resetPasswordForm();
        toast.success("Password updated successfully.");
      } else {
        toast.error("New passwords do not match.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Check your current password.");
    }
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const renderCreateProductForm = () => (
    <form onSubmit={handleAddProduct} className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Product</h3>
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
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Upload Images (max 5)</label>
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
      <div className="mt-4">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price (in Naira)</label>
        <input
          type="number"
          id="productPrice"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <input
          type="number"
          id="productStock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="productMaterial" className="block text-sm font-medium text-gray-700">Material Type</label>
        <input
          type="text"
          id="productMaterial"
          value={newProduct.material}
          onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="productColor" className="block text-sm font-medium text-gray-700">Color Options</label>
        <input
          type="text"
          id="productColor"
          value={newProduct.color}
          onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2">
        Add Product
      </button>
    </form>
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

  // Check if loading
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
    <div className={`min-h-screen bg-gray-50 ${mobileMenuOpen ? 'overflow-hidden' : ''}`}>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed lg:relative w-64 bg-white shadow-md h-screen sticky top-0 border-r border-gray-200 transition-transform transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">59Minutes Vendor</h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {["dashboard", "products", "orders", "withdrawal", "earnings", "settings"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false); // Close mobile menu after tab selection
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md capitalize font-medium ${
                      activeTab === tab 
                        ? "bg-yellow-400 text-black shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
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

        {/* Content Area */}
        <div className={`flex-1 p-4 md:p-6 lg:p-8 transition-transform duration-300 ${mobileMenuOpen ? 'ml-64' : ''}`}>
          <div className="mb-6 md:mb-8 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Area
            </h2>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Overview Section */}
          {activeTab === "dashboard" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-gray-800">Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-blue-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Total Sales</h4>
                  <p className="text-lg font-bold text-gray-800">{stats.totalSales}</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Pending Orders</h4>
                  <p className="text-lg font-bold text-gray-800">{stats.pendingOrders}</p>
                </div>
                <div className="bg-yellow-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Completed Orders</h4>
                  <p className="text-lg font-bold text-gray-800">{stats.completedOrders}</p>
                </div>
                <div className="bg-red-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Earnings</h4>
                  <p className="text-lg font-bold text-gray-800">{stats.earnings}</p>
                </div>
              </div>
            </div>
          )}

          {/* Render content based on active tab */}
          {activeTab === "products" && renderCreateProductForm()}

          {activeTab === "orders" && renderRecentOrders()}

          {activeTab === "withdrawal" && (
            <form onSubmit={handleWithdrawSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-gray-800">Withdrawal Information</h3>
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                <input 
                  type="text"
                  id="accountName"
                  value={withdrawalInfo.accountName}
                  onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, accountName: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                <input 
                  type="text"
                  id="accountNumber"
                  value={withdrawalInfo.accountNumber}
                  onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, accountNumber: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input 
                  type="text"
                  id="bankName"
                  value={withdrawalInfo.bankName}
                  onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, bankName: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Withdrawal Frequency</label>
                <select 
                  id="frequency"
                  value={withdrawalInfo.frequency}
                  onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, frequency: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-md py-2">
                Submit Withdrawal Request
              </button>
            </form>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Account Settings</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-md py-2">
                  Update Profile
                </button>
              </form>
              <form onSubmit={handlePasswordChange} className="space-y-4 mt-8">
                <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
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
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2">
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}