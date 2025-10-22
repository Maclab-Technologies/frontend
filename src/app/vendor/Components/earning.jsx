"use client";
import LoadingMiddleware from "@/app/_components/loading";
import { FaMoneyBillWave, FaDollarSign, FaClock, FaExclamationTriangle } from "react-icons/fa";

export default function Earnings({ earnings, earningsStats, loading }) {
  // Format currency helper
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Safe value getter
  const getSafeValue = (value, fallback = 0) => {
    return value || fallback;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Your Earnings</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Net Profit Card */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          {loading ? (
            <LoadingMiddleware />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Net Profit</h3>
                <FaMoneyBillWave className="text-green-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(getSafeValue(earningsStats?.netAmount))}
              </p>
              <p className="text-sm text-gray-400 mt-2">Ready to withdraw</p>
            </>
          )}
        </div>

        {/* Platform Fee Card */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          {loading ? (
            <LoadingMiddleware />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Platform Fee</h3>
                <FaDollarSign className="text-yellow-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {formatCurrency(getSafeValue(earningsStats?.platformFee))}
              </p>
              <p className="text-sm text-gray-400 mt-2">Commission fee</p>
            </>
          )}
        </div>

        {/* Gross Profit Card */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          {loading ? (
            <LoadingMiddleware />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Gross Profit</h3>
                <FaClock className="text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {formatCurrency(getSafeValue(earningsStats?.grossAmount))}
              </p>
              <p className="text-sm text-gray-400 mt-2">All payments</p>
            </>
          )}
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Commission Rate</span>
            <span className="text-sm font-medium">80%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: "80%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            You receive 80% of each sale, 20% goes to platform fee
          </p>
        </div>

        {/* Earnings Transaction History */}
        <h3 className="font-medium mb-3">Earnings Transaction History</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingMiddleware />
          </div>
        ) : earnings && earnings.length > 0 ? (
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
                    Gross Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Platform Fee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {earnings.map((earning, idx) => (
                  <tr key={idx} className="hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                      {getSafeValue(earning?.payment?.id || earning?.payment?._id, "N/A")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                      {getSafeValue(earning?.order, "N/A")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-400">
                      {formatCurrency(getSafeValue(earning?.grossAmount))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-yellow-400">
                      {formatCurrency(getSafeValue(earning?.platformFee))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-400">
                      {formatCurrency(getSafeValue(earning?.netAmount))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          (earning?.payment?.status || "pending") === "completed"
                            ? "bg-green-900/50 text-green-300 border border-green-700"
                            : (earning?.payment?.status || "pending") === "pending"
                            ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                            : "bg-red-900/50 text-red-300 border border-red-700"
                        }`}
                      >
                        {getSafeValue(earning?.payment?.status, "pending")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-700 rounded-lg">
            <FaExclamationTriangle className="mx-auto text-gray-500 text-3xl mb-3" />
            <p className="text-gray-400 text-lg font-medium">No transactions found</p>
            <p className="text-gray-500 text-sm mt-1">
              Your earnings transactions will appear here
            </p>
          </div>
        )}
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Payment Schedule</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• Payments are processed weekly</li>
              <li>• Minimum withdrawal: ₦1,000</li>
              <li>• Processing time: 2-3 business days</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Need Help?</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• Contact support for payment issues</li>
              <li>• Report discrepancies within 7 days</li>
              <li>• View detailed reports in dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}