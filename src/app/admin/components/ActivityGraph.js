'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ActivityGraph() {
  // Sample data with Naira values
  const data = [
    { day: 'Mon', orders: 120, revenue: 1200000 },
    { day: 'Tue', orders: 200, revenue: 2000000 },
    { day: 'Wed', orders: 150, revenue: 1500000 },
    { day: 'Thu', orders: 180, revenue: 1800000 },
    { day: 'Fri', orders: 240, revenue: 2400000 },
    { day: 'Sat', orders: 190, revenue: 1900000 },
    { day: 'Sun', orders: 130, revenue: 1300000 }
  ]

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`${label}`}</p>
          <p className="text-yellow-400">
            {`Orders: ${payload[0].value}`}
          </p>
          <p className="text-blue-400">
            {`Revenue: ₦${(payload[1].value / 1000000).toFixed(1)}M`}
          </p>
        </div>
      )
    }
    return null
  }

  // Format revenue for Y-axis (in millions)
  const formatRevenue = (value) => `₦${(value / 1000000).toFixed(1)}M`

  // Get total revenue for the week
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const maxRevenue = Math.max(...data.map(item => item.revenue))
  const peakDay = data.find(item => item.revenue === maxRevenue)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Order Activity</h3>
          <p className="text-sm text-gray-400">Weekly orders and revenue overview</p>
        </div>
        <div className="mt-2 sm:mt-0 text-right">
          <p className="text-xs text-gray-400">Peak: {peakDay?.day}</p>
          <p className="text-sm font-medium text-yellow-400">
            ₦{(totalRevenue / 1000000).toFixed(1)}M total
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              yAxisId="orders"
              orientation="left"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              yAxisId="revenue"
              orientation="right"
              tickFormatter={formatRevenue}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
              iconType="rect"
            />
            <Bar 
              yAxisId="orders"
              dataKey="orders" 
              fill="#FCD34D"
              name="Orders"
              radius={[2, 2, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
            <Bar 
              yAxisId="revenue"
              dataKey="revenue" 
              fill="#60A5FA"
              name="Revenue (₦)"
              radius={[2, 2, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400">Avg Orders</p>
          <p className="text-sm font-semibold text-white">
            {Math.round(data.reduce((sum, item) => sum + item.orders, 0) / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Best Day</p>
          <p className="text-sm font-semibold text-yellow-400">{peakDay?.day}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Peak Orders</p>
          <p className="text-sm font-semibold text-blue-400">{peakDay?.orders}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Growth</p>
          <p className="text-sm font-semibold text-green-400">+12.5%</p>
        </div>
      </div>
    </div>
  )
}