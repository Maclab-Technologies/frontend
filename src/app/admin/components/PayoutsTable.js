"use client";
import {
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiCheck,
} from "react-icons/fi";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { get } from "@/app/hooks/fetch-hook";
import { AuthContext } from "@/app/context/useAuth";

export default function PayoutsTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      let secret = token
        ? token
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2Mzg3NjM3LCJleHAiOjE3NTY0NzQwMzd9.2CtR7gj0gIoHJMJzI2fa7LMHU8EJDh3YwqwwhVUo8C4";

      try {
        const res = await get("/admin/withdrawals", { token: secret });

        if (res.success) {
          const data = res.data;
          if (data.data.length !== 0) {
            setPayouts(data?.data);
          } else {
            toast.warning("No payout found");
          }
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch Payouts history");
      }
    };

    fetchOrders();
  }, [token, setPayouts]);

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

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 py-1 text-xs rounded-full inline-flex items-center";
    switch (status) {
      case "completed":
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FiCheckCircle className="mr-1" /> {status}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FiClock className="mr-1" /> {status}
          </span>
        );
      case "processing":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            ⏳ {status}
          </span>
        );
      case "failed":
      case "rejected":
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            ✖ {status}
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
        {payouts.map((payout) => (
          <div
            key={payout._id || payout.id}
            className="mb-4 p-4 bg-gray-700 rounded-lg shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-yellow-500 font-medium text-sm truncate">
                  {payout._id || payout.id}
                </div>
                <div className="text-white font-medium flex items-center mt-1 truncate">
                  <FiUser className="mr-2 flex-shrink-0" />{" "}
                  {payout.vendor.businessName}
                </div>
              </div>
              {/* <div className="text-right ml-2">
                {getStatusBadge(payout.status)}
                <div className="text-xs text-gray-400 mt-1">
                  {payout.method}
                </div>
              </div> */}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-300">
                <FiDollarSign className="mr-2 flex-shrink-0" /> ₦
                {payout.amount.toLocaleString()}
              </div>
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-2 flex-shrink-0" />{" "}
                {payout.requestedAt}
              </div>
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
              {payout.status === "Pending" && (
                <button className="text-green-500 hover:text-green-400 text-sm flex items-center">
                  <FiCheck className="mr-1" /> Approve
                </button>
              )}
              <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                <FiEye className="mr-1" /> Details
              </button>
            </div>
          </div>
        ))}
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
              Payout ID
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Vendor
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Status
            </th>
            {/* <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell"
            >
              Method
            </th> */}
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {payouts.map((payout) => (
            <tr key={payout._id || payout.id} className="hover:bg-gray-750">
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">
                {payout.id || payout._id}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiUser className="mr-2" /> {payout.vendor.businessName}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden md:table-cell">
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" /> ₦
                  {payout.amount.toLocaleString()}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> {payout.requestedAt}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(payout.status)}
              </td>
              {/* <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden lg:table-cell">
                {payout.method}
              </td> */}
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  {payout.status === "Pending" && (
                    <button className="text-green-500 hover:text-green-400">
                      Approve
                    </button>
                  )}
                  <button className="text-blue-500 hover:text-blue-400">
                    Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
