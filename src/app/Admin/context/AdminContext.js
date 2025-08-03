'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock data states
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});

  const loadMockData = () => {
    setUsers([
      { id: "USR-1001", name: "John Smith", email: "john@example.com", dateJoined: "2023-09-10", totalOrders: 5 },
      { id: "USR-1002", name: "Sarah Johnson", email: "sarah@example.com", dateJoined: "2023-09-12", totalOrders: 3 },
      { id: "USR-1003", name: "Michael Wong", email: "michael@example.com", dateJoined: "2023-09-15", totalOrders: 2 }
    ]);

    setOrders([
      { id: "ORD-1001", clientName: "John Smith", orderType: "Business Cards", status: "Completed", assignedVendor: "PrintMaster Inc.", date: "2023-09-15", amount: "₦45.99" },
      { id: "ORD-1002", clientName: "Sarah Johnson", orderType: "Flyers", status: "Assigned", assignedVendor: "GraphiPrint Co.", date: "2023-09-20", amount: "₦89.50" },
      { id: "ORD-1003", clientName: "Michael Wong", orderType: "Banner", status: "Pending", assignedVendor: "Unassigned", date: "2023-09-25", amount: "₦120.00" }
    ]);

    setVendors([
      { id: "VEN-1001", name: "PrintMaster Inc.", email: "info@printmaster.com", status: "Active", accountNumber: "****1234", assignedOrders: 15 },
      { id: "VEN-1002", name: "GraphiPrint Co.", email: "contact@graphiprint.com", status: "Active", accountNumber: "****5678", assignedOrders: 8 },
      { id: "VEN-1003", name: "SpeedyPrints Ltd.", email: "hello@speedyprints.com", status: "Pending Approval", accountNumber: "****9012", assignedOrders: 0 }
    ]);

    setStats({
      totalUsers: 24,
      totalOrders: 32,
      totalVendors: 7,
      pendingOrders: 5,
      pendingPayouts: 2,
      totalEarnings: "₦2,450.50",
      revenueThisMonth: "₦1,250.00"
    });
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin_data');
      toast.success("Logged out successfully");
      router.push("/Admin/auth/login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    loadMockData();
    setLoading(false);
  }, []);

  return (
    <AdminContext.Provider value={{
      activeTab, setActiveTab,
      mobileNavOpen, setMobileNavOpen,
      loading, setLoading,
      users, orders, vendors, designs, payouts, payments, stats,
      handleLogout,
      loadMockData
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}