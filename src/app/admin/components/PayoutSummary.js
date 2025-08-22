import { FiUser, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

export default function PayoutSummary() {
  const summaryData = {
    pendingAmount: 320000,
    completedAmount: 2300000,
    failedAmount: 450000,
    totalVendors: 8
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {/* Pending Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Pending Payouts</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{summaryData.pendingAmount.toLocaleString()}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Completed Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Completed Payouts</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{summaryData.completedAmount.toLocaleString()}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Failed Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Failed Payouts</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{summaryData.failedAmount.toLocaleString()}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-red-50 text-red-600 flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Total Vendors */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Vendors Due</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">{summaryData.totalVendors}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
            <FiUser className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}