"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaBox, FaUpload, FaEdit, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast } from "react-toastify";

export default function CustomerDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");


  // CUSTOMER CANVASS JAVASCRIPT CODE STARTS


  // State
  const [showDesigner, setShowDesigner] = useState(false);
  const [designFiles, setDesignFiles] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [exportFormat, setExportFormat] = useState('png');

  // API Integration Functions
  const loadDesignFiles = async () => {
    try {
      const response = await fetch('/api/designs');
      const data = await response.json();
      setDesignFiles(data);
    } catch (error) {
      console.error('Error loading designs:', error);
    }
  };

  const loadDesign = async (file) => {
    setSelectedDesign(file.id);
    // Initialize Customers Canvas with the selected design
    const iframe = document.getElementById('cc-frame');
    iframe.src = `https://your-customerscanvas-instance.com/editor?designId=${file.id}`;
  };

  const saveDesign = async () => {
    // Implement save functionality with Customers Canvas API
  };

  const exportDesign = async () => {
    // Implement export functionality
  };

  const executeEditorCommand = (command) => {
    // Send commands to Customers Canvas iframe
    const iframe = document.getElementById('cc-frame');
    iframe.contentWindow.postMessage({
      action: command
    }, 'https://your-customerscanvas-instance.com');
  };

  // Load designs on component mount
  useEffect(() => {
    loadDesignFiles();
  }, []);

  // Add this with your other API Integration Functions
  const uploadNewDesign = async () => {
    try {
      // Create a file input element programmatically
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.psd,.ai,.pdf'; // Accept common design file formats

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('design', file);

        // Upload the file to your API
        const response = await fetch('/api/designs/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          // Refresh the design files list
          await loadDesignFiles();
        } else {
          console.error('Upload failed');
        }
      };

      // Trigger the file selection dialog
      input.click();
    } catch (error) {
      console.error('Error uploading design:', error);
    }
  };



  // CUSTOMER CANVASS CODE ENDS HERE   



  // Tab components
  const tabs = {
    // DASHBAORD
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.displayName || "Customer"}</span>
          </h1>
          <p className="text-gray-300 mb-6">
            Quick overview of your print projects and account
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBox className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Active Orders</p>
                  <p className="text-xl font-bold text-white">0</p>
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
                  <p className="text-xl font-bold text-white">0</p>
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
                    {new Date(user?.metadata?.creationTime).toLocaleDateString()}
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
          <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-gray-700">
            <p className="text-gray-400 py-6">No recent activity</p>
          </div>
        </div>
      </div>
    ),

    //MY ORDERS  



    "My Orders": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition flex items-center">
            <FaUpload className="mr-2" /> New Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black bg-opacity-30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-400">
                  You haven't placed any orders yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),


    // UPLOAD DESIGNS


    "Upload Design": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Upload Design</h1>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-yellow-400 transition">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-yellow-400 bg-opacity-20 p-4 rounded-full">
              <FaUpload className="text-2xl text-yellow-400" />
            </div>
            <p className="text-gray-300">Drag and drop your design files here</p>
            <p className="text-sm text-gray-400">Supports: JPG, PNG, PDF, AI, PSD</p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition">
              Browse Files
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Recent Uploads</h3>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-gray-700">
            <p className="text-gray-400 py-4">No recent uploads</p>
          </div>
        </div>
      </div>
    ),

    // EDIT DESIGNS
    "Edit Design": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Design Editor</h1>
          <button
            onClick={() => setShowDesigner(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
          >
            <FaEdit className="mr-2" /> Open Editor
          </button>
        </div>

        {/* Customers Canvas Container */}
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
          <iframe
            id="cc-frame"
            className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg border border-gray-700"
            src=""
            title="Customers Canvas Editor"
            allowFullScreen
          ></iframe>
        </div>

        {/* Design Actions Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium mb-3">Design Files</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {designFiles.length > 0 ? (
                designFiles.map(file => (
                  <div
                    key={file.id}
                    className={`p-2 rounded-md cursor-pointer ${selectedDesign === file.id ? 'bg-yellow-400 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => loadDesign(file)}
                  >
                    <div className="flex items-center">
                      <FaFile className="mr-2" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No designs available</p>
              )}
            </div>
            <button
              onClick={uploadNewDesign}
              className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
            >
              Upload New
            </button>
          </div>

          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium mb-3">Editor Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => executeEditorCommand('undo')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Undo
              </button>
              <button
                onClick={() => executeEditorCommand('redo')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Redo
              </button>
              <button
                onClick={() => executeEditorCommand('addText')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Add Text
              </button>
              <button
                onClick={() => executeEditorCommand('addImage')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
              >
                Add Image
              </button>
            </div>
          </div>

          <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium mb-3">Save & Export</h3>
            <div className="space-y-3">
              <button
                onClick={saveDesign}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md text-sm font-medium"
              >
                Save Design
              </button>
              <select
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md text-sm p-2"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="pdf">PDF</option>
              </select>
              <button
                onClick={exportDesign}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    ),

    // SETTINGS


    Settings: (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-lg font-medium mb-4">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                    defaultValue={user?.displayName?.split(' ')[0] || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                    defaultValue={user?.displayName?.split(' ')[1] || ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Security</h2>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-medium transition">
                Change Password
              </button>
            </div>
          </div>

          <div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                  <FaUser className="text-xl text-yellow-400" />
                </div>
                <button className="text-sm text-yellow-400 hover:text-yellow-300 font-medium">
                  Update Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/Auth/Login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Handle logout
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden mr-4 text-white focus:outline-none"
              >
                {mobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <h1 className="text-xl font-bold ">Customers<span className="text-yellow-400 px-3">Dashboard</span></h1>
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


          {/* Mobile-Responsive Side Navigation */}
          <aside className={`
  fixed inset-y-0 left-0 z-40 
  w-64 bg-gray-800 shadow-lg 
  transform transition-transform duration-300 ease-in-out rounded
  ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} 
  lg:relative lg:translate-x-0 lg:w-64
  mt-16 lg:mt-0  /* Added margin-top for mobile */
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
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto"> {/* Adjusted height calculation */}
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