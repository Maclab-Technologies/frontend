'use client';

import { FaUser, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

export default function VendorsTable({ vendors }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const currentVendors = vendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Name</th>
            <th className="pb-3 pr-6">Email</th>
            <th className="pb-3 pr-6">Status</th>
            <th className="pb-3 pr-6">Account Number</th>
            <th className="pb-3 pr-6">Assigned Orders</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {currentVendors.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-700">
              <td className="py-4 pr-6">{vendor.name}</td>
              <td className="py-4 pr-6">{vendor.email}</td>
              <td className="py-4 pr-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vendor.status === "Active" 
                    ? "bg-green-900 text-green-200" 
                    : "bg-yellow-900 text-yellow-200"
                }`}>
                  {vendor.status}
                </span>
              </td>
              <td className="py-4 pr-6">{vendor.accountNumber}</td>
              <td className="py-4 pr-6">{vendor.assignedOrders}</td>
              <td className="py-4 flex items-center space-x-2">
                <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="View Details">
                  <FaUser />
                </button>
                {vendor.status === "Pending Approval" ? (
                  <button className="p-1 text-green-400 hover:text-green-300 transition" title="Approve">
                    <FaCheck />
                  </button>
                ) : (
                  <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Edit">
                    <FaEdit />
                  </button>
                )}
                <button className="p-1 text-red-400 hover:text-red-300 transition" title="Delete">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-400 text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, vendors.length)} of {vendors.length} entries
        </p>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}