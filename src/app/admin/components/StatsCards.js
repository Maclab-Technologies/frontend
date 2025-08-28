"use client";
import { batchRequests } from "@/app/hooks/fetch-hook";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/useAuth";
import { FiPackage, FiUsers, FiTruck, FiDollarSign } from "react-icons/fi";

export default function StatsCards() {
  const { token } = useContext(AuthContext)
  const [overview, setOverview] = useState({});
  const [userGrowth, setUserGrowth] = useState({});
  const [vendorGrowth, setVendorGrowth] = useState({});
  const [orderGrowth, setOrderGrowth] = useState({});
  const [revenueGrowth, setRevenueGrowth] = useState({});

  useEffect(() => {
    const fetchStatsData = async () => {
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2MTM1NjE2LCJleHAiOjE3NTYyMjIwMTZ9.2Gjepd-IQdm_QjB-zl84O8iEA_sRIFoecfCATOBJS0w"

      try {
        if (!secret) {
          throw new Error("No token found");
        }

        const data = await batchRequests([
          {
            url: "/admin/dashboard/stats",
            options: {
              method: "GET",
              token: secret,
              config: { showtoast: false },
            },
          },
          // { url: '/api/admin/total-clients', method: 'GET', headers: { 'Authorization': `Bearer ${token}` } },
          // { url: '/api/admin/total-vendors', method: 'GET', headers: { 'Authorization': `Bearer ${token}` } },
          // { url: '/api/admin/total-revenue', method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }
        ]);

        const [statsRes] = data;

        if (statsRes.success) {
          setOverview(statsRes.data.data.overview);
          setOrderGrowth(statsRes.data.data.growth.orderGrowth);
          setRevenueGrowth(statsRes.data.data.growth.revenueGrowth);
          setUserGrowth(statsRes.data.data.growth.userGrowth);
          setVendorGrowth(statsRes.data.data.growth.vendorGrowth);
        } else {
          toast.warning("Failed to fetch stats data");
        }
      } catch (error) {
        console.error("Error fetching stats data:", error);
        toast.error("An error occurred while fetching stats data");
      }
    };
    fetchStatsData();
  }, [batchRequests, token]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col">
          <div className="w-fit p2 bg-white rounded-full text-yellow-600">
            <FiPackage />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Total Orders</p>
            <p className="text-2xl font-bold mt-1">
              {overview.totalOrders || "NAN"}
            </p>
            <p
              className={`text-sm mt-1 ${
                userGrowth.growthRate?.toString().startsWith("") ?  
                "text-gray-50"
                : userGrowth.growthRate?.toString().startsWith("+")
                  ? "text-green-600"
                  : userGrowth.growthRate?.toString().startsWith("-")
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {orderGrowth.growthRate || "NAN"}% l-m
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Total Users</p>
            <p className="text-2xl font-bold mt-1">
              {overview.totalOrders || "NAN"}
            </p>
            <p
              className={`text-sm mt-1 ${
                userGrowth.growthRate?.toString().startsWith("+")
                  ? "text-green-600"
                  : userGrowth.growthRate?.toString().startsWith("-")
                    ? "text-red-600"
                    : "text-gray-50"
              }`}
            >
              {userGrowth.growthRate || "NAN"}% l-m
            </p>
          </div>
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <FiUsers className="h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Total Vendors</p>
            <p className="text-2xl font-bold mt-1">
              {overview.totalVendors || "NAN"}
            </p>
            <p
              className={`text-sm mt-1 ${
                userGrowth.growthRate?.toString().startsWith("+")
                  ? "text-green-600"
                  : userGrowth.growthRate?.toString().startsWith("-")
                    ? "text-red-600"
                    : "text-gray-50"
              }`}
            >
              {vendorGrowth.growthRate | "NAN"}% l-m
            </p>
          </div>
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <FiTruck className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">
              ₦{overview.totalRevenue || "NAN"}
            </p>
            <p
              className={`text-sm mt-1 ${
                userGrowth.growthRate?.toString().startsWith("+")
                  ? "text-green-600"
                  : userGrowth.growthRate?.toString().startsWith("-")
                    ? "text-red-600"
                    : "text-gray-50"
              }`}
            >
              {revenueGrowth.growthRate || "NAN"}% l-m
            </p>
          </div>
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <FiDollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
