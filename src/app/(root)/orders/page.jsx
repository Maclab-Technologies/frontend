"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { get } from "@/app/_hooks/fetch-hook";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");

    if (!token) {
      router.push("/vendor/login");
    }
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const order = await get("/orders/vendor/my-orders", { token });

        if (order.data.success) {
          setOrders(order.data.data);
        } else {
          toast.error("Something went wrong, please try again.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, setOrders, setLoading]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingRows = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-700 rounded-full w-20"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </td>
        </tr>
      ))}
    </>
  );

  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white text-white">
            All
          </button>
          <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-yellow-400 text-yellow-400">
            Pending
          </button>
          <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-purple-400 text-purple-400">
            In Review
          </button>
          <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-green-400 text-green-400">
            Completed
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Design Files
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {loading ? (
              <LoadingRows />
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <div className="font-mono text-xs bg-gray-800 px-2 py-1 rounded inline-block">
                      {order.id.slice(0, 12)}...
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                    ${
                      order.orderStatus === "delivered"
                        ? "bg-green-900/50 text-green-300 border border-green-700"
                        : order.orderStatus === "confirmed"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                          : order.orderStatus === "processing"
                            ? "bg-purple-900/50 text-purple-300 border border-purple-700"
                            : order.orderStatus === "pending"
                              ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                              : "bg-red-900/50 text-red-300 border border-red-700"
                    }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-yellow-400">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.items?.[0]?.uploadedImages?.length > 0 ? (
                      <div className="flex items-center text-green-400">
                        <FaCheck className="mr-2 flex-shrink-0" />
                        <span className="font-medium">
                          {order.items[0].uploadedImages.length} Design
                          {order.items[0].uploadedImages.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <FaTimes className="mr-2 flex-shrink-0" />
                        <span>No Design</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <Link
                      href={`/vendor/order/${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-semibold rounded-lg transition-colors duration-150"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-300">
                      No orders found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Orders will appear here once customers place them
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
