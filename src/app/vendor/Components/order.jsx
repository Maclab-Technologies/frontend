"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { get } from "@/app/_hooks/fetch-hook";
import Link from "next/link";
// import { toast } from "react-toastify";
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

  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-900/50 text-green-300 border border-green-700";
      case "confirmed":
        return "bg-blue-900/50 text-blue-300 border border-blue-700";
      case "processing":
        return "bg-purple-900/50 text-purple-300 border border-purple-700";
      case "pending":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-700";
      default:
        return "bg-red-900/50 text-red-300 border border-red-700";
    }
  };

  // Loading Skeletons
  const TableLoadingRows = () => (
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
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="h-8 bg-gray-700 rounded w-16 mx-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );

  const CardLoadingSkeletons = () => (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-start mb-3">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-700 rounded-full w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-700 rounded w-28"></div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-full mt-4"></div>
        </div>
      ))}
    </>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="col-span-full text-center py-12">
      <svg
        className="w-16 h-16 text-gray-600 mb-4 mx-auto"
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
      <p className="text-lg font-medium text-gray-300 mb-2">
        No orders found
      </p>
      <p className="text-sm text-gray-500">
        Orders will appear here once customers place them
      </p>
    </div>
  );

  // Order Card Component for Mobile
  const OrderCard = ({ order }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-mono text-xs bg-gray-900 px-2 py-1 rounded mb-1">
            {order.id.slice(0, 12)}...
          </div>
          <p className="text-xs text-gray-400">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.orderStatus)}`}
        >
          {order.orderStatus}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Amount:</span>
          <span className="text-sm font-semibold text-yellow-400">
            {formatCurrency(order.total)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Design Files:</span>
          {order.items?.[0]?.uploadedImages?.length > 0 ? (
            <div className="flex items-center text-green-400 text-sm">
              <FaCheck className="mr-1 flex-shrink-0" size={12} />
              <span>
                {order.items[0].uploadedImages.length} 
                {order.items[0].uploadedImages.length > 1 ? " Designs" : " Design"}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-red-400 text-sm">
              <FaTimes className="mr-1 flex-shrink-0" size={12} />
              <span>No Design</span>
            </div>
          )}
        </div>
      </div>
      
      <Link
        href={`/vendor/order/${order.id}`}
        className="w-full flex items-center justify-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-semibold rounded-lg transition-colors duration-150"
      >
        <Eye className="w-4 h-4 mr-1.5" />
        View Details
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex flex-wrap gap-2">
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

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block">
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
                <TableLoadingRows />
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
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.orderStatus)}`}
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
                  <td colSpan="6">
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (hidden on desktop) */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <CardLoadingSkeletons />
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}