"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, FaUpload, FaShoppingCart, FaFileAlt, 
  FaComments, FaMoneyBillWave, FaCog, FaSignOutAlt, 
  FaBars, FaTimes, FaUser, FaCheck, FaClock,
  FaExclamationCircle, FaDownutad, FaPaperPlane,
  FaTrash, FaEdit
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "@/app/context/useAuth";

export default function ClientDashboard() {
  const router = useRouter();
  const { setAuthUser, setIsLoggedIn, setRole, authUser, isLoggedIn, role } = useContext(AuthContext)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Data states - now empty, to be populated from API
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [designNote, setDesignNote] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [apiLoading, setApiLoading] = useState({
    orders: false,
    transactions: false,
    activity: false,
    messages: false
  });
  const [errors, setErrors] = useState({
    orders: null,
    transactions: null,
    activity: null,
    messages: null
  });

  // Fetch data when tab changes
  useEffect(() => {
    if (!authUser) return;

    switch (activeTab) {
      case "My Orders":
        fetchOrders();
        break;
      case "Transactions":
        fetchTransactions();
        break;
      case "Messages":
        fetchMessages();
        break;
      case "Track Progress":
        fetchOrders(); // Reuse orders data
        break;
    }
  }, [activeTab, authUser]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchOrders()
      ]);
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setApiLoading(prev => ({ ...prev, activity: true }));
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Dashboard data fetch failed');
      const data = await response.json();
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      setErrors(prev => ({ ...prev, activity: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, activity: false }));
    }
  };

  const fetchOrders = async () => {
    try {
      setApiLoading(prev => ({ ...prev, orders: true }));
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Orders fetch failed');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      setErrors(prev => ({ ...prev, orders: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchTransactions = async () => {
    try {
      setApiLoading(prev => ({ ...prev, transactions: true }));
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Transactions fetch failed');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      setErrors(prev => ({ ...prev, transactions: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchMessages = async () => {
    try {
      setApiLoading(prev => ({ ...prev, messages: true }));
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Messages fetch failed');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      setErrors(prev => ({ ...prev, messages: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, messages: false }));
    }
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

  const submitDesignRequest = async () => {
    if (uploadedFiles.length === 0 && !designNote.trim()) {
      toast.error("Please upload a file or add design notes");
      return;
    }
    
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('designNote', designNote);
      formData.append('userId', authUser.id);

      const response = await fetch('/api/design-requests', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Submission failed');
      
      toast.success("Design request submitted successfully!");
      setUploadedFiles([]);
      setDesignNote("");
      fetchOrders(); // Refresh orders list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null)
      setIsLoggedIn(false)
      setRole(null)
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
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

  // Tab components - now with loading/error states
  const tabContent = {
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{authUser?.displayName || "Client"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Here's an overview of your design and print projects</p>

          {apiLoading.activity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse h-24"></div>
              ))}
            </div>
          ) : errors.activity ? (
            <div className="text-red-400 p-4">{errors.activity}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={<FaShoppingCart className="text-yellow-400" />}
                label="Total Orders"
                value={orders.length}
              />
              <StatCard 
                icon={<FaClock className="text-yellow-400" />}
                label="In Progress"
                value={orders.filter(o => o.status === "In Progress").length}
              />
              <StatCard 
                icon={<FaCheck className="text-yellow-400" />}
                label="Completed"
                value={orders.filter(o => o.status === "Completed").length}
              />
              <StatCard 
                icon={<FaExclamationCircle className="text-yellow-400" />}
                label="Pending Revisions"
                value={orders.filter(o => o.status === "Pending Revision").length}
              />
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <button className="text-sm text-yellow-400 hover:underline">View All</button>
          </div>
          
          {apiLoading.activity ? (
            <ActivitySkeleton />
          ) : errors.activity ? (
            <div className="text-red-400">{errors.activity}</div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 3).map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<FaClock />} message="No recent activity" />
          )}
        </div>
      </div>
    ),

    "Create Design Request": (
      <DesignRequestForm 
        uploadedFiles={uploadedFiles}
        designNote={designNote}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeFile}
        onNoteChange={(e) => setDesignNote(e.target.value)}
        onSubmit={submitDesignRequest}
      />
    ),

    "My Orders": (
      <DataTable 
        title="My Orders"
        loading={apiLoading.orders}
        error={errors.orders}
        data={orders}
        columns={[
          { header: "Order ID", accessor: "id" },
          { header: "Product", accessor: "product" },
          { header: "Date", accessor: "date" },
          { 
            header: "Status", 
            render: (order) => (
              <StatusBadge status={order.status} />
            )
          },
          { header: "Total", accessor: "total" },
          {
            header: "",
            render: () => (
              <button className="text-yellow-400 hover:text-yellow-300 px-3 py-1 transition">
                View Details
              </button>
            )
          }
        ]}
        emptyState={
          <EmptyState 
            icon={<FaShoppingCart />} 
            message="You don't have any orders yet"
            actionText="Create your first order"
            onAction={() => setActiveTab("Create Design Request")}
          />
        }
      />
    ),

    "Track Progress": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Track Progress</h1>
        
        {apiLoading.orders ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse h-40"></div>
            ))}
          </div>
        ) : errors.orders ? (
          <div className="text-red-400">{errors.orders}</div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderProgressCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<FaFileAlt />} 
            message="No orders to track"
            actionText="Create your first order"
            onAction={() => setActiveTab("Create Design Request")}
          />
        )}
      </div>
    ),

    "Messages": (
      <DataTable 
        title="Messages"
        loading={apiLoading.messages}
        error={errors.messages}
        data={messages}
        columns={[
          { 
            header: "From", 
            render: (message) => (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                  <FaUser className="text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">{message.from}</p>
                  <p className="text-xs text-gray-400">{message.role} • {message.date}</p>
                </div>
              </div>
            )
          },
          { header: "Content", accessor: "content", className: "pl-11" },
          { 
            header: "", 
            render: (message) => !message.read && (
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                New
              </span>
            )
          }
        ]}
        emptyState={
          <EmptyState 
            icon={<FaComments />} 
            message="No messages yet"
          />
        }
      />
    ),

    "Transactions": (
      <DataTable 
        title="Transactions"
        loading={apiLoading.transactions}
        error={errors.transactions}
        data={transactions}
        columns={[
          { header: "Date", accessor: "date" },
          { header: "Transaction ID", accessor: "id" },
          { header: "Order ID", accessor: "orderId" },
          { header: "Amount", accessor: "amount" },
          { header: "Payment Method", accessor: "method" },
          {
            header: "",
            render: () => (
              <button className="text-yellow-400 hover:text-yellow-300 transition">
                <FaDownload /> Receipt
              </button>
            )
          }
        ]}
        emptyState={
          <EmptyState 
            icon={<FaMoneyBillWave />} 
            message="No transactions yet"
          />
        }
      />
    ),

    "Settings": (
      <UserSettings user={authUser} />
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
    <div className="min-h-screen bg-gray-900 ">
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
      <NavBar 
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        user={authUser}
        handleLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <SideNav
            mobileNavOpen={mobileNavOpen}
            setMobileNavOpen={setMobileNavOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            user={authUser}
            handleLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            <MobileHeader 
              activeTab={activeTab}
              setMobileNavOpen={setMobileNavOpen}
            />

            {tabContent[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}

// Extracted Components for better readability

const StatCard = ({ icon, label, value }) => (
  <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
    <div className="flex items-center">
      <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center">
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
);

const ActivitySkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-700 rounded-lg p-3 h-16 animate-pulse"></div>
    ))}
  </div>
);

