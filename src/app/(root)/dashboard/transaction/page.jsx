// app/dashboard/transactions/page.jsx
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
        }
      } catch (error) {
        setError(error.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    initOrders();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6 text-white">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Transactions</h1>
      
      {loading ? (
        <ActivitySkeleton />
      ) : error ? (
        <div className="text-red-400 p-4 text-center">{error}</div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-3 py-3 lg:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-3 py-3 lg:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 lg:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 py-3 lg:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 lg:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {transactions.map((transaction, idx) => (
                  <tr key={idx} className="hover:bg-gray-750 transition-colors">
                    <td className="px-3 py-3 lg:px-4 whitespace-nowrap text-xs lg:text-sm font-mono text-gray-300">
                      {transaction?._id ? transaction._id.substring(0, 8) + '...' : "N/A"}
                    </td>
                    <td className="px-3 py-3 lg:px-4 whitespace-nowrap text-xs lg:text-sm font-semibold text-yellow-400">
                      {formatCurrency(transaction?.amount || "N/A")}
                    </td>
                    <td className="px-3 py-3 lg:px-4 whitespace-nowrap text-xs lg:text-sm font-semibold text-green-400">
                      {transaction?.method}
                    </td>
                    <td className="px-3 py-3 lg:px-4 whitespace-nowrap">
                     <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-3 py-3 lg:px-4 whitespace-nowrap text-xs lg:text-sm font-semibold text-blue-400">
                      {transaction?.paidAt ? new Date(transaction.paidAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
      ) : (
        <EmptyState
          icon={<FaMoneyBillWave />} 
          message="No transactions yet"
        />
      )}
    </div>
  );
}