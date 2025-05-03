"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaHome, FaBoxOpen, FaClipboardList, FaPlus, FaMoneyBillWave, FaWallet, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaUser, FaFileDownload, FaFileUpload, FaCheck, FaClock, FaTrash, FaEdit, FaDollarSign } from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://five9minutes-backend.onrender.com";

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [vendorId, setVendorId] = useState("");
  
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
  
  // Data from API
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    available: 0,
    total: 0,
    pending: 0,
  });
  const [payouts, setPayouts] = useState([]);

  // Fetch vendor data on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/Vendor/Login");
      } else {
        setUser(user);
        try {
          // Get vendor ID from token or API
          const token = await user.getIdToken();
          const vendorRes = await axios.get(`${API_BASE_URL}/vendor/get-vendor`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (vendorRes.data && vendorRes.data._id) {
            setVendorId(vendorRes.data._id);
            localStorage.setItem('vendor_token', token);
            loadVendorData(vendorRes.data._id, token);
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          toast.error("Error loading vendor data");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Load all vendor data
  const loadVendorData = async (vendorId, token) => {
    try {
      // Load products
      const productsRes = await axios.get(`${API_BASE_URL}/products/get-products/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(productsRes.data.products || []);

      // Load orders
      const ordersRes = await axios.get(`${API_BASE_URL}/orders/vendor-orders/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(ordersRes.data.orders || []);

      // Load earnings
      const earningsRes = await axios.get(`${API_BASE_URL}/vendor/earnings/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEarnings({
        available: earningsRes.data.availableBalance || 0,
        total: earningsRes.data.totalEarnings || 0,
        pending: earningsRes.data.pendingBalance || 0
      });

      // Load payouts
      const payoutsRes = await axios.get(`${API_BASE_URL}/vendor/payouts/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPayouts(payoutsRes.data.payouts || []);

      // Load categories
      const categoriesRes = await axios.get(`${API_BASE_URL}/categories/get-categories`);
      setProductCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error("Error loading vendor data:", error);
      toast.error("Error loading vendor data");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('vendor_token');
      toast.success("Logged out successfully");
      router.push("/Vendor/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 5) {
      toast.error('You can only upload up to 5 images.');
      return;
    }
    setProductImages(prev => [...prev, ...files]);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!productName || !productDescription || !productPrice || !productMaterial || !selectedCategory || selectedColors.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDescription);
      formData.append('price', productPrice);
      formData.append('material', productMaterial);
      formData.append('category', selectedCategory);
      formData.append('colors', JSON.stringify(selectedColors));
      formData.append('vendorId', vendorId);
      
      // Append each image file
      productImages.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await axios.post(`${API_BASE_URL}/products/add-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        toast.success("Product created successfully!");
        // Refresh products list
        const productsRes = await axios.get(`${API_BASE_URL}/products/get-products/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
          }
        });
        setProducts(productsRes.data.products || []);
        
        // Reset form
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductMaterial("");
        setSelectedCategory("");
        setSelectedColors([]);
        setProductImages([]);
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    }
  };
  
  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/delete-product/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });
      
      if (response.data.success) {
        toast.success("Product deleted successfully");
        // Refresh products list
        const productsRes = await axios.get(`${API_BASE_URL}/products/get-products/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
          }
        });
        setProducts(productsRes.data.products || []);
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
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
      const response = await axios.post(`${API_BASE_URL}/vendor/request-payout`, {
        vendorId,
        bankName,
        accountNumber,
        accountName,
        amount: parseFloat(withdrawAmount)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully");
        // Refresh payouts and earnings
        const [earningsRes, payoutsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/vendor/earnings/${vendorId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
            }
          }),
          axios.get(`${API_BASE_URL}/vendor/payouts/${vendorId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
            }
          })
        ]);
        
        setEarnings({
          available: earningsRes.data.availableBalance || 0,
          total: earningsRes.data.totalEarnings || 0,
          pending: earningsRes.data.pendingBalance || 0
        });
        setPayouts(payoutsRes.data.payouts || []);
        
        // Reset form
        setWithdrawAmount("");
      } else {
        toast.error(response.data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast.error("Error submitting withdrawal request");
    }
  };
  
  const handleDesignLinkSubmit = async (orderId, link) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/update-order/${orderId}`, {
        designLink: link,
        status: "In Review"
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
        }
      });

      if (response.data.success) {
        toast.success("Design link submitted for review");
        // Refresh orders
        const ordersRes = await axios.get(`${API_BASE_URL}/orders/vendor-orders/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('vendor_token')}`
          }
        });
        setOrders(ordersRes.data.orders || []);
      } else {
        toast.error(response.data.message || "Failed to submit design link");
      }
    } catch (error) {
      console.error("Error submitting design link:", error);
      toast.error("Error submitting design link");
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
                  <p className="text-xl font-bold text-white">₦{earnings.available.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order._id} className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">ORD-{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={`font-bold ${
                  order.status === "Completed" ? "text-green-400" : 
                  order.status === "Processing" ? "text-blue-400" : 
                  order.status === "In Review" ? "text-purple-400" : "text-yellow-400"
                }`}>
                  {order.status}
                </p>
                <p className="text-sm">₦{order.totalPrice?.toLocaleString() || "0"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    
    Orders: (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <div className="flex space-x-2">
            <button className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white text-white`}>
              All
            </button>
            <button className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-yellow-400 text-yellow-400`}>
              Pending
            </button>
            <button className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-purple-400 text-purple-400`}>
              In Review
            </button>
            <button className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-green-400 text-green-400`}>
              Completed
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">ORD-{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer?.name || "Unknown"}</td>
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">₦{order.totalPrice?.toLocaleString() || "0"}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {order.files?.map((file, index) => (
                        <a 
                          key={index}
                          href={`${API_BASE_URL}/uploads/${file}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaFileDownload className="mr-1" />
                          <span className="truncate max-w-xs">{file.split('/').pop()}</span>
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.status === "Pending" || order.status === "Processing" ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Enter design link"
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-48 mr-2"
                          defaultValue={order.designLink}
                        />
                        <button 
                          onClick={() => handleDesignLinkSubmit(order._id, document.querySelector(`input[placeholder="Enter design link"]`).value)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded text-xs"
                        >
                          Submit
                        </button>
                      </div>
                    ) : order.designLink ? (
                      <div className="flex items-center">
                        <span className="text-green-400 flex items-center">
                          <FaCheck className="mr-1" /> Design Submitted
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-gray-400">Waiting for action</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {productCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Product description"
              rows="3"
              required
            />
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
            {productImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-${index}`}
                  className="w-24 h-24 object-cover rounded-md border border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setProductImages(productImages.filter((_, i) => i !== index))}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    ),

    "Manage Products": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No products available. Create your first product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-800">
                  {product.images?.length > 0 ? (
                    <img 
                      src={`${API_BASE_URL}/uploads/${product.images[0]}`} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="font-bold text-yellow-400">₦{product.price?.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.colors?.map((color, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-700 text-xs rounded-full">{color}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>Material: {product.material}</span>
                    <span>Category: {productCategories.find(c => c._id === product.category)?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <button className="flex items-center text-blue-400 hover:text-blue-300">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex items-center text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    
    "Earnings": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Your Earnings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Available Balance</h3>
              <FaMoneyBillWave className="text-green-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-green-400">₦{earnings.available.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Ready to withdraw</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Total Earnings</h3>
              <FaDollarSign className="text-yellow-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">₦{earnings.total.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Lifetime earnings</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Pending</h3>
              <FaClock className="text-blue-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-blue-400">₦{earnings.pending.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Processing withdrawals</p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Commission Rate</span>
              <span className="text-sm font-medium">80%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "80%" }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              You receive 80% of each sale, 20% goes to platform fee
            </p>
          </div>
          
          <h3 className="font-medium mb-3">Monthly Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earnings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.reduce((acc, order) => {
                  const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
                  if (!acc[month]) {
                    acc[month] = { orders: 0, earnings: 0 };
                  }
                  acc[month].orders += 1;
                  acc[month].earnings += order.totalPrice || 0;
                  return acc;
                }, {})}
                {Object.entries(orders.reduce((acc, order) => {
                  const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
                  if (!acc[month]) {
                    acc[month] = { orders: 0, earnings: 0 };
                  }
                  acc[month].orders += 1;
                  acc[month].earnings += order.totalPrice || 0;
                  return acc;
                }, {})).map(([month, data]) => (
                  <tr key={month}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{month}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{data.orders}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₦{data.earnings.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">₦{(data.earnings * 0.8).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    
    "Withdraw": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-sm text-gray-400">Available Balance</span>
              <h2 className="text-3xl font-bold text-green-400">₦{earnings.available.toLocaleString()}</h2>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Minimum Withdrawal</span>
              <p className="text-lg font-medium">₦5,000</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         