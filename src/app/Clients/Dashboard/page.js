"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, FaBox, FaUpload, FaEdit, FaCog, 
  FaSignOutAlt, FaBars, FaTimes, FaUser, 
  FaFile, FaPlus, FaShoppingCart, FaHistory,
  FaCreditCard, FaAddressCard, FaLock
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Design Editor State
  const [designFiles, setDesignFiles] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [exportFormat, setExportFormat] = useState('png');
  const [showDesigner, setShowDesigner] = useState(false);

  // Mock order data
  const [orders, setOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

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
    // Mock design files
    setDesignFiles([
      { id: 1, name: "Business Card Design", date: "2023-05-15", type: "psd" },
      { id: 2, name: "Flyer Template", date: "2023-06-02", type: "ai" },
      { id: 3, name: "Logo Concept", date: "2023-06-10", type: "png" }
    ]);

    // Mock orders
    setOrders([
      {
        id: "ORD-1001",
        date: "2023-06-15",
        status: "Completed",
        total: "$45.99",
        items: ["Business Cards (100)"]
      },
      {
        id: "ORD-1002",
        date: "2023-06-20",
        status: "Processing",
        total: "$89.50",
        items: ["Flyers (500)", "Posters (50)"]
      }
    ]);

    // Mock recent activity
    setRecentActivity([
      { type: "order", id: "ORD-1002", date: "2023-06-20", action: "Order placed" },
      { type: "upload", id: "DSN-003", date: "2023-06-10", action: "Design uploaded" },
      { type: "order", id: "ORD-1001", date: "2023-06-15", action: "Order completed" }
    ]);
  };

  // Design Editor Functions
  const loadDesign = async (file) => {
    setSelectedDesign(file.id);
    toast.info(`Loading design: ${file.name}`);
  };

  const uploadNewDesign = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.psd,.ai,.pdf';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        toast.info(`Uploading ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newDesign = {
          id: Math.max(0, ...designFiles.map(d => d.id)) + 1,
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          type: file.name.split('.').pop()
        };
        
        setDesignFiles([newDesign, ...designFiles]);
        setRecentActivity([
          { 
            type: "upload", 
            id: `DSN-${newDesign.id}`, 
            date: newDesign.date, 
            action: "Design uploaded" 
          },
          ...recentActivity
        ]);
        
        toast.success(`${file.name} uploaded successfully!`);
      };
      
      input.click();
    } catch (error) {
      toast.error("Error uploading design");
      console.error(error);
    }
  };

  const createNewOrder = () => {
    toast.info("Redirecting to order creation...");
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
            Welcome back, <span className="text-yellow-400">{user?.displayName || "Customer"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Quick overview of your print projects and account</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBox className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Active Orders</p>
                  <p className="text-xl font-bold text-white">{orders.filter(o => o.status === "Processing").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUpload className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Designs</p>
                  <p className="text-xl font-bold text-white">{designFiles.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUser className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Member Since</p>
                  <p className="text-sm font-medium text-white">
                    {user?.metadata?.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString() 
                      : "N/A"}
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
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center"
                >
                  <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                    {activity.type === "order" ? (
                      <FaShoppingCart className="text-yellow-400 text-sm" />
                    ) : (
                      <FaFile className="text-yellow-400 text-sm" />
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

    // The implementation for "My Orders", "Upload Design", "Settings", etc. will go here...
    
    "My Orders": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        {/* Mock for orders table omitted in this example */}
      </div>
    ),

    "Upload Design": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Upload Design</h1>
        {/* Upload design functionality omitted in this example */}
      </div>
    ),

    "Settings": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        {/* Settings functionality omitted in this example */}
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
                  <p className="font-medium text-white truncate">{user?.displayName || 'Customer'}</p>
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
                    {tabName === "My Orders" && <FaBox />}
                    {tabName === "Upload Design" && <FaUpload />}
                    {tabName === "Edit Design" && <FaEdit />}
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