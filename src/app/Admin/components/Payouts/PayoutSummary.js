import { FiUser,  FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

export default function PayoutSummary() {
  const summaryData = {
    pendingAmount: 320000,
    completedAmount: 2300000,
    failedAmount: 450000,
    totalVendors: 8
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Pending Payouts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Payouts</p>
            <p className="text-2xl font-bold mt-1">₦{summaryData.pendingAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <FiAlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Completed Payouts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Payouts</p>
            <p className="text-2xl font-bold mt-1">₦{summaryData.completedAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Failed Payouts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Failed Payouts</p>
            <p className="text-2xl font-bold mt-1">₦{summaryData.failedAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-red-50 text-red-600">
            <FiAlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Total Vendors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Vendors Due</p>
            <p className="text-2xl font-bold mt-1">{summaryData.totalVendors}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <FiUser className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}