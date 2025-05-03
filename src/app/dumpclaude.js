"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaBoxOpen, FaClipboardList, FaPlus, FaMoneyBillWave, FaWallet, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaUser, FaFileDownload, FaFileUpload, FaCheck, FaClock, FaTrash, FaEdit, FaDollarSign } from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// API base URL
const API_BASE_URL = "https://five9minutes-backend.onrender.com";

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [vendorId, setVendorId] = useState(null);
  
  // Form states for Create Product
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // State for bank details in Withdraw tab
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    available: 0,
    total: 0,
    pending: 0,
  });
  const [payouts, setPayouts] = useState([]);

  // Check authentication and load vendor data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if vendor token exists
        const token = localStorage.getItem('vendor_token');
        if (!token) {
          router.push("/Vendor/Login");
          return;
        }
        
        // Verify token with API
        const response = await axios.get(`${API_BASE_URL}/vendors/verify-token`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.vendor);
          setVendorId(response.data.vendor._id);
          // Load all vendor data
          await Promise.all([
            fetchProducts(response.data.vendor._id),
            fetchOrders(response.data.vendor._id),
            fetchEarnings(response.data.vendor._id),
            fetchPayouts(response.data.vendor._id),
            fetchCategories()
          ]);
        } else {
          localStorage.removeItem('vendor_token');
          router.push("/Vendor/Login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem('vendor_token');
        router.push("/Vendor/Login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch product categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data.success) {
        setProductCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Could not load product categories");
    }
  };

  // Fetch vendor's products
  const fetchProducts = async (vendorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/vendor/${vendorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Could not load products");
    }
  };

  // Fetch vendor's orders
  const fetchOrders = async (vendorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/vendor/${vendorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not load orders");
    }
  };

  // Fetch vendor's earnings
  const fetchEarnings = async (vendorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/earnings/${vendorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      if (response.data.success) {
        setEarnings(response.data.earnings);
      } else {
        toast.error("Failed to load earnings data");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Could not load earnings data");
    }
  };

  // Fetch vendor's payout history
  const fetchPayouts = async (vendorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/payouts/${vendorId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      if (response.data.success) {
        setPayouts(response.data.payouts);
      } else {
        toast.error("Failed to load payout history");
      }
    } catch (error) {
      console.error("Error fetching payouts:", error);
      toast.error("Could not load payout history");
    }
  };

  const handleLogout = async () => {
    try {
      // Optional: Call logout endpoint if you're tracking sessions on the backend
      await axios.post(`${API_BASE_URL}/vendors/logout`, {}, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      localStorage.removeItem('vendor_token');
      toast.success("Logged out successfully");
      router.push("/Vendor/Login");
    } catch (error) {
      localStorage.removeItem('vendor_token'); // Still remove token even if API call fails
      toast.error("Error signing out");
      console.error("Logout error:", error);
      router.push("/Vendor/Login");
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Limit number of images to 5
    if (files.length + productImages.length > 5) {
      toast.warning('You can only upload up to 5 images.');
      return;
    }

    // Check file types
    const validImages = files.filter(file =>
      ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type)
    );

    if (validImages.length !== files.length) {
      toast.warning('Some files were skipped. Please upload only image files.');
    }

    try {
      // Create form data for file upload
      const formData = new FormData();
      validImages.forEach(file => {
        formData.append('images', file);
      });

      // Upload images to server
      const response = await axios.post(`${API_BASE_URL}/upload/images`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        // Add the new image URLs to the current product images
        setProductImages(prev => [...prev, ...response.data.imageUrls]);
        toast.success("Images uploaded successfully");
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!productName || !productDescription || !productPrice || !productMaterial || selectedColors.length === 0 || !selectedCategory) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        colors: selectedColors,
        material: productMaterial,
        category: selectedCategory,
        images: productImages.length > 0 ? productImages : []
      };
      
      const response = await axios.post(`${API_BASE_URL}/products/add`, productData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        toast.success("Product created successfully!");
        
        // Refresh products list
        await fetchProducts(vendorId);
        
        // Reset form
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductMaterial("");
        setSelectedColors([]);
        setProductImages([]);
        setSelectedCategory("");
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product. Please try again.");
    }
  };
  
  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        // Update products state by removing the deleted product
        setProducts(products.filter(product => product._id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };
  
  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!bankName || !accountNumber || !accountName || !withdrawAmount) {
      toast.error("Please fill all bank details");
      return;
    }
    
    if (parseFloat(withdrawAmount) > earnings.available) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    try {
      const withdrawalData = {
        vendorId,
        bankName,
        accountNumber,
        accountName,
        amount: parseFloat(withdrawAmount)
      };
      
      const response = await axios.post(`${API_BASE_URL}/vendors/withdraw`, withdrawalData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully");
        
        // Refresh earnings and payouts data
        await Promise.all([
          fetchEarnings(vendorId),
          fetchPayouts(vendorId)
        ]);
        
        // Reset withdrawal amount
        setWithdrawAmount("");
      } else {
        toast.error(response.data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast.error("Error submitting withdrawal. Please try again.");
    }
  };
  
  const handleDesignLinkSubmit = async (orderId, link) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders/update-design/${orderId}`, 
        { designLink: link },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('vendor_token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Design link submitted for review");
        
        // Update orders state with new status and design link
        setOrders(orders.map(order => 
          order._id === orderId 
            ? {...order, designLink: link, status: "In Review"} 
            : order
        ));
      } else {
        toast.error(response.data.message || "Failed to submit design link");
      }
    } catch (error) {
      console.error("Error submitting design link:", error);
      toast.error("Error submitting design link. Please try again.");
    }
  };

  // Tab components
  const tabs = {
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.name || "Vendor"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Quick overview of your products and orders</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBoxOpen className="text-yellow-400" />
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
                  <FaClipboardList className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Orders</p>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaMoneyBillWave className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Available Balance</p>
                  <p className="text-xl font-bold text-white">₦{earnings.available?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber || order._id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-bold ${
                    order.status === "Completed" ? "text-green-400" : 
                    order.status === "Processing" ? "text-blue-400" : 
                    order.status === "In Review" ? "text-purple-400" : "text-yellow-400"
                  }`}>
                    {order.status}
                  </p>
                  <p className="text-sm">₦{order.totalAmount?.toLocaleString() || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    
    Orders: (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white text-white">
              All
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-yellow-400 text-yellow-400">
              Pending
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-purple-400 text-purple-400">
              In Review
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-green-400 text-green-400">
              Completed
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="bg-black bg-opacity-30 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-lg text-gray-400">No orders available</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Files</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{order.orderNumber || order._id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.client?.name || "Customer"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${order.status === "Completed" ? "bg-green-100 text-green-800" : 
                          order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                          order.status === "In Review" ? "bg-purple-100 text-purple-800" : 
                          "bg-yellow-100 text-yellow-800"}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">₦{order.totalAmount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {order.files?.map((file, index) => (
                          <a 
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                          >
                            <FaFileDownload className="mr-1" />
                            <span className="truncate max-w-xs">{file.name || `File ${index+1}`}</span>
                          </a>
                        )) || <span className="text-gray-400">No files</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {(order.status === "Pending" || order.status === "Processing") ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="Enter design link"
                            defaultValue={order.designLink || ""}
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-48 mr-2"
                            id={`design-link-${order._id}`}
                          />
                          <button 
                            onClick={() => handleDesignLinkSubmit(order._id, document.getElementById(`design-link-${order._id}`).value)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded text-xs"
                          >
                            Submit
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-green-400 flex items-center">
                            <FaCheck className="mr-1" /> Design Submitted
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    ),

    "Create Product": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
        
        <form onSubmit={handleCreateProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. Business Cards"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (₦)</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Price in Naira"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="">Select a category</option>
              {productCategories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Describe your product"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Material</label>
              <input
                type="text"
                value={productMaterial}
                onChange={(e) => setProductMaterial(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. Glossy Paper, Matte, etc."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {["Red", "Blue", "Green", "Black", "White", "Yellow", "Full Color"].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                      ${selectedColors.includes(color) 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                      }`
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Upload Images (Max 5)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-300 focus-within:outline-none"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5 files</p>
                {productImages.length > 0 && (
                  <p className="text-sm text-green-400">{productImages.length} images selected</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {productImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`upload-${index}`}
                  className="w-24 h-24 object-cover rounded-md border border-gray-400"
                />
                <button
                  type="button"
                  onClick={()