'use client'


import { useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import EmptyState from "../_components/EmptyState";
import ActivitySkeleton from "../_components/ActivitySkeleton";
import { toast } from "react-toastify";
import { getTransactions } from "@/app/dal/client/dashbard.dal";
import { formatCurrency } from "@/app/utils/dto";
import StatusBadge from "../_components/StatusBadge";

export default function Transaction() {
  const [transactions, setTransaction] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  // const [pagination, setPagination] = useState({})

  useEffect(() => {
    const initOrders = async () => {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.warning("Invalid user token");
        return;
      }
      try {
        const { success, data } = await getTransactions(token);
        if (success) {
          setTransaction(data.transactions);
          // setPagination(data.pagination)
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
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {transactions.map((transaction, idx) => (
                <tr key={idx} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                    {transaction?._id || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-yellow-400">
                    {formatCurrency(transaction?.amount || "N/A")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-400">
                    {transaction?.method}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                   <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-400">
                    {transaction?.paidAt ? new Date(transaction.paidAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))},
            </tbody>
          </table>
        </div> 

      ) : (
        <EmptyState
          icon={<FaMoneyBillWave />} 
            message="No transactions yet"
          // actionText="Create your first order"
          // onAction={() => setActiveTab("Create Design Request")}
        />
      )}
    </>
  );
}
