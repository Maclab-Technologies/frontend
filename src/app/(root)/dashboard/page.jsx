// app/dashboard/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaCheck,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { AuthContext } from "@/app/(root)/_provider/useClientProvider";
import { dashboardStats } from "@/app/dal/client/dashbard.dal";
import { toast } from "react-toastify";
import StatCard from "./_components/StatsCard";
import RecentOrders from "./_components/recentOrders";

export default function ClientDashboard() {
  const { authUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const initTSats = async () => {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.warning("Invalid user token");
        return;
      }
      try {
        const { success, data } = await dashboardStats(token);
        console.log(data)
        if (success) {
          setStats(data.orders);
        }
      } catch (error) {
        setError(error.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    initTSats();
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gray-800 rounded-lg p-4 lg:p-6 text-white">
        <h1 className="text-xl lg:text-2xl font-bold mb-2">
          Welcome back,{" "}
          <span className="text-yellow-400">
            {authUser?.displayName || "Client"}
          </span>
        </h1>
        <p className="text-gray-300 text-sm lg:text-base mb-4 lg:mb-6">
          Here's an overview of your design and print projects
        </p>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-700 rounded-lg p-3 lg:p-4 animate-pulse h-20 lg:h-24"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <StatCard
              icon={<FaShoppingCart className="text-yellow-400 text-sm lg:text-base" />}
              label="Total Orders"
              value={stats.total || "0"}
              compact
            />

            <StatCard
              icon={<FaExclamationCircle className="text-yellow-400 text-sm lg:text-base" />}
              label="Pending Revisions"
              value={stats.pending || "0"}
              compact
            />
            <StatCard
              icon={<FaClock className="text-yellow-400 text-sm lg:text-base" />}
              label="In Progress"
              value={stats.inProgress || "0"}
              compact
            />
            <StatCard
              icon={<FaCheck className="text-yellow-400 text-sm lg:text-base" />}
              label="Completed"
              value={stats.completed || "0"}
              compact
            />
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 lg:p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base lg:text-lg font-bold">Recent Orders</h2>
          <button className="text-xs lg:text-sm text-yellow-400 hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}