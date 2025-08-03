'use client';

import { FaDownload, FaCheck, FaEdit, FaUserTie } from 'react-icons/fa';

export default function DesignsTable({ designs }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Design ID</th>
            <th className="pb-3 pr-6">Order ID</th>
            <th className="pb-3 pr-6">Client</th>
            <th className="pb-3 pr-6">Vendor</th>
            <th className="pb-3 pr-6">Submitted Date</th>
            <th className="pb-3 pr-6">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {designs.map((design) => (
            <tr key={design.id} className="hover:bg-gray-700">
              <td className="py-4 pr-6">{design.id}</td>
              <td className="py-4 pr-6">{design.orderId}</td>
              <td className="py-4 pr-6">{design.clientName}</td>
              <td className="py-4 pr-6">{design.vendorName}</td>
              <td className="py-4 pr-6">{design.submittedDate}</td>
              <td className="py-4 pr-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  design.status === "Approved" 
                    ? "bg-green-900 text-green-200" :
                  design.status === "Awaiting Approval" 
                    ? "bg-yellow-900 text-yellow-200" 
                    : "bg-red-900 text-red-200"
                }`}>
                  {design.status}
                </span>
              </td>
              <td className="py-4 flex items-center space-x-2">
                <button
                  className="p-1 text-blue-400 hover:text-blue-300 transition"
                  title="Download"
                >
                  <FaDownload />
                </button>
                {design.status !== "Approved" && (
                  <button className="p-1 text-green-400 hover:text-green-300 transition" title="Approve">
                    <FaCheck />
                  </button>
                )}
                <button className="p-1 text-yellow-400 hover:text-yellow-300 transition" title="Request Revision">
                  <FaEdit />
                </button>
                <button className="p-1 text-purple-400 hover:text-purple-300 transition" title="Reassign">
                  <FaUserTie />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}