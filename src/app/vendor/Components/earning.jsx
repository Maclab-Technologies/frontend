"use client";
import LoadingMiddleware from "@/app/_components/loading";
import { FaMoneyBillWave, FaDollarSign, FaClock } from "react-icons/fa";

export default function Earnings({ earnings, earningsStats, loading }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Your Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        { loading ? (<LoadingMiddleware /> ) : (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Net Profit</h3>
            <FaMoneyBillWave className="text-green-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            ₦{earningsStats.netAmount || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">Ready to withdraw</p>
        </div>
        )}

{ loading ? (<LoadingMiddleware /> ) : (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Platform Fee</h3>
            <FaDollarSign className="text-yellow-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            ₦{earningsStats.platformFee || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">Comission fee</p>
        </div>
        )}

{ loading ? (<LoadingMiddleware /> ) : (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Gross Profit</h3>
            <FaClock className="text-blue-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-blue-400">
            ₦{earningsStats.grossAmount || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">All payments</p>
        </div>
)}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Commission Rate</span>
            <span className="text-sm font-medium">80%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "80%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            You receive 80% of each sale, 20% goes to platform fee
          </p>
        </div>

        <h3 className="font-medium mb-3">Earnings Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  GA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  PF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  NA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {earnings.map((e, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {e.payment.id || e.payment._id || NAN}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {e.order || NAN}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦{e.grossAmount || NAN}
                  </td>
                 <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦{e.platformFee || NAN}
                  </td>
                 <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦{e.netAmount || NAN}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                   {e.payment.status || "pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
