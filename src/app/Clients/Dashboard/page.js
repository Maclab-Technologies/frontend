// Clients/Dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/Auth/Login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/Auth/Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 bg-gray-800 text-white p-6 w-64 z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="space-y-4">
          <button className="block w-full text-left py-2 hover:text-yellow-400">
            Home
          </button>
          <button className="block w-full text-left py-2 hover:text-yellow-400">
            Orders
          </button>
          <button className="block w-full text-left py-2 hover:text-yellow-400">
            Products
          </button>
          <button className="block w-full text-left py-2 hover:text-yellow-400">
            Profile
          </button>
          {/* Add more sidebar navigation buttons here if needed */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:ml-0">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow p-4 flex items-center justify-between md:justify-start mb-6">
          {/* Mobile Top Bar: Hamburger Toggler */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
            {/* <h1 className="ml-2 text-2xl font-bold text-gray-800">Dashboard</h1> */}
          </div>
          {/* Desktop Top Bar */}
          <div className="flex ">
            <h1 className="text-2xl font-bold text-gray-800 ">
              Welcome, {user.displayName || user.email}!
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <section className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            You are now in the protected dashboard. This area can display your orders,
            product stats, and more.
          </p>
          {/* Additional widgets or components can be added here */}
        </section>
      </main>
    </div>
  );
}
