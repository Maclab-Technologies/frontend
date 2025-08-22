'use client'

import { useState } from 'react'
import { FiUser, FiEdit, FiCheckCircle, FiTruck, FiShoppingCart, FiMoreHorizontal, FiFilter } from 'react-icons/fi'

export default function RecentActivity({ activities: propActivities }) {
  const [filter, setFilter] = useState('all')
  
  const defaultActivities = [
    { id: 1, user: 'John Doe', action: 'placed new order', time: '2 mins ago', orderId: '#ORD-1248', icon: <FiShoppingCart className="w-4 h-4" />, type: 'order', status: 'new' },
    { id: 2, user: 'Sarah Smith', action: 'requested design revision', time: '15 mins ago', orderId: '#ORD-1247', icon: <FiEdit className="w-4 h-4" />, type: 'revision', status: 'pending' },
    { id: 3, user: 'Mike Johnson', action: 'completed payment', time: '1 hour ago', orderId: '#ORD-1246', icon: <FiCheckCircle className="w-4 h-4" />, type: 'payment', status: 'completed' },
    { id: 4, user: 'PrintHub Vendor', action: 'marked order as shipped', time: '2 hours ago', orderId: '#ORD-1245', icon: <FiTruck className="w-4 h-4" />, type: 'shipping', status: 'shipped' },
    { id: 5, user: 'Emma Wilson', action: 'created new account', time: '3 hours ago', icon: <FiUser className="w-4 h-4" />, type: 'account', status: 'active' },
    { id: 6, user: 'Alex Chen', action: 'uploaded design files', time: '4 hours ago', orderId: '#ORD-1244', icon: <FiEdit className="w-4 h-4" />, type: 'revision', status: 'pending' },
    { id: 7, user: 'Maria Garcia', action: 'cancelled order', time: '5 hours ago', orderId: '#ORD-1243', icon: <FiShoppingCart className="w-4 h-4" />, type: 'order', status: 'cancelled' }
  ]

  const activities = propActivities || defaultActivities

  const getIconBgColor = (type, status) => {
    switch (type) {
      case 'order':
        return status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
      case 'payment':
        return 'bg-green-500/20 text-green-400'
      case 'shipping':
        return 'bg-purple-500/20 text-purple-400'
      case 'revision':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'account':
        return 'bg-indigo-500/20 text-indigo-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return badges[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const filteredActivities = filter === 'all' ? activities : activities.filter(activity => activity.type === filter)

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'order', label: 'Orders' },
    { value: 'payment', label: 'Payments' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'revision', label: 'Revisions' },
    { value: 'account', label: 'Accounts' }
  ]

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <p className="text-sm text-gray-400">Latest customer and system activities</p>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <FiFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filter === option.value
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start p-3 hover:bg-gray-800/50 rounded-lg transition-colors group"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${getIconBgColor(activity.type, activity.status)}`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {activity.action}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {activity.orderId && (
                      <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                        {activity.orderId}
                      </span>
                    )}
                    {activity.status && (
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusBadge(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-8">
          <FiFilter className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No activities found for this filter</p>
          <button 
            onClick={() => setFilter('all')}
            className="text-xs text-yellow-400 hover:text-yellow-300 mt-1"
          >
            Show all activities
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-gray-700">
        <button className="w-full text-center text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
          View All Activities
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6B7280;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}