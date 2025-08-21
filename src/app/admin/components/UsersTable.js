"use client";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-200">
        <thead class="text-white ">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              User ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Joined
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Orders
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Total Spent
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white flex items-center">
                <FiUser className="mr-2 text-gray-200" /> {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                <div className="flex items-center">
                  <FiMail className="mr-1" /> {user.email}
                </div>
                <div className="flex items-center mt-1">
                  <FiPhone className="mr-1" /> {user.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 flex items-center">
                <FiCalendar className="mr-1" /> {user.joined}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.orders}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                ₦{user.totalSpent.toLocaleString()}
              </td>
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
  );
}
