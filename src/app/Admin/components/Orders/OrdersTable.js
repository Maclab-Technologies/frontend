'use client';

import { FaEdit, FaUserTie, FaTrash } from 'react-icons/fa';

export default function OrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Order ID</th>
            <th className="pb-3 pr-6">Client</th>
            <th className="pb-3 pr-6">Type</th>
            <th className="pb-3 pr-6">Status</th>
            <th className="pb-3 pr-6">Assigned Vendor</th>
            <th className="pb-3 pr-6">Amount</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-700">
              <td className="py-4 pr-6">{order.id}</td>
              <td className="py-4 pr-6">{order.clientName}</td>
              <td className="py-4 pr-6">{order.orderType}</td>
              <td className="py-4 pr-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Completed" ? "bg-green-900 text-green-200" :
                  order.status === "Assigned" ? "bg-blue-900 text-blue-200" :
                  "bg-yellow-900 text-yellow-200"
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-4 pr-6">{order.assignedVendor}</td>
              <td className="py-4 pr-6">{order.amount}</td>
              <td className="py-4 flex items-center space-x-2">
                <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View">
                  <FaEdit />
                </button>
                <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Reassign">
                  <FaUserTie />
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