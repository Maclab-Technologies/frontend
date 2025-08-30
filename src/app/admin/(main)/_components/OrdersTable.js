"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/(clients)/_provider/useClientProvider";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Truck,
  Printer,
  CheckCircle,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";
import { get } from "@/app/_hooks/fetch-hook";
import LoadingErrorHandler from "@/app/_components/LoadingErrorHandler";
import { AdminAuthContext } from "../_provider/useAdminProvider";

// Orders Table Component
const OrdersTable = ({ filterQueries }) => {
  const { adminToken } = useContext(AdminAuthContext);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (!adminToken) {
        throw new Error("No token found");
      }
      try {
        const res = await get("/admin/orders", { token: adminToken });

        if (res.success) {
          const data = res.data;
          if (data.data.length !== 0) {
            setLoading(false);
            setFilteredOrders(data?.data);
          } else {
            setLoading(false);
            toast.warning("No order found");
            setError("No order found");
          }
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch orders history");
        setError("Failed to fetch orders history");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminToken, filterQueries]);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Processing":
        return (
          <span
            className={`${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`}
          >
            <Printer size={12} /> {status}
          </span>
        );
      case "Design Review":
        return (
          <span
            className={`${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`}
          >
            <Edit size={12} /> {status}
          </span>
        );
      case "Shipped":
        return (
          <span
            className={`${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}
          >
            <Truck size={12} /> {status}
          </span>
        );
      case "Delivered":
        return (
          <span
            className={`${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`}
          >
            <CheckCircle size={12} /> {status}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Customer ID
              </th>
              {/* <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Customer
              </th> */}
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <LoadingErrorHandler loading={loading} error={error}>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 text-sm font-mono text-yellow-400 font-medium">
                    {order.id || order._id}
                  </td>
                  <td className="p-4 text-sm text-gray-300">{order.user}</td>
                  <td className="p-4 text-sm text-gray-100 font-semibold">
                    ₦{order.total.toLocaleString()}
                  </td>
                  {/* <td className="p-4 text-sm text-gray-100">{order.customer}</td> */}
                  <td className="p-4 text-sm text-gray-100">
                    {order.paymentStatus}
                  </td>

                  <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </LoadingErrorHandler>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        <LoadingErrorHandler loading={loading} error={error}>
          {filteredOrders.map((order) => (
            <div
              key={order.id || order._id}
              className="bg-gray-700/50 rounded-xl p-4 space-y-3 backdrop-blur-sm border border-gray-600/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-mono font-semibold text-sm">
                  {order.id || order._id}
                </span>
                <button className="p-1 text-gray-400 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">USer ID</span>
                <span className="text-gray-100">{order.user}</span>
              </div>
              <div className="space-y-2">
                {/* <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Customer ID</span>
                <span className="text-white font-medium">{order.user}</span>
              </div> */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Amount</span>
                  <span className="text-white font-semibold">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Payment Status</span>
                  <span className="text-white">{order.paymentStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Date</span>
                  <span className="text-gray-100">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                {getStatusBadge(order.orderStatus)}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </LoadingErrorHandler>
      </div>
    </div>
  );
};
export default OrdersTable;
