"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaBoxOpen, FaClipboardList, FaPlus, FaMoneyBillWave, FaWallet, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaUser, FaFileDownload, FaFileUpload, FaCheck, FaClock, FaTrash, FaEdit, FaDollarSign } from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Form states for Create Product
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [productImages, setProductImages] = useState([]);
  
  // State for bank details in Withdraw tab
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  
  // Mock Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    available: 10,
    total: 10,
    pending: 10,
  });
  const [payouts, setPayouts] = useState([]);

  // Load user data and initial content
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/Vendor/Login");
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
      { id: 1, name: "Business Cards", description: "Premium business cards, 300gsm", stock: 100, price: 4500, colors: ["Blue", "White", "Black"], material: "Gloss Coated", images: ["/api/placeholder/400/300"] },
      { id: 2, name: "Flyers", description: "Full color A5 flyers", stock: 250, price: 7500, colors: ["Full Color"], material: "Matt Paper", images: ["/api/placeholder/400/300"] },
      { id: 3, name: "Posters", description: "Large format posters, various sizes", stock: 50, price: 15000, colors: ["Full Color"], material: "Synthetic Paper", images: ["/api/placeholder/400/300"] },
    ]);
    
    setOrders([
      { id: "ORD-1001", clientName: "John Doe", date: "2023-06-15", status: "Completed", total: "₦12,599", files: ["brochure-design.pdf"], designLink: "https://design.example.com/1001" },
      { id: "ORD-1002", clientName: "Jane Smith", date: "2023-06-20", status: "Processing", total: "₦8,950", files: ["logo-specs.pdf"], designLink: "" },
      { id: "ORD-1003", clientName: "Robert Johnson", date: "2023-06-22", status: "Pending", total: "₦23,500", files: ["business-card.pdf", "letterhead.pdf"], designLink: "" }
    ]);
    
    setEarnings({
      available: 56000,
      total: 125000,
      pending: 23000
    });
    
    setPayouts([
      { id: "PYT-001", date: "2023-05-30", amount: "₦45,000", status: "Paid", txnId: "TXN4587952" },
      { id: "PYT-002", date: "2023-06-15", amount: "₦32,000", status: "Paid", txnId: "TXN4692301" },
      { id: "PYT-003", date: "2023-06-28", amount: "₦18,000", status: "Pending", txnId: "TXN4721905" }
    ]);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('vendor_token')
      toast.success("Logged out successfully");
      router.push("/Vendor/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Optional: limit number of images to 5
    if (files.length + productImages.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }

    // Optional: check file types
    const validImages = files.filter(file =>
      ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type)
    );

    setProductImages(prev => [...prev, ...validImages]);
  };

  
  const handleCreateProduct = async(e) => {
    e.preventDefault();
    
    if (!productName || !productDescription || !productPrice || !productMaterial || selectedColors.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newProduct = {
      id: products.length + 1,
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      colors: selectedColors,
      material: productMaterial,
      stock: 100,
      images: productImages.length > 0 ? productImages : ["/api/placeholder/400/300"],
    };
    
    setProducts([...products, newProduct]);

    const response = await axios(`${process.env.API_KEY}/products/add-product/${vendorId}`, products, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('vendor_token')
        }
      });

    console.log(response);
    
    toast.success("Product created successfully!");
    
    // Reset form
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductMaterial("");
    setSelectedColors([]);
    setProductImages([]);
  };
  
  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Product deleted");
  };
  
  const handleSubmitWithdrawal = (e) => {
    e.preventDefault();
    
    if (!bankName || !accountNumber || !accountName || !withdrawAmount) {
      toast.error("Please fill all bank details");
      return;
    }
    
    if (parseFloat(withdrawAmount) > earnings.available) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }
    
    // In a real app, this would send a request to the backend
    const newPayout = {
      id: `PYT-00${payouts.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      amount: `₦${parseFloat(withdrawAmount).toLocaleString()}`,
      status: "Pending",
      txnId: `TXN${Math.floor(1000000 + Math.random() * 9000000)}`
    };
    
    setPayouts([newPayout, ...payouts]);
    setEarnings({
      ...earnings,
      available: earnings.available - parseFloat(withdrawAmount),
      pending: earnings.pending + parseFloat(withdrawAmount)
    });
    
    toast.success("Withdrawal request submitted");
    setWithdrawAmount("");
  };
  
  const handleDesignLinkSubmit = (orderId, link) => {
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? {...order, designLink: link, status: "In Review"} 
          : order
      )
    );
    toast.success("Design link submitted for review");
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
              <div key={order.id} className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <p className={`font-bold ${
                  order.status === "Completed" ? "text-green-400" : 
                  order.status === "Processing" ? "text-blue-400" : 
                  order.status === "In Review" ? "text-purple-400" : "text-yellow-400"
                }`}>
                  {order.status}
                </p>
                <p className="text-sm">{order.total}</p>
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
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.clientName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.total}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {order.files.map((file, index) => (
                        <button 
                          key={index}
                          className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaFileDownload className="mr-1" />
                          <span className="truncate max-w-xs">{file}</span>
                        </button>
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
                          onClick={() => handleDesignLinkSubmit(order.id, document.querySelector(`input[placeholder="Enter design link"]`).value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (₦)</label>
              <select
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Price in Naira"
                min="0"
                required
              >
                <option value></option>
              </select>
            </div>
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
            {productImages.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`upload-${index}`}
                className="w-24 h-24 object-cover rounded-md border border-gray-400"
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
            >
              Create Product
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
              <div key={product.id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-800">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="font-bold text-yellow-400">₦{product.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.colors.map((color, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-700 text-xs rounded-full">{color}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>Material: {product.material}</span>
                    <span>In Stock: {product.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <button className="flex items-center text-blue-400 hover:text-blue-300">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
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
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">June 2023</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">12</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₦48,000</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">₦38,400</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">May 2023</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">15</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₦65,000</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">₦52,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">April 2023</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">8</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₦32,000</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">₦25,600</td>
                </tr>
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your bank name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your account number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter account holder name"
                />
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="5000"
                  max={earnings.available}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter amount to withdraw"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum withdrawal: ₦5,000 | Available: ₦{earnings.available.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
                <h3 className="font-medium mb-2">Withdrawal Notes</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Withdrawals are processed within 24-48 hours</li>
                  <li>• All bank details must be accurate</li>
                  <li>• 80% commission is paid on all sales</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
                >
                  Request Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payouts.slice(0, 3).map((payout, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{payout.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{payout.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payout.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    
    "Payouts Received": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Payouts History</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Total Payouts</p>
              <p className="text-2xl font-bold">₦{payouts
                .filter(p => p.status === "Paid")
                .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, '')), 0)
                .toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold">₦{payouts
                .filter(p => p.status === "Paid" && new Date(p.date).getMonth() === new Date().getMonth())
                .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, '')), 0)
                .toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">₦{payouts
                .filter(p => p.status === "Pending")
                .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, '')), 0)
                .toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payouts.map((payout, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{payout.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{payout.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{payout.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      payout.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{payout.txnId}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {payout.status === "Paid" && (
                      <button className="text-blue-400 hover:text-blue-300 flex items-center">
                        <FaFileDownload className="mr-1" /> Download
                      </button>
                    )}
                    {payout.status === "Pending" && (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <button
                onClick={() => {
                  setActiveTab("Dashboard");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Dashboard"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHome />
                </span>
                <span className="text-left">Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Orders");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Orders"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaClipboardList />
                </span>
                <span className="text-left">Orders</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Create Product");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Create Product"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaPlus />
                </span>
                <span className="text-left">Create Product</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Manage Products");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Manage Products"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaBoxOpen />
                </span>
                <span className="text-left">Manage Products</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Earnings");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Earnings"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaMoneyBillWave />
                </span>
                <span className="text-left">Earnings</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Withdraw");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Withdraw"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaWallet />
                </span>
                <span className="text-left">Withdraw</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("Payouts Received");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${activeTab === "Payouts Received"
                    ? 'bg-yellow-400 text-black font-bold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHistory />
                </span>
                <span className="text-left">Payouts Received</span>
              </button>
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