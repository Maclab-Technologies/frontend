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

  // Find maximum values for scaling
  const maxOrders = Math.max(...data.map(item => item.orders))
  const maxRevenue = Math.max(...data.map(item => item.revenue))

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-gray-500">
        <span>This Week</span>
        <span>₦{Math.round(maxRevenue/1000000)}M revenue (Friday)</span>
      </div>
      
      <div className="flex items-end space-x-1 h-40">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-yellow-400 rounded-t-sm hover:bg-yellow-500 transition-colors"
              style={{ height: `${(item.orders / maxOrders) * 100}%` }}
              title={`₦${item.revenue.toLocaleString()}`}
            />
            <span className="text-xs mt-1 text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}