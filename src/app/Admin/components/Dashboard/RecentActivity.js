import { FiUser, FiEdit, FiCheckCircle, FiTruck, FiShoppingCart } from 'react-icons/fi'

export default function RecentActivity() {
  const activities = [
    { id: 1, user: 'John Doe', action: 'placed new order', time: '2 mins ago', orderId: '#ORD-1248', icon: <FiShoppingCart className="w-4 h-4" /> },
    { id: 2, user: 'Sarah Smith', action: 'requested design revision', time: '15 mins ago', orderId: '#ORD-1247', icon: <FiEdit className="w-4 h-4" /> },
    { id: 3, user: 'Mike Johnson', action: 'completed payment', time: '1 hour ago', orderId: '#ORD-1246', icon: <FiCheckCircle className="w-4 h-4" /> },
    { id: 4, user: 'PrintHub Vendor', action: 'marked order as shipped', time: '2 hours ago', orderId: '#ORD-1245', icon: <FiTruck className="w-4 h-4" /> },
    { id: 5, user: 'Emma Wilson', action: 'created new account', time: '3 hours ago', icon: <FiUser className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.user} <span className="text-gray-500 font-normal">{activity.action}</span>
            </p>
            {activity.orderId && (
              <p className="text-xs text-yellow-600 font-medium">{activity.orderId}</p>
            )}
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}