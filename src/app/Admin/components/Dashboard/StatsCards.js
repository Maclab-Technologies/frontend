import { FiPackage, FiUsers, FiTruck, FiDollarSign } from 'react-icons/fi'

export default function StatsCards() {
  const stats = [
    { title: 'Total Orders', value: '1,248', change: '+12%', icon: <FiPackage className="w-5 h-5" /> },
    { title: 'Active Clients', value: '893', change: '+5%', icon: <FiUsers className="w-5 h-5" /> },
    { title: 'Vendors', value: '156', change: '+3%', icon: <FiTruck className="w-5 h-5" /> },
    { title: 'Revenue', value: '₦48,256,000', change: '+18%', icon: <FiDollarSign className="w-5 h-5" /> }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}