const DesignRequestForm = ({
  uploadedFiles,
  designNote,
  onFileUpload,
  onRemoveFile,
  onNoteChange,
  onSubmit
}) => (
  <div className="bg-gray-800 rounded-lg p-6 text-white">
    <h1 className="text-2xl font-bold mb-6">Create Design Request</h1>
    
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          multiple
          onChange={onFileUpload}
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
                  onClick={() => onRemoveFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-2">Design Notes</label>
        <textarea
          value={designNote}
          onChange={onNoteChange}
          placeholder="Describe your design requirements..."
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          rows="5"
        ></textarea>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition flex items-center"
        >
          <FaPaperPlane className="mr-2" /> Submit Request
        </button>
      </div>
    </div>
  </div>
);

const DataTable = ({ title, loading, error, data, columns, emptyState }) => (
  <div className="bg-gray-800 rounded-lg p-6 text-white">
    <h1 className="text-2xl font-bold mb-6">{title}</h1>
    
    {loading ? (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse h-12"></div>
        ))}
      </div>
    ) : error ? (
      <div className="text-red-400">{error}</div>
    ) : data.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              {columns.map((col, i) => (
                <th key={i} className="pb-3 pr-6">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700">
                {columns.map((col, i) => (
                  <td key={i} className={`py-4 pr-6 ${col.className || ''}`}>
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      emptyState
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const statusClasses = {
    "Completed": "bg-green-900 text-green-200",
    "In Progress": "bg-blue-900 text-blue-200",
    "Pending Revision": "bg-yellow-900 text-yellow-200"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const OrderProgressCard = ({ order }) => (
  <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-medium">{order.product}</h3>
        <p className="text-sm text-gray-400">{order.id} • {order.date}</p>
      </div>
      <StatusBadge status={order.status} />
    </div>
    
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
);

const EmptyState = ({ icon, message, actionText, onAction }) => (
  <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
    <div className="text-4xl text-yellow-400 mx-auto mb-3 opacity-50">
      {icon}
    </div>
    <p className="text-gray-300">{message}</p>
    {actionText && (
      <button 
        onClick={onAction}
        className="mt-4 text-yellow-400 hover:underline"
      >
        {actionText}
      </button>
    )}
  </div>
);

const UserSettings = ({ authUser }) => (
  <div className="bg-gray-800 rounded-lg p-6 text-white">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    
    <div className="space-y-8">
      <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={authUser?.displayName || ""}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              defaultValue={authUser?.email || ""}
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
);

const NavBar = ({ mobileNavOpen, setMobileNavOpen, authUser, handleLogout }) => (
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
            <span className="text-yellow-400">59Minutes Prints Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
              <FaUser className="text-yellow-400" />
            </div>
            <span className="text-sm text-gray-300">{authUser?.displayName || 'Client'}</span>
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
);

const SideNav = ({
  mobileNavOpen,
  setMobileNavOpen,
  activeTab,
  setActiveTab,
  navItems,
  authUser,
  handleLogout
}) => (
  <aside className={`
    fixed inset-y-0 left-0 z-40 
    w-64 bg-gray-800 shadow-lg 
    transform transition-transform duration-300 ease-in-out rounded
    ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} 
    lg:relative lg:translate-x-0 lg:w-64
    mt-16 lg:mt-0
  `}>
    <div className="lg:hidden absolute top-2 right-2">
      <button
        onClick={() => setMobileNavOpen(false)}
        className="p-2 text-gray-400 hover:text-white focus:outline-none"
      >
        <FaTimes size={20} />
      </button>
    </div>

    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
          <FaUser className="text-yellow-400" />
        </div>
        <div className="overflow-hidden">
          <p className="font-medium text-white truncate">{authUser?.displayName || 'Client'}</p>
          <p className="text-xs text-gray-400 truncate">{authUser?.email}</p>
        </div>
      </div>
    </div>

    <nav className="p-2  overflow-y-auto">
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
);

const MobileHeader = ({ activeTab, setMobileNavOpen }) => (
  <div className="mb-4 flex lg:hidden items-center">
    <button
      onClick={() => setMobileNavOpen(true)}
      className="text-gray-300 mr-3 hover:text-white lg:hidden"
    >
      <FaBars size={20} />
    </button>
    <h2 className="text-xl font-bold text-white">{activeTab}</h2>
  </div>
);