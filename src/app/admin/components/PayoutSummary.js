"use client";
import { AuthContext } from "@/app/context/useAuth";
import { get } from "@/app/hooks/fetch-hook";
import { useState, useEffect, useContext } from "react";
import {
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

export default function PayoutSummary() {
  const [summaryData, setSummaryData] = useState({});
  const [totalPayouts, setTotalPayouts] = useState({ total: 0, count: 0 });
  const [payoutsByStatus, setPayoutsByStatus] = useState([
    { status: "Pending", totalAmount: 0, count: 0 },
    { status: "Completed", totalAmount: 0, count: 0 },
    { status: "Approved", totalAmount: 0, count: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2Mzg3NjM3LCJleHAiOjE3NTY0NzQwMzd9.2CtR7gj0gIoHJMJzI2fa7LMHU8EJDh3YwqwwhVUo8C4";

      try {
        const res = await get("/admin/payouts/stats/overview", {
          token: secret,
        });

        if (res.success) {
          const data = res.data;
          setPayoutsByStatus(data?.data.payoutsByStatus);
          setTotalPayouts(data?.data.totalPayouts);
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch Payout Summary");
      }
    };

    fetchOrders();
  }, [token, setPayoutsByStatus, setTotalPayouts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {/* All Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Total Payouts
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{totalPayouts.total}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {totalPayouts.count}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Completed Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Successful Payouts
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{payoutsByStatus[1].totalAmount}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {payoutsByStatus[1].count}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Approved Payouts
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{payoutsByStatus[2].totalAmount}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {payoutsByStatus[2].count}
            </p>
          </div>
          Failed
          <div className="ml-4 p-2 md:p-3 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Failed Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              Pending Payouts
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              ₦{payoutsByStatus[0].totalAmount}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">
              {payoutsByStatus[0].count}
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-red-50 text-red-600 flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Total Vendors */}
      {/* <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Vendors Due</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">{totalVendors}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
            <FiUser className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div> */}
    </div>
  );
}
