'use client';

import { FaDownload } from 'react-icons/fa';

export default function PaymentsTable({ payments }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Transaction ID</th>
            <th className="pb-3 pr-6">Client Name</th>
            <th className="pb-3 pr-6">Amount Paid</th>
            <th className="pb-3 pr-6">Vendor Cut (80%)</th>
            <th className="pb-3 pr-6">Platform (20%)</th>
            <th className="pb-3 pr-6">Date</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {payments.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-400">
                No transactions available.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-700">
                <td className="py-4 pr-6">{payment.id}</td>
                <td className="py-4 pr-6">{payment.clientName}</td>
                <td className="py-4 pr-6 font-medium">{payment.amountPaid}</td>
                <td className="py-4 pr-6 text-yellow-400">{payment.vendorCut}</td>
                <td className="py-4 pr-6 text-green-400">{payment.platformCommission}</td>
                <td className="py-4 pr-6">{payment.date}</td>
                <td className="py-4">
                  <button className="p-1 text-blue-400 hover:text-blue-300 transition" title="Download Invoice">
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}