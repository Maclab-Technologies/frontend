"use client";

import { FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import ActivitySkeleton from "./ActivitySkeleton";
import EmptyState from "./EmptyState";
import { recentOrders } from "@/app/dal/client/dashbard.dal";
import { formatCurrency, getSafeValue } from "@/app/utils/dto";
import StatusBadge from "./StatusBadge";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initOrders = async () => {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.warning("Invalid user token");
        return;
      }
      try {
        const { success, data } = await recentOrders(token);
        if (success) {
          setOrders(data);
        }
      } catch (error) {
        setError.orders(error);
      } finally {
        setLoading(false);
      }
    };

    initOrders();
  }, []);

  return (
    <>
      {loading ? (
        <ActivitySkeleton />
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                    {getSafeValue(order?._id, "N/A")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-400">
                    {getSafeValue(order?.items[0].productId.name)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-yellow-400">
                    {formatCurrency(getSafeValue(order?.total))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-400">
                    {getSafeValue(order?.items[0].quantity)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={order?.orderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={<FaClock />} message="No recent activity" />
      )}
    </>
  );
};
export default RecentOrders;
