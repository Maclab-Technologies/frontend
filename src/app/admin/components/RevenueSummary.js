import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi'

export default function RevenueSummary() {
  const revenueData = {
    totalRevenue: 4856000,
    platformEarnings: 971200, // 20%
    vendorPayouts: 3884800, // 80%
    growthRate: 18.5
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Total Revenue</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{revenueData.totalRevenue.toLocaleString()}</p>
            <p className={`text-xs md:text-sm mt-1 ${revenueData.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueData.growthRate > 0 ? '↑' : '↓'} {Math.abs(revenueData.growthRate)}% from last month
            </p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0">
            <FiDollarSign className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Platform Earnings */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Platform Earnings (20%)</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{revenueData.platformEarnings.toLocaleString()}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-green-50 text-green-600 flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      {/* Vendor Payouts */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Vendor Payouts (80%)</p>
            <p className="text-xl md:text-2xl font-bold mt-1 truncate">₦{revenueData.vendorPayouts.toLocaleString()}</p>
          </div>
          <div className="ml-4 p-2 md:p-3 rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
            <FiPieChart className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}