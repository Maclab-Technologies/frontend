"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseconfig";
import { onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

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
    category: "",
    featured: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState({
    profile: false,
    product: false,
    withdrawal: false,
    password: false,
  });
  const [previewImages, setPreviewImages] = useState([]);

  const router = useRouter();

  // Sample orders data
  const [orders, setOrders] = useState([
    { id: "ORD-1001", customer: "John Doe", date: "2025-04-10", amount: "₦15,000", status: "Completed" },
    { id: "ORD-1002", customer: "Jane Smith", date: "2025-04-12", amount: "₦8,500", status: "Processing" },
    { id: "ORD-1003", customer: "Robert Johnson", date: "2025-04-13", amount: "₦12,700", status: "Pending" },
    { id: "ORD-1004", customer: "Alice Williams", date: "2025-04-14", amount: "₦5,200", status: "Completed" },
  ]);
  
  // Sample products data
  const [products, setProducts] = useState([
    { id: "PRD-1001", name: "Premium Leather Bag", price: "₦25,000", stock: 12, featured: true },
    { id: "PRD-1002", name: "Canvas Tote Bag", price: "₦8,000", stock: 25, featured: false },
    { id: "PRD-1003", name: "Messenger Bag", price: "₦15,500", stock: 8, featured: true },
  ]);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const storedBusinessName = user.displayName || localStorage.getItem("businessName") || "Your Business Name";
        setBusinessName(storedBusinessName);
        setEmail(user.email);
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
      // Simulating API call with a delay
      setTimeout(() => {
        setStats({
          totalSales: 2000,
          pendingOrders: 3,
          completedOrders: 10,
          earnings: 16000,
        });
      }, 800);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Unable to load dashboard data.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setNewProduct({ ...newProduct, images: files });
    
    // Create preview URLs for the selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, product: true });
    
    if (newProduct.images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      setIsLoading({ ...isLoading, product: false });
      return;
    }
    
    setTimeout(() => {
      const product = {
        id: `PRD-${new Date().getTime()}`,
        name: newProduct.name,
        description: newProduct.description,
        images: newProduct.images,
        price: `₦${parseFloat(newProduct.price).toLocaleString()}`,
        stock: parseInt(newProduct.stock),
        material: newProduct.material,
        color: newProduct.color,
        category: newProduct.category,
        featured: newProduct.featured,
      };
      
      setProducts([product, ...products]);
      resetNewProductForm();
      toast.success("Product added successfully!");
      setIsLoading({ ...isLoading, product: false });
    }, 1500);
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
      category: "",
      featured: false,
    });
    setPreviewImages([]);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, withdrawal: true });
    
    setTimeout(() => {
      toast.success(`Withdrawal request submitted for ${withdrawalInfo.accountName}`);
      resetWithdrawalInfo();
      setIsLoading({ ...isLoading, withdrawal: false });
    }, 1500);
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
      setIsLoading({ ...isLoading, profile: true });
      
      setTimeout(async () => {
        if (businessName) {
          await updateProfile(auth.currentUser, { displayName: businessName });
          localStorage.setItem("businessName", businessName);
        }

        if (email) {
          await updateEmail(auth.currentUser, email);
        }
        
        toast.success("Profile updated successfully.");
        setIsLoading({ ...isLoading, profile: false });
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use.");
      } else {
        toast.error("Failed to update profile.");
      }
      setIsLoading({ ...isLoading, profile: false });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, password: true });
    
    try {
      setTimeout(() => {
        if (passwordForm.newPassword === passwordForm.confirmPassword) {
          // Simulate password update
          resetPasswordForm();
          toast.success("Password updated successfully.");
        } else {
          toast.error("New passwords do not match.");
        }
        setIsLoading({ ...isLoading, password: false });
      }, 1500);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Check your current password.");
      setIsLoading({ ...isLoading, password: false });
    }
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    }
  };

  const handleToggleFeature = (productId) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, featured: !product.featured } : product
    ));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Product ${product.featured ? 'removed from' : 'marked as'} featured`);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by search query
    const matchesQuery = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = orderDate >= startDate && orderDate <= endDate;
    }
    
    return matchesQuery && matchesStatus && matchesDateRange;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{stats.totalSales.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">+14% from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2.5 py-0.5 rounded-full">Needs attention</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.completedOrders}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">+5% from last week</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{stats.earnings.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">+₦2,500 this week</span>
          </div>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Sales Performance</h3>
          <select className="text-sm border-gray-300 rounded-md">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Sales chart visualization would appear here</p>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 rounded-t-lg">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 3).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Products</h3>
        
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={() => {
              document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 10 ? "bg-green-100 text-green-800" :
                      product.stock > 5 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleToggleFeature(product.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        product.featured ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          product.featured ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="add-product-form" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                id="productCategory"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="bags">Bags</option>
                <option value="accessories">Accessories</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              id="productDescription"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Describe your product in detail"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
              




<div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price (₦)*</label>
                <input
                  type="number"
                  id="productPrice"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="productStock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity*</label>
                <input
                  type="number"
                  id="productStock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="productMaterial" className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  id="productMaterial"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Leather, Cotton, etc."
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="productColor" className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
              <input
                type="text"
                id="productColor"
                value={newProduct.color}
                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="e.g. Red, Blue, Black (comma separated)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (max 5)*</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="product-images"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="product-images" className="cursor-pointer flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 mt-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">(Max size: 5MB per image)</p>
                </label>
              </div>
              
              {previewImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 mb-2">Selected Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                        <img src={preview} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newPreviews = [...previewImages];
                            newPreviews.splice(index, 1);
                            setPreviewImages(newPreviews);
                            
                            const newImages = [...newProduct.images];
                            newImages.splice(index, 1);
                            setNewProduct({ ...newProduct, images: newImages });
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="featured-product"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
              />
              <label htmlFor="featured-product" className="ml-2 block text-sm text-gray-700">
                Mark as featured product
              </label>
            </div>
            
            <div className="md:col-span-3 mt-4">
              <button 
                type="submit" 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                disabled={isLoading.product}
              >
                {isLoading.product ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Orders</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Completed" ? "bg-green-100 text-green-800" :
                        order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Update Status"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    No orders found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWithdrawal = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Withdrawal Settings</h3>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Withdrawal Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your current available balance for withdrawal is <span className="font-bold">₦16,000</span>. All payments are processed within 24-48 hours of request.</p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name*</label>
              <input 
                type="text"
                id="accountName"
                value={withdrawalInfo.accountName}
                onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, accountName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter account holder name"
              />
            </div>
            
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number*</label>
              <input 
                type="text"
                id="accountNumber"
                value={withdrawalInfo.accountNumber}
                onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, accountNumber: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter 10-digit account number"
                maxLength={10}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name*</label>
              <select
                id="bankName"
                value={withdrawalInfo.bankName}
                onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, bankName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Select your bank</option>
                <option value="access">Access Bank</option>
                <option value="gtb">Guaranty Trust Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="first">First Bank</option>
                <option value="uba">UBA</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Frequency</label>
              <select 
                id="frequency"
                value={withdrawalInfo.frequency}
                onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, frequency: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="daily">Daily (when available)</option>
                <option value="weekly">Weekly (every Monday)</option>
                <option value="monthly">Monthly (1st of each month)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
              disabled={isLoading.withdrawal}
            >
              {isLoading.withdrawal ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Withdrawal Request'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Withdrawal History</h4>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">No previous withdrawals found.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Account Settings</h3>
        
        <div className="mb-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{businessName || "Your Business"}</h4>
              <p className="text-sm text-gray-500">{email || "email@example.com"}</p>
              <p className="text-xs text-gray-400 mt-1">Account created: April 2025</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4 pb-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            disabled={isLoading.profile}
          >
            {isLoading.profile ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </form>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Change Password</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            disabled={isLoading.password}
          >
            {isLoading.password ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
  <h4 className="text-md font-semibold text-gray-800 mb-4">Account Preferences</h4>
  
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <h5 className="text-sm font-medium text-gray-700">Email Notifications</h5>
        <p className="text-xs text-gray-500">Receive notifications for new orders and updates</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={true} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
      </label>
    </div>
    
    <div className="flex items-center justify-between">
      <div>
        <h5 className="text-sm font-medium text-gray-700">SMS Alerts</h5>
        <p className="text-xs text-gray-500">Get text messages for delivery updates</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={false} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
      </label>
    </div>
    
    <div className="flex items-center justify-between">
      <div>
        <h5 className="text-sm font-medium text-gray-700">Marketing Communications</h5>
        <p className="text-xs text-gray-500">Receive offers, promotions, and updates</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={false} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
      </label>
    </div>
  </div>

  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Language</h4>
    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5">
      <option value="en">English (US)</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="de">Deutsch</option>
    </select>
  </div>

  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Currency</h4>
    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5">
      <option value="usd">USD ($)</option>
      <option value="eur">EUR (€)</option>
      <option value="gbp">GBP (£)</option>
      <option value="jpy">JPY (¥)</option>
    </select>
  </div>

  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Account Privacy</h4>
    
    <div className="space-y-2">
      <div className="flex items-center">
        <input id="privacy-public" type="radio" name="privacy" className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 focus:ring-yellow-500" checked />
        <label htmlFor="privacy-public" className="ms-2 text-sm font-medium text-gray-700">Public Profile</label>
      </div>
      <div className="flex items-center">
        <input id="privacy-private" type="radio" name="privacy" className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 focus:ring-yellow-500" />
        <label htmlFor="privacy-private" className="ms-2 text-sm font-medium text-gray-700">Private Profile</label>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-2">Public profiles can be viewed by anyone on the platform</p>
  </div>

  <div className="mt-8 flex justify-end space-x-3">
    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
      Cancel
    </button>
    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
      Save Changes
    </button>
  </div>
</div>