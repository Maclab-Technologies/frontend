"use client";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
} from "react-icons/fi";
import { useEffect, useState, useContext } from "react";
import { get } from "@/app/hooks/fetch-hook";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/useAuth";

export default function RevenueSummary() {
  const { token } = useContext(AuthContext);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2Mzg3NjM3LCJleHAiOjE3NTY0NzQwMzd9.2CtR7gj0gIoHJMJzI2fa7LMHU8EJDh3YwqwwhVUo8C4";

      try {
        const res = await get("/admin/payments/summary", {
          token: secret,
        });

        if (res.success) {
          const data = res.data;
          setRevenue(data?.data);
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch revenue stats");
      }
    };

    fetchOrders();
  }, [token, setRevenue]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              TotalPayment Volume{" "}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{revenue.totalAmount}
            </p>
            <p
              className={`text-xs md:text-sm mt-1 ${revenue.growthRate > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {revenue.growthRate > 0 ? "↑" : "↓"}{" "}
              {Math.abs(revenue.growthRate)}% from last month
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0">
            <FiDollarSign className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Platform Earnings */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Total Platform Fee (20%)
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{revenue.totalPlatformFees}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Successfull Payments
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {revenue.completedTransactions}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Pending Payments
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {revenue.pendingTransactions}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Vendor Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Failed Payments
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {revenue.failedTransactions}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
            <FiPieChart className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
