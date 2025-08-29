"use client";
import { batchRequests } from "@/app/hooks/fetch-hook";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/useAuth";
import { FiPackage, FiUsers, FiTruck, FiDollarSign } from "react-icons/fi";
import LoadingErrorHandler from "@/app/components/LoadingErrorHandler";

export default function StatsCards() {
  const [overview, setOverview] = useState({});
  const [userGrowth, setUserGrowth] = useState({});
  const [vendorGrowth, setVendorGrowth] = useState({});
  const [orderGrowth, setOrderGrowth] = useState({});
  const [revenueGrowth, setRevenueGrowth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    overview: null,
    userGrowth: null,
    vendorGrowth: null,
    orderGrowth: null,
    revenueGrowth: null,
  });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2Mzg3NjM3LCJleHAiOjE3NTY0NzQwMzd9.2CtR7gj0gIoHJMJzI2fa7LMHU8EJDh3YwqwwhVUo8C4";

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
        ]);

        const [statsRes] = data;

        if (statsRes.success) {
          // Verify and set overview data
          if (statsRes.data?.data?.overview) {
            setOverview(statsRes.data.data.overview);
          } else {
            setError((prev) => ({
              ...prev,
              overview: "Failed to fetch overview data",
            }));
            toast.warning("Overview data is missing in response");
          }

          // Verify and set growth data with proper checks
          if (statsRes.data?.data?.growth) {
            const { growth } = statsRes.data.data;

            if (growth.orderGrowth !== undefined) {
              setOrderGrowth(growth.orderGrowth);
            } else {
              setError((prev) => ({
                ...prev,
                orderGrowth: "Order growth data missing",
              }));
            }

            if (growth.revenueGrowth !== undefined) {
              setRevenueGrowth(growth.revenueGrowth);
            } else {
              setError((prev) => ({
                ...prev,
                revenueGrowth: "Revenue growth data missing",
              }));
            }

            if (growth.userGrowth !== undefined) {
              setUserGrowth(growth.userGrowth);
            } else {
              setError((prev) => ({
                ...prev,
                userGrowth: "User growth data missing",
              }));
            }

            if (growth.vendorGrowth !== undefined) {
              setVendorGrowth(growth.vendorGrowth);
            } else {
              setError((prev) => ({
                ...prev,
                vendorGrowth: "Vendor growth data missing",
              }));
            }
          } else {
            setError((prev) => ({
              ...prev,
              userGrowth: "Growth data missing",
              vendorGrowth: "Growth data missing",
              orderGrowth: "Growth data missing",
              revenueGrowth: "Growth data missing",
            }));
            toast.warning("Growth data is missing in response");
          }
        } else {
          // Handle API response failure
          const errorMessage =
            statsRes.error?.message || "Failed to fetch stats data";
          setError((prev) => ({ ...prev, overview: errorMessage }));
          toast.warning(errorMessage);
        }
      } catch (error) {
        // Handle unexpected errors
        const errorMessage =
          error.message || "Something went wrong try again later";
        setError((prev) => ({ ...prev, overview: errorMessage }));
        console.error("Error fetching stats data:", error);
        toast.error("An error occurred while fetching stats data");
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };
    fetchStatsData();
  }, [batchRequests, token]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        {loading ? (
          <LoadingErrorHandler loading={loading} error={error.overview} />
        ) : (
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
                  userGrowth.growthRate?.toString().startsWith("")
                    ? "text-gray-50"
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
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        {loading ? (
          <LoadingErrorHandler loading={loading} error={error.userGrowth} />
        ) : (
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
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        {loading ? (
          <LoadingErrorHandler loading={loading} error={error.vendorGrowth} />
        ) : (
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
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        {loading ? (
          <LoadingErrorHandler loading={loading} error={error.revenueGrowth} />
        ) : (
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
        )}
      </div>
    </div>
  );
}
