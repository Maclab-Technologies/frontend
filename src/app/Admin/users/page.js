import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function UsersTable() {
  // Sample users data
  const users = [
    { id: 'USR-1001', name: 'John Doe', email: 'john@example.com', phone: '08012345678', joined: '2023-05-15', orders: 12, totalSpent: 450000 },
    { id: 'USR-1002', name: 'Sarah Smith', email: 'sarah@example.com', phone: '08023456789', joined: '2023-04-22', orders: 8, totalSpent: 320000 },
    { id: 'USR-1003', name: 'Mike Johnson', email: 'mike@example.com', phone: '08034567890', joined: '2023-06-01', orders: 5, totalSpent: 180000 },
    { id: 'USR-1004', name: 'Emma Wilson', email: 'emma@example.com', phone: '08045678901', joined: '2023-03-10', orders: 15, totalSpent: 620000 },
    { id: 'USR-1005', name: 'David Brown', email: 'david@example.com', phone: '08056789012', joined: '2023-06-08', orders: 3, totalSpent: 95000 }
  ]

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                <FiUser className="mr-2 text-gray-500" /> {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center"><FiMail className="mr-1" /> {user.email}</div>
                <div className="flex items-center mt-1"><FiPhone className="mr-1" /> {user.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                <FiCalendar className="mr-1" /> {user.joined}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.orders}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{user.totalSpent.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}