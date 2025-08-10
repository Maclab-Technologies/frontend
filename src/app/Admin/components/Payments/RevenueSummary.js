import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi'

export default function RevenueSummary() {
  const revenueData = {
    totalRevenue: 4856000,
    platformEarnings: 971200, // 20%
    vendorPayouts: 3884800, // 80%
    growthRate: 18.5
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">₦{revenueData.totalRevenue.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${revenueData.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueData.growthRate > 0 ? '↑' : '↓'} {Math.abs(revenueData.growthRate)}% from last month
            </p>
          </div>
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <FiDollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Platform Earnings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Platform Earnings (20%)</p>
            <p className="text-2xl font-bold mt-1">₦{revenueData.platformEarnings.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Vendor Payouts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Vendor Payouts (80%)</p>
            <p className="text-2xl font-bold mt-1">₦{revenueData.vendorPayouts.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <FiPieChart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}