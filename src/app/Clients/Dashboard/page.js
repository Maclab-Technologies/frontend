"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, FaUpload, FaShoppingCart, FaFileAlt, 
  FaComments, FaMoneyBillWave, FaCog, FaSignOutAlt, 
  FaBars, FaTimes, FaUser, FaCheck, FaClock,
  FaExclamationCircle, FaDownload, FaPaperPlane,
  FaTrash, FaEdit
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Mock data states
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [designNote, setDesignNote] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
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
    // Mock orders
    setOrders([
      {
        id: "ORD-1001",
        date: "2023-09-15",
        product: "Business Cards (Premium)",
        status: "Completed",
        designer: "Emily Chen",
        total: "$45.99",
        progress: 100
      },
      {
        id: "ORD-1002",
        date: "2023-09-20",
        product: "Flyers (500)",
        status: "In Progress",
        designer: "Michael Wong",
        total: "$89.50",
        progress: 65
      },
      {
        id: "ORD-1003",
        date: "2023-09-25",
        product: "Logo Design",
        status: "Pending Revision",
        designer: "Sarah Johnson",
        total: "$120.00",
        progress: 80
      }
    ]);

    // Mock transactions
    setTransactions([
      {
        id: "TRX-001",
        date: "2023-09-15",
        amount: "$45.99",
        method: "Credit Card (****1234)",
        orderId: "ORD-1001"
      },
      {
        id: "TRX-002",
        date: "2023-09-20",
        amount: "$89.50",
        method: "PayPal",
        orderId: "ORD-1002"
      },
      {
        id: "TRX-003",
        date: "2023-09-25",
        amount: "$120.00",
        method: "Credit Card (****5678)",
        orderId: "ORD-1003"
      }
    ]);

    // Mock recent activity
    setRecentActivity([
      { type: "order", id: "ORD-1003", date: "2023-09-25", action: "Revision requested" },
      { type: "message", id: "MSG-002", date: "2023-09-22", action: "New message from designer" },
      { type: "order", id: "ORD-1002", date: "2023-09-20", action: "Order in progress" }
    ]);

    // Mock messages
    setMessages([
      {
        id: "MSG-001",
        from: "Emily Chen",
        role: "Designer",
        date: "2023-09-15",
        content: "Your business cards are ready for review!",
        read: true,
        orderId: "ORD-1001"
      },
      {
        id: "MSG-002",
        from: "Michael Wong",
        role: "Designer",
        date: "2023-09-22",
        content: "I have a question about your flyer design requirements.",
        read: false,
        orderId: "ORD-1002"
      }
    ]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const submitDesignRequest = () => {
    if (uploadedFiles.length === 0 && !designNote.trim()) {
      toast.error("Please upload a file or add design notes");
      return;
    }
    
    toast.success("Design request submitted successfully!");
    // Reset form after submission
    setUploadedFiles([]);
    setDesignNote("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    localStorage.removeItem('userToken');
      toast.success("Logged out successfully");
      router.push("/Auth/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  // Navigation items configuration
  const navItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Create Design Request", icon: <FaUpload /> },
    { name: "My Orders", icon: <FaShoppingCart /> },
    { name: "Track Progress", icon: <FaFileAlt /> },
    { name: "Messages", icon: <FaComments /> },
    { name: "Transactions", icon: <FaMoneyBillWave /> },
    { name: "Settings", icon: <FaCog /> }
  ];

  // Tab components
  const tabContent = {
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.displayName || "Client"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Here's an overview of your design and print projects</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaClock className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">In Progress</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === "In Progress").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaCheck className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Completed</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === "Completed").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaExclamationCircle className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Pending Revisions</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === "Pending Revision").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <button className="text-sm text-yellow-400 hover:underline">View All</button>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 3).map((activity, index) => (
                <div 
                  key={index} 
                  className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center"
                >
                  <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                    {activity.type === "order" ? (
                      <FaShoppingCart className="text-yellow-400 text-sm" />
                    ) : (
                      <FaComments className="text-yellow-400 text-sm" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.id} • {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-gray-700">
              <p className="text-gray-400 py-6">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    ),

    "Create Design Request": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Create Design Request</h1>
        
        <div className="space-y-6">
          {/* File Uploader */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="fileUpload" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <FaUpload className="text-4xl text-yellow-400 mb-2" />
              <p className="text-lg font-medium">Drag & drop files here or click to browse</p>
              <p className="text-sm text-gray-400 mt-1">
                Support for PSD, AI, PDF, JPG, PNG (Max: 25MB each)
              </p>
            </label>
          </div>
          
          {/* File Preview */}
          {uploadedFiles.length > 0 && (
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
              <div className="space-y-2">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                        <FaFileAlt className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Design Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Design Notes</label>
            <textarea
              value={designNote}
              onChange={(e) => setDesignNote(e.target.value)}
              placeholder="Describe your design requirements, preferences, and any specific details that would help the designer..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows="5"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={submitDesignRequest}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition flex items-center"
            >
              <FaPaperPlane className="mr-2" /> Submit Request
            </button>
          </div>
        </div>
      </div>
    ),

    "My Orders": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 pr-6">Order ID</th>
                  <th className="pb-3 pr-6">Product</th>
                  <th className="pb-3 pr-6">Date</th>
                  <th className="pb-3 pr-6">Status</th>
                  <th className="pb-3 pr-6">Total</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700">
                    <td className="py-4 pr-6">{order.id}</td>
                    <td className="py-4 pr-6">{order.product}</td>
                    <td className="py-4 pr-6">{order.date}</td>
                    <td className="py-4 pr-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed" ? "bg-green-900 text-green-200" :
                        order.status === "In Progress" ? "bg-blue-900 text-blue-200" : 
                        "bg-yellow-900 text-yellow-200"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6">{order.total}</td>
                    <td className="py-4 text-right">
                      <button className="text-yellow-400 hover:text-yellow-300 px-3 py-1 transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
            <FaShoppingCart className="text-4xl text-yellow-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-300">You don't have any orders yet</p>
            <button className="mt-4 text-yellow-400 hover:underline">Create your first order</button>
          </div>
        )}
      </div>
    ),

    "Track Progress": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Track Progress</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{order.product}</h3>
                  <p className="text-sm text-gray-400">{order.id} • {order.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Completed" ? "bg-green-900 text-green-200" :
                  order.status === "In Progress" ? "bg-blue-900 text-blue-200" : 
                  "bg-yellow-900 text-yellow-200"
                }`}>
                  {order.status}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
                <div 
                  className="h-full bg-yellow-400" 
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>Order Placed</span>
                <span>Design</span>
                <span>Review</span>
                <span>Complete</span>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center">
                  <FaUser className="text-yellow-400 mr-2" />
                  <span className="text-sm">Designer: {order.designer}</span>
                </div>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm transition">
                  Message Designer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    "Messages": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-black bg-opacity-30 rounded-lg p-4 border ${
                  message.read ? 'border-gray-700' : 'border-yellow-400'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                      <FaUser className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium">{message.from}</p>
                      <p className="text-xs text-gray-400">{message.role} • {message.date}</p>
                    </div>
                  </div>
                  {!message.read && (
                    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
                
                <div className="pl-11">
                  <p className="text-gray-300">{message.content}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Regarding order {message.orderId}
                    </span>
                    <button className="text-yellow-400 hover:text-yellow-300 text-sm transition">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
            <FaComments className="text-4xl text-yellow-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-300">No messages yet</p>
          </div>
        )}
      </div>
    ),

    "Transactions": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 pr-6">Date</th>
                  <th className="pb-3 pr-6">Transaction ID</th>
                  <th className="pb-3 pr-6">Order ID</th>
                  <th className="pb-3 pr-6">Amount</th>
                  <th className="pb-3 pr-6">Payment Method</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-700">
                    <td className="py-4 pr-6">{transaction.date}</td>
                    <td className="py-4 pr-6">{transaction.id}</td>
                    <td className="py-4 pr-6">{transaction.orderId}</td>
                    <td className="py-4 pr-6">{transaction.amount}</td>
                    <td className="py-4 pr-6">{transaction.method}</td>
                    <td className="py-4 text-right">
                      <button className="text-yellow-400 hover:text-yellow-300 transition">
                        <FaDownload /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
            <FaMoneyBillWave className="text-4xl text-yellow-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-300">No transactions yet</p>
          </div>
        )}
      </div>
    ),

    "Settings": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-medium mb-4">Profile Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.displayName || ""}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
            </div>
            
            <div className="mt-6">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition">
                Update Profile
              </button>
            </div>
          </div>
          
          {/* Change Password */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-medium mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition">
                Change Password
              </button>
            </div>
          </div>
          
          {/* Delete Account */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-red-900">
            <h2 className="text-lg font-medium mb-4">Delete Account</h2>
            <p className="text-gray-400 mb-4">
              Warning: Deleting your account is permanent and cannot be undone. 
              All your data will be permanently removed.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center">
              <FaTrash className="mr-2" /> Delete Account
            </button>
          </div>
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
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
              <div className="hidden md:flex items-center">
                <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  <FaUser className="text-yellow-400" />
                </div>
                <span className="text-sm text-gray-300">{user?.displayName || 'Client'}</span>
              </div>
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
                  <p className="font-medium text-white truncate">{user?.displayName || 'Client'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileNavOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                    transition-all duration-200
                    ${activeTab === item.name
                      ? 'bg-yellow-400 text-black font-bold shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-base">
                    {item.icon}
                  </span>
                  <span className="text-left">{item.name}</span>
                </button>
              ))}
              
              {/* Logout Button (Mobile Only) */}
              <button
                onClick={handleLogout}
                className="lg:hidden w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mt-4"
              >
                <span className="mr-3 text-base">
                  <FaSignOutAlt />
                </span>
                <span className="text-left">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-4 flex lg:hidden items-center">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="text-gray-300 mr-3 hover:text-white lg:hidden"
              >
                <FaBars size={20} />
              </button>
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            </div>

            {tabContent[activeTab]}
            </main>
        </div>
      </div>
    </div>
  );
}