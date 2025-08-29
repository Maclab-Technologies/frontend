"use client";
import { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/useAuth";
import { get } from "@/app/hooks/fetch-hook";
import {
  FiTruck,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
} from "react-icons/fi";
import LoadingErrorHandler from "@/app/components/LoadingErrorHandler";

export default function VendorsTable() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let secret = token ? token : process.env.NEXT_PUBLIC_TOKEN;
      try {
        const res = await get(
          "/admin/vendors?page=1&limit=20&status=&verified=&search=&sortBy=createdAt&sortOrder=desc",
          { token: secret }
        );

        if (res.success) {
          const data = res.data;
          if (data.data.length !== 0) {
            setVendors(data?.data);
            setLoading(false);
          } else {
            toast.warning("No vendor found");
            setError("No vendor found");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch vendors");
        setError("Failed to fetch vendors");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, setVendors]);

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 py-1 text-xs rounded-full inline-flex items-center";
    switch (status) {
      case "verified":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FiCheckCircle className="mr-1" /> {status}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            ⏳ {status}
          </span>
        );
      case "suspended":
      case "banned":
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <FiXCircle className="mr-1" /> {status}
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Vendor ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Vendor
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Total sales
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Joined Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-500 text-white">
          <LoadingErrorHandler loading={loading} error={error}>
            {vendors.map((vendor) => (
              <tr key={vendor.id || vendor._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                  {vendor.id || vendor._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white flex items-center">
                  <FiTruck className="mr-2 text-gray-200" />{" "}
                  {vendor.businessName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center">
                    <FiMail className="mr-1" /> {vendor.businessEmail}
                  </div>
                  <div className="flex items-center mt-1">
                    <FiPhone className="mr-1" /> {vendor.businessPhoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {vendor.totalSales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(vendor.verificationStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {vendor.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-yellow-600 hover:text-yellow-900">
                    <FiEdit2 className="inline mr-1" /> Manage
                  </button>
                </td>
              </tr>
            ))}
          </LoadingErrorHandler>
        </tbody>
      </table>
    </div>
  );
}
