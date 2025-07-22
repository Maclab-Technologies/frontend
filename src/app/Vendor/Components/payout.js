import { FaFileDownload } from 'react-icons/fa';

export default function Payout(
  {payouts}
) {
  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Payouts History</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Total Payouts</p>
              <p className="text-2xl font-bold">
                ₦
                {payouts
                  .filter((p) => p.status === "Paid")
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold">
                ₦
                {payouts
                  .filter(
                    (p) =>
                      p.status === "Paid" &&
                      new Date(p.date).getMonth() === new Date().getMonth()
                  )
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                ₦
                {payouts
                  .filter((p) => p.status === "Pending")
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payouts ? (
                payouts.map((payout, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {payout.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {payout.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {payout.amount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payout.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {payout.txnId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {payout.status === "Paid" && (
                        <button className="text-blue-400 hover:text-blue-300 flex items-center">
                          <FaFileDownload className="mr-1" /> Download
                        </button>
                      )}
                      {payout.status === "Pending" && (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <div>No Payout History</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
