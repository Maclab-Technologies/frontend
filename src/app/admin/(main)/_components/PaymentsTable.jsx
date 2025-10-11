"use client";
import {
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiClipboard,
} from "react-icons/fi";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { get } from "@/app/_hooks/fetch-hook";
import LoadingErrorHandler from "@/app/_components/LoadingErrorHandler";
import { AdminAuthContext } from "../_provider/useAdminProvider";

export default function PaymentsTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { adminToken } = useContext(AdminAuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      
      if(!adminToken){
        throw new Error("No token found")
      }
      try {
        const res = await get("/admin/payments/transactions", {
          token: adminToken,
        });

        if (res.success) {
          const data = res.data;
          if (data.data.length !== 0) {
            setPayments(data?.data);
            setLoading(false);
          } else {
            toast.warning("No payment found");
            setError("no payment found");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        setError("Failed to fetch payment history");
        toast.error("Failed to fetch payment history");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminToken, setPayments]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Sample payments data
  // const payments = [
  //   {
  //     id: "PMT-5001",
  //     customer: "John Doe",
  //     amount: 45000,
  //     date: "2023-06-15",
  //     method: "Card",
  //     status: "Successful",
  //     orderId: "ORD-1248",
  //   },
  //   {
  //     id: "PMT-5002",
  //     customer: "Sarah Smith",
  //     amount: 125000,
  //     date: "2023-06-14",
  //     method: "Transfer",
  //     status: "Successful",
  //     orderId: "ORD-1247",
  //   },
  //   {
  //     id: "PMT-5003",
  //     customer: "Mike Johnson",
  //     amount: 65000,
  //     date: "2023-06-13",
  //     method: "Card",
  //     status: "Successful",
  //     orderId: "ORD-1246",
  //   },
  //   {
  //     id: "PMT-5004",
  //     customer: "Emma Wilson",
  //     amount: 32000,
  //     date: "2023-06-12",
  //     method: "Paystack",
  //     status: "Failed",
  //     orderId: "ORD-1245",
  //   },
  //   {
  //     id: "PMT-5005",
  //     customer: "David Brown",
  //     amount: 89000,
  //     date: "2023-06-11",
  //     method: "Transfer",
  //     status: "Refunded",
  //     orderId: "ORD-1244",
  //   },
  // ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full";
    switch (status) {
      case "successful":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            ✓ {status}
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            ✖ {status}
          </span>
        );
      case "refunded":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            ↩ {status}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            ⏳ {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="p-4">
        <LoadingErrorHandler loading={loading} error={error}>
          {payments.map((payment) => (
            <div
              key={payment.id || payment._id}
              className="mb-4 p-4 bg-gray-700 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-yellow-500 font-medium text-sm truncate">
                    {payment.id}
                  </div>
                  <div className="text-white font-medium flex items-center mt-1 truncate">
                    <FiUser className="mr-2 flex-shrink-0" />{" "}
                    {payment.user.fullName}
                  </div>
                </div>
                <div className="text-right ml-2">
                  {getStatusBadge(payment.status)}
                  <div className="text-xs text-gray-400 mt-1">
                    {payment.method}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-300">
                  <FiDollarSign className="mr-2 flex-shrink-0" /> ₦
                  {payment.amount.toLocaleString()}
                </div>
                <div className="flex items-center text-gray-300">
                  <FiCalendar className="mr-2 flex-shrink-0" /> {payment.date}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  Order: {payment.order?.id || payment.order?._id}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center">
                  <FiEye className="mr-1" /> Details
                </button>
                <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                  <FiClipboard className="mr-1" /> Actions
                </button>
              </div>
            </div>
          ))}
        </LoadingErrorHandler>
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Payment ID
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell"
            >
              Order ID
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden xl:table-cell"
            >
              Method
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <LoadingErrorHandler loading={loading} error={error}>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {payments.map((payment) => (
              <tr key={payment.id || payment._id} className="hover:bg-gray-750">
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">
                  {payment.id || payment._id}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                  <div className="flex items-center">
                    <FiUser className="mr-2" /> {payment.user.fullName}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden md:table-cell">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-1" /> ₦
                    {payment.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-yellow-500 hidden lg:table-cell">
                  {payment.order?.id || payment.order?._id}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" /> {payment.createdAt}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden xl:table-cell">
                  <div className="flex items-center">
                    <FiCreditCard className="mr-1" /> {payment.method}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-yellow-500 hover:text-yellow-400">
                      Details
                    </button>
                    <button className="text-blue-500 hover:text-blue-400">
                      Actions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </LoadingErrorHandler>
      </table>
    </div>
  );
}
