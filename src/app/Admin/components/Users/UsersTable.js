'use client';

import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';

export default function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Name</th>
            <th className="pb-3 pr-6">Email</th>
            <th className="pb-3 pr-6">Date Joined</th>
            <th className="pb-3 pr-6">Total Orders</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-700">
              <td className="py-4 pr-6">{user.name}</td>
              <td className="py-4 pr-6">{user.email}</td>
              <td className="py-4 pr-6">{user.dateJoined}</td>
              <td className="py-4 pr-6">{user.totalOrders}</td>
              <td className="py-4 flex items-center space-x-2">
                <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View Profile">
                  <FaUser />
                </button>
                <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Edit">
                  <FaEdit />
                </button>
                <button className="p-1 text-red-400 hover:text-red-300 transition" title="Delete">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>    
      </table>
    </div>
  );
}