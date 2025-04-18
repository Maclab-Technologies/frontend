"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaChartPie, FaBoxOpen, FaUsers, FaUserTie,
  FaPaintBrush, FaMoneyCheckAlt, FaReceipt, FaSignOutAlt,
  FaBars, FaTimes, FaUser, FaCheck, FaDownload,
  FaExclamationCircle, FaClock, FaTrash, FaEdit
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vendors.length / itemsPerPage);


  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Mock data states
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});

  // Load user data and initial content
  useEffect(() => {
    // Extract email from URL query param if needed
    const email = new URLSearchParams(window.location.search).get('email');

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/Admin/Login");
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
    // Mock users
    setUsers([
      {
        id: "USR-1001",
        name: "John Smith",
        email: "john@example.com",
        dateJoined: "2023-09-10",
        totalOrders: 5
      },
      {
        id: "USR-1002",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        dateJoined: "2023-09-12",
        totalOrders: 3
      },
      {
        id: "USR-1003",
        name: "Michael Wong",
        email: "michael@example.com",
        dateJoined: "2023-09-15",
        totalOrders: 2
      }
    ]);

    // Mock orders
    setOrders([
      {
        id: "ORD-1001",
        clientName: "John Smith",
        orderType: "Business Cards",
        status: "Completed",
        assignedVendor: "PrintMaster Inc.",
        date: "2023-09-15",
        amount: "$45.99"
      },
      {
        id: "ORD-1002",
        clientName: "Sarah Johnson",
        orderType: "Flyers",
        status: "Assigned",
        assignedVendor: "GraphiPrint Co.",
        date: "2023-09-20",
        amount: "$89.50"
      },
      {
        id: "ORD-1003",
        clientName: "Michael Wong",
        orderType: "Banner",
        status: "Pending",
        assignedVendor: "Unassigned",
        date: "2023-09-25",
        amount: "$120.00"
      }
    ]);

    // Mock vendors
    setVendors([
      {
        id: "VEN-1001",
        name: "PrintMaster Inc.",
        email: "info@printmaster.com",
        status: "Active",
        accountNumber: "****1234",
        assignedOrders: 15
      },
      {
        id: "VEN-1002",
        name: "GraphiPrint Co.",
        email: "contact@graphiprint.com",
        status: "Active",
        accountNumber: "****5678",
        assignedOrders: 8
      },
      {
        id: "VEN-1003",
        name: "SpeedyPrints Ltd.",
        email: "hello@speedyprints.com",
        status: "Pending Approval",
        accountNumber: "****9012",
        assignedOrders: 0
      }
    ]);

    // Mock designs
    setDesigns([
      {
        id: "DSG-1001",
        orderId: "ORD-1001",
        clientName: "John Smith",
        vendorName: "PrintMaster Inc.",
        status: "Approved",
        submittedDate: "2023-09-14",
        fileUrl: "#"
      },
      {
        id: "DSG-1002",
        orderId: "ORD-1002",
        clientName: "Sarah Johnson",
        vendorName: "GraphiPrint Co.",
        status: "Awaiting Approval",
        submittedDate: "2023-09-19",
        fileUrl: "#"
      },
      {
        id: "DSG-1003",
        orderId: "ORD-1003",
        clientName: "Michael Wong",
        vendorName: "Unassigned",
        status: "Revision",
        submittedDate: "2023-09-24",
        fileUrl: "#"
      }
    ]);

    // Mock payouts
    setPayouts([
      {
        id: "PAY-1001",
        vendorName: "PrintMaster Inc.",
        orderId: "ORD-1001",
        amount: "$36.79", // 80% of $45.99
        status: "Pending",
        bankDetails: "****1234"
      },
      {
        id: "PAY-1002",
        vendorName: "GraphiPrint Co.",
        orderId: "ORD-1002",
        amount: "$71.60", // 80% of $89.50
        status: "Pending",
        bankDetails: "****5678"
      }
    ]);

    // Mock payments/transactions
    setPayments([
      {
        id: "TRX-1001",
        clientName: "John Smith",
        amountPaid: "$45.99",
        vendorCut: "$36.79", // 80%
        platformCommission: "$9.20", // 20%
        date: "2023-09-15"
      },
      {
        id: "TRX-1002",
        clientName: "Sarah Johnson",
        amountPaid: "$89.50",
        vendorCut: "$71.60", // 80%
        platformCommission: "$17.90", // 20%
        date: "2023-09-20"
      },
      {
        id: "TRX-1003",
        clientName: "Michael Wong",
        amountPaid: "$120.00",
        vendorCut: "$96.00", // 80%
        platformCommission: "$24.00", // 20%
        date: "2023-09-25"
      }
    ]);

    // Mock stats
    setStats({
      totalUsers: 24,
      totalOrders: 32,
      totalVendors: 7,
      pendingOrders: 5,
      pendingPayouts: 2,
      totalEarnings: "$2,450.50",
      revenueThisMonth: "$1,250.00"
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminToken');
      toast.success("Logged out successfully");
      router.push("/Admin/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  // Navigation items configuration
  const navItems = [
    { name: "Dashboard", icon: <FaChartPie /> },
    { name: "Orders Management", icon: <FaBoxOpen /> },
    { name: "Users Management", icon: <FaUsers /> },
    { name: "Vendor Management", icon: <FaUserTie /> },
    { name: "Design Management", icon: <FaPaintBrush /> },
    { name: "Payout", icon: <FaMoneyCheckAlt /> },
    { name: "Payments Overview", icon: <FaReceipt /> }
  ];

  // Tab components
  const tabContent = {

    // DASHBOARD OVERVIEW


    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.email || "Admin"}</span>
          </h1>
          <p className="text-gray-300 mb-6">Here's an overview of the platform</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUsers className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Users</p>
                  <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBoxOpen className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Orders</p>
                  <p className="text-xl font-bold text-white">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUserTie className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Vendors</p>
                  <p className="text-xl font-bold text-white">{stats.totalVendors}</p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaMoneyCheckAlt className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Earnings</p>
                  <p className="text-xl font-bold text-white">{stats.totalEarnings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-yellow-400 mb-2">Revenue This Month</h3>
              <p className="text-2xl font-bold">{stats.revenueThisMonth}</p>
              <div className="h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-yellow-400 w-3/4"></div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-yellow-400 mb-2">Pending Orders</h3>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              <div className="flex items-center text-sm text-gray-400 mt-4">
                <FaClock className="mr-2" /> Needs attention
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-yellow-400 mb-2">Pending Payouts</h3>
              <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
              <div className="flex items-center text-sm text-gray-400 mt-4">
                <FaMoneyCheckAlt className="mr-2" /> To be processed
              </div>
            </div>
          </div>
        </div>

        {/* Activity Graph Placeholder */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Activity Overview</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full">Daily</button>
              <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Weekly</button>
              <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Monthly</button>
            </div>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700 h-64 flex items-center justify-center">
            <p className="text-gray-400">Activity Graph Placeholder</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <button className="text-sm text-yellow-400 hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            <div className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center">
              <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                <FaUser className="text-yellow-400 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-gray-400">Michael Wong • 2023-09-15</p>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center">
              <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                <FaBoxOpen className="text-yellow-400 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-gray-400">ORD-1003 • 2023-09-25</p>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center">
              <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                <FaPaintBrush className="text-yellow-400 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Design submitted for approval</p>
                <p className="text-xs text-gray-400">DSG-1002 • 2023-09-19</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // ORDERS MANAGEMENT

    "Orders Management": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
              <FaBoxOpen className="mr-2" /> All Orders
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              <FaClock className="mr-2" /> Pending
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              <FaCheck className="mr-2" /> Completed
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Order ID</th>
                <th className="pb-3 pr-6">Client</th>
                <th className="pb-3 pr-6">Type</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Assigned Vendor</th>
                <th className="pb-3 pr-6">Amount</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700">
                  <td className="py-4 pr-6">{order.id}</td>
                  <td className="py-4 pr-6">{order.clientName}</td>
                  <td className="py-4 pr-6">{order.orderType}</td>
                  <td className="py-4 pr-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-900 text-green-200" :
                      order.status === "Assigned" ? "bg-blue-900 text-blue-200" :
                        "bg-yellow-900 text-yellow-200"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6">{order.assignedVendor}</td>
                  <td className="py-4 pr-6">{order.amount}</td>
                  <td className="py-4 flex items-center space-x-2">
                    <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View">
                      <FaEdit />
                    </button>
                    <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Reassign">
                      <FaUserTie />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-300 transition" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {orders.length} of {orders.length} entries</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Previous</button>
            <button className="px-3 py-1 bg-yellow-400 text-black rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Next</button>
          </div>
        </div>
      </div>
    ),

    // USERS MANAGEMENT


    "Users Management": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Users Management</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg">Registered Clients</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Name</th>
                <th className="pb-3 pr-6">Email</th>
                <th className="pb-3 pr-6">Date Joined</th>
                <th className="pb-3 pr-6">Total Orders</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="py-4 pr-6">{user.name}</td>
                  <td className="py-4 pr-6">{user.email}</td>
                  <td className="py-4 pr-6">{user.dateJoined}</td>
                  <td className="py-4 pr-6">{user.totalOrders}</td>
                  <td className="py-4 flex items-center space-x-2">
                    <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View Profile">
                      <FaUser />
                    </button>
                    <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Message">
                      <FaEdit />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-300 transition" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {users.length} of {users.length} entries</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Previous</button>
            <button className="px-3 py-1 bg-yellow-400 text-black rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Next</button>
          </div>
        </div>
      </div>
    ),


    // VENDOR MANAGEMENT


    "Vendor Management": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
              <FaUserTie className="mr-2" /> All Vendors
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              <FaExclamationCircle className="mr-2" /> Pending Approval
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search vendors..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Name</th>
                <th className="pb-3 pr-6">Email</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Account Number</th>
                <th className="pb-3 pr-6">Assigned Orders</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-700">
                  <td className="py-4 pr-6">{vendor.name}</td>
                  <td className="py-4 pr-6">{vendor.email}</td>
                  <td className="py-4 pr-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.status === "Active" ? "bg-green-900 text-green-200" :
                      "bg-yellow-900 text-yellow-200"
                      }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6">{vendor.accountNumber}</td>
                  <td className="py-4 pr-6">{vendor.assignedOrders}</td>
                  <td className="py-4 flex items-center space-x-2">
                    <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View Details">
                      <FaUser />
                    </button>
                    {vendor.status === "Pending Approval" ? (
                      <button className="p-1 text-green-400 hover:text-green-300 transition" title="Approve">
                        <FaCheck />
                      </button>
                    ) : (
                      <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Edit Bank Info">
                        <FaEdit />
                      </button>
                    )}
                    <button className="p-1 text-red-400 hover:text-red-300 transition" title="Suspend/Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {vendors.length} of {vendors.length} entries</p>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
              disabled={true} // Disabled for first page
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-yellow-400 text-black rounded-md">
              1
            </button>
            <button
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
              disabled={vendors.length <= 10} // Disable if no next page
            >
              Next
            </button>
          </div>
        </div>
      </div>
    ),

    // DESIGN MANAGEMENT

    "Design Management": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Design Management</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
              <FaPaintBrush className="mr-2" /> All Designs
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              <FaExclamationCircle className="mr-2" /> Awaiting Approval
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              <FaClock className="mr-2" /> Needs Revision
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search designs..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Design ID</th>
                <th className="pb-3 pr-6">Order ID</th>
                <th className="pb-3 pr-6">Client</th>
                <th className="pb-3 pr-6">Vendor</th>
                <th className="pb-3 pr-6">Submitted Date</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {designs.map((design) => (
                <tr key={design.id} className="hover:bg-gray-700">
                  <td className="py-4 pr-6">{design.id}</td>
                  <td className="py-4 pr-6">{design.orderId}</td>
                  <td className="py-4 pr-6">{design.clientName}</td>
                  <td className="py-4 pr-6">{design.vendorName}</td>
                  <td className="py-4 pr-6">{design.submittedDate}</td>
                  <td className="py-4 pr-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${design.status === "Approved" ? "bg-green-900 text-green-200" :
                      design.status === "Awaiting Approval" ? "bg-yellow-900 text-yellow-200" :
                        "bg-red-900 text-red-200"
                      }`}>
                      {design.status}
                    </span>
                  </td>
                  <td className="py-4 flex items-center space-x-2">
                    <button
                      className="p-1 text-blue-400 hover:text-blue-300 transition"
                      title="Preview"
                      onClick={() => window.open(design.fileUrl, '_blank')}
                    >
                      <FaDownload />
                    </button>
                    {design.status !== "Approved" && (
                      <button className="p-1 text-green-400 hover:text-green-300 transition" title="Approve">
                        <FaCheck />
                      </button>
                    )}
                    <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Request Revision">
                      <FaEdit />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-300 transition" title="Reassign">
                      <FaUserTie />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {designs.length} of {designs.length} entries</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Previous</button>
            <button className="px-3 py-1 bg-yellow-400 text-black rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Next</button>
          </div>
        </div>
      </div>
    ),


    // PAYOUTS


    "Payout": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Vendor Payouts</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
              <FaMoneyCheckAlt className="mr-2" /> Pending Payouts
              <span className="ml-2 bg-black text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                {payouts.filter(p => p.status === "Pending").length}
              </span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search payouts..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full md:w-auto"
            // Add onChange handler to handle search filtering
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Payout ID</th>
                <th className="pb-3 pr-6">Vendor Name</th>
                <th className="pb-3 pr-6">Order ID</th>
                <th className="pb-3 pr-6">Amount (80%)</th>
                <th className="pb-3 pr-6">Bank Details</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="py-4 pr-6">{payout.id}</td>
                    <td className="py-4 pr-6">{payout.vendorName}</td>
                    <td className="py-4 pr-6">{payout.orderId}</td>
                    <td className="py-4 pr-6 font-medium text-yellow-400">{payout.amount}</td>
                    <td className="py-4 pr-6 font-mono">{payout.bankDetails}</td>
                    <td className="py-4 pr-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${payout.status === "Pending" ? "bg-yellow-900 text-yellow-200" : "bg-green-900 text-green-200"
                        }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-4 flex items-center space-x-2">
                      <button
                        className="p-1 text-blue-400 hover:text-blue-300 transition"
                        title="View Details"
                        onClick={() => toast.info(`Viewing details for ${payout.id}`)}
                      >
                        <FaUser />
                      </button>
                      {payout.status === "Pending" && (
                        <>
                          <button
                            className="p-1 text-green-400 hover:text-green-300 transition"
                            title="Mark as Paid"
                            onClick={() => {
                              const updatedPayouts = payouts.map(p =>
                                p.id === payout.id ? { ...p, status: "Paid" } : p
                              );
                              setPayouts(updatedPayouts);
                              toast.success(`Payout ${payout.id} marked as paid`);
                            }}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="p-1 text-red-400 hover:text-red-300 transition"
                            title="Reject"
                            onClick={() => toast.warning(`Payout ${payout.id} rejected`)}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No payouts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payout Summary */}
        <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-bold mb-4">Payout Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Pending</p>
              <p className="text-xl font-bold">
                {payouts.filter(p => p.status === "Pending").length} payouts
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Amount Due</p>
              <p className="text-xl font-bold text-yellow-400">
                ${payouts.filter(p => p.status === "Pending").reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Platform Commission (20%)</p>
              <p className="text-xl font-bold text-green-400">
                ${(payouts.filter(p => p.status === "Pending").reduce((sum, p) => {
                  const amount = parseFloat(p.amount) || 0;
                  return sum + (amount * 0.20); // 20% of total
                }, 0)).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
            disabled={payouts.filter(p => p.status === "Pending").length === 0}
            onClick={() => {
              const updatedPayouts = payouts.map(p =>
                p.status === "Pending" ? { ...p, status: "Paid" } : p
              );
              setPayouts(updatedPayouts);
              toast.success("All pending payouts processed");
            }}
          >
            Process All Payouts
          </button>
        </div>
      </div>
    ),


    // PYAMENTS OVERVIEW

    
    "Payments Overview": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Payments Overview</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
              <FaReceipt className="mr-2" /> All Transactions
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
              This Month
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="date"
                placeholder="From date"
                className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onChange={(e) => setFromDate(e.target.value)} // Update state with selected date
              />
            </div>
            <div className="relative">
              <input
                type="date"
                placeholder="To date"
                className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onChange={(e) => setToDate(e.target.value)} // Update state with selected date
              />
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium" onClick={handleFilter}>
              Filter
            </button>
          </div>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${payments.reduce((sum, p) => sum + (parseFloat(p.amountPaid.replace('$', '')) || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Vendor Payouts (80%)</p>
            <p className="text-2xl font-bold text-yellow-400">
              ${payments.reduce((sum, p) => sum + (parseFloat(p.vendorCut.replace('$', '')) || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Platform Earnings (20%)</p>
            <p className="text-2xl font-bold text-green-400">
              ${payments.reduce((sum, p) => sum + (parseFloat(p.platformCommission.replace('$', '')) || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Revenue Breakdown</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full">Monthly</button>
              <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Quarterly</button>
              <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Yearly</button>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Revenue Chart Placeholder</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 pr-6">Transaction ID</th>
                <th className="pb-3 pr-6">Client Name</th>
                <th className="pb-3 pr-6">Amount Paid</th>
                <th className="pb-3 pr-6">Vendor Cut (80%)</th>
                <th className="pb-3 pr-6">Platform (20%)</th>
                <th className="pb-3 pr-6">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No transactions available.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-700">
                    <td className="py-4 pr-6">{payment.id}</td>
                    <td className="py-4 pr-6">{payment.clientName}</td>
                    <td className="py-4 pr-6 font-medium">{payment.amountPaid}</td>
                    <td className="py-4 pr-6 text-yellow-400">{payment.vendorCut}</td>
                    <td className="py-4 pr-6 text-green-400">{payment.platformCommission}</td>
                    <td className="py-4 pr-6">{payment.date}</td>
                    <td className="py-4">
                      <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View Details">
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {payments.length} of {payments.length} entries</p>
          <div className="flex space-x-1">
            {/* Include logic for previous/next buttons here */}
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Previous</button>
            <button className="px-3 py-1 bg-yellow-400 text-black rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition">Next</button>
          </div>
        </div>
      </div>
    )
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="text-gray-300 hover:text-white"
        >
          {mobileNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 hidden lg:block">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === item.name ? 'bg-yellow-400 text-black font-medium' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <FaUser />
                </div>
                <div>
                  <p className="font-medium">{user?.email || "Admin"}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Topbar - Desktop */}
          <header className="bg-gray-800 border-b border-gray-700 p-4 hidden lg:block">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{activeTab}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <FaUser />
                  </div>
                  <span>{user?.email || "Admin"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white flex items-center space-x-1"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              tabContent[activeTab]
            )}
          </main>
        </div>
      </div>
    </div>
  );
}