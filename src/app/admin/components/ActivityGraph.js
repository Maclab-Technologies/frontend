"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/useAuth";
import { get } from "@/app/hooks/fetch-hook";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingErrorHandler from "@/app/components/LoadingErrorHandler";

export default function ActivityGraph() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2Mzg3NjM3LCJleHAiOjE3NTY0NzQwMzd9.2CtR7gj0gIoHJMJzI2fa7LMHU8EJDh3YwqwwhVUo8C4";

      try {
        if (!secret) {
          throw new Error("No token found");
        }

        const res = await get(
          "/admin/analytics/revenue?timeRange=30d&granularity=daily",
          { token: secret }
        );

        if (res.data.success) {
          setData(res.data.data.revenueData);
          setLoading(false);
        }
      } catch (error) {
        setError("Something went wrong try again later");
        setLoading(false);
        console.error("Error fetching stats data:", error);
        toast.error("An error occurred while fetching stats data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [get, token]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`${label}`}</p>
          <p className="text-yellow-400">{`Orders: ${payload[0].value}`}</p>
          <p className="text-blue-400">
            {`Revenue: ₦${(payload[1].value / 1000000).toFixed(1)}M`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format revenue for Y-axis (in millions)
  const formatRevenue = (value) => `₦${(value / 1000000).toFixed(1)}M`;

  // Get total revenue for the week
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const maxRevenue = Math.max(...data.map((item) => item.totalRevenue));
  const peakDay = data.find((item) => item.totalRevenue === maxRevenue);

  return (
    <>
      
      <div className="space-y-6">
        {/* Header Section */}
        {loading ? (
          <LoadingErrorHandler loading={loading} error={error} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Order Activity
                </h3>
                <p className="text-sm text-gray-400">
                  Weekly orders and revenue overview
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-right">
                <p className="text-xs text-gray-400">Peak: {peakDay?._id}</p>
                <p className="text-sm font-medium text-yellow-400">
                  ₦{(totalRevenue / 1000000).toFixed(1)}M total
                </p>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="Order"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    axisLine={{ stroke: "#4B5563" }}
                  />
                  <YAxis
                    yAxisId="transactionCount"
                    orientation="left"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    axisLine={{ stroke: "#4B5563" }}
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="right"
                    tickFormatter={formatRevenue}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    axisLine={{ stroke: "#4B5563" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#9CA3AF" }} iconType="rect" />
                  <Bar
                    yAxisId="Order"
                    dataKey="transactionCount"
                    fill="#FCD34D"
                    name="Orders"
                    radius={[2, 2, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <Bar
                    yAxisId="revenue"
                    dataKey="totalRevenue"
                    fill="#60A5FA"
                    name="Revenue (₦)"
                    radius={[2, 2, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-400">Avg Orders</p>
                <p className="text-sm font-semibold text-white">
                  {Math.round(
                    data.reduce((sum, item) => sum + item.transactionCount, 0) /
                      data.length
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Best Day</p>
                <p className="text-sm font-semibold text-yellow-400">
                  {peakDay?._id}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Peak Orders</p>
                <p className="text-sm font-semibold text-blue-400">
                  {peakDay?.transactionCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Growth</p>
                <p className="text-sm font-semibold text-green-400">+12.5%</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
