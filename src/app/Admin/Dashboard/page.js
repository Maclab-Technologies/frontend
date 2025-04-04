"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseconfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Printer,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Home,
  BarChart2,
  FileText,
  Package,
  Truck,
  Menu,
  X,
} from "lucide-react";

// Content components
import DashboardContent from "../components/DashboardContent";
import OrdersContent from "../components/OrdersContent";
import PrintJobsContent from "../components/PrintJobsContent";
import CustomersContent from "../components/CustomerContent";
import ProductsContent from "../components/ProductsContent";
import InvoicesContent from "../components/InvoicesContent";
import ShippingContent from "../components/ShippingContent";
import AnalyticsContent from "../components/AnalyticsContent";
import SettingsContent from "../components/SettingsContent";

const Dashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/Admin");
      } else {
        setUserEmail(user.email || "");
      }
    });

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Sidebar open on desktop, closed on mobile
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/Admin");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  const handleNavClick = (id) => {
    setActiveContent(id);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, id: "dashboard" },
    { name: "Orders", icon: <ShoppingCart size={20} />, id: "orders" },
    { name: "Print Jobs", icon: <Printer size={20} />, id: "printjobs" },
    { name: "Customers", icon: <Users size={20} />, id: "customers" },
    { name: "Products", icon: <Package size={20} />, id: "products" },
    { name: "Invoices", icon: <FileText size={20} />, id: "invoices" },
    { name: "Shipping", icon: <Truck size={20} />, id: "shipping" },
    { name: "Analytics", icon: <BarChart2 size={20} />, id: "analytics" },
    { name: "Settings", icon: <Settings size={20} />, id: "settings" },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case "orders": return <OrdersContent />;
      case "printjobs": return <PrintJobsContent />;
      case "customers": return <CustomersContent />;
      case "products": return <ProductsContent />;
      case "invoices": return <InvoicesContent />;
      case "shipping": return <ShippingContent />;
      case "analytics": return <AnalyticsContent />;
      case "settings": return <SettingsContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Hamburger Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed z-40 left-4 top-4 p-2 rounded-full bg-yellow-400 text-black border-2 border-black shadow-lg hover:bg-yellow-500 transition"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
          } transform ${isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "relative w-64"
          } bg-gradient-to-b from-black to-gray-800 text-white transition-transform duration-300 ease-in-out flex flex-col h-full`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 bg-yellow-400 border-b-2 border-black px-4">
          <span className="text-black font-bold text-xl">59MINUTES PRINTS</span>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full bg-black text-yellow-400 hover:bg-gray-800 transition"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-md transition duration-200 ${
                activeContent === item.id
                  ? "bg-yellow-400 text-black font-semibold"
                  : "hover:bg-gray-700 text-white"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center mr-3 border border-black">
              <span className="text-black font-medium text-sm">
                {userEmail?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="text-sm truncate">{userEmail || "Admin"}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-white hover:bg-gray-800 rounded-md transition"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 border-b-2 border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find((item) => item.id === activeContent)?.name || "Dashboard"}
            </h1>
            <div className="hidden md:block text-sm text-gray-700">
              Logged in as: <span className="font-medium">{userEmail || "Admin"}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="text-center text-sm text-gray-700 font-medium">
            © {new Date().getFullYear()} 59Minutes Prints | Admin Dashboard v1.0
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;