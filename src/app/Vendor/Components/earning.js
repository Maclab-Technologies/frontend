import { FaMoneyBillWave, FaDollarSign, FaClock } from 'react-icons/fa';

export default function Earnings({ earnings }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Your Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Available Balance</h3>
            <FaMoneyBillWave className="text-green-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            ₦{earnings.available || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">Ready to withdraw</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Total Earnings</h3>
            <FaDollarSign className="text-yellow-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            ₦{earnings.total || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">Lifetime earnings</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Pending</h3>
            <FaClock className="text-blue-400 text-xl" />
          </div>
          <p className="text-3xl font-bold text-blue-400">
            ₦{earnings.pending || 0}
          </p>
          <p className="text-sm text-gray-400 mt-2">Processing withdrawals</p>
        </div>
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

        <h3 className="font-medium mb-3">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  June 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">12</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  ₦48,000
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                  ₦38,400
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  May 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">15</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  ₦65,000
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                  ₦52,000
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  April 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">8</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  ₦32,000
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                  ₦25,600
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}