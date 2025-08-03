'use client';

import { FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function PayoutsTable({ payouts, setPayouts }) {
  const handleMarkAsPaid = (payoutId) => {
    setPayouts(payouts.map(p => 
      p.id === payoutId ? { ...p, status: "Paid" } : p
    ));
    toast.success(`Payout ${payoutId} marked as paid`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 pr-6">Payout ID</th>
            <th className="pb-3 pr-6">Vendor Name</th>
            <th className="pb-3 pr-6">Order ID</th>
            <th className="pb-3 pr-6">Amount (80%)</th>
            <th className="pb-3 pr-6">Bank Details</th>
            <th className="pb-3 pr-6">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {payouts.length > 0 ? (
            payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-700">
                <td className="py-4 pr-6">{payout.id}</td>
                <td className="py-4 pr-6">{payout.vendorName}</td>
                <td className="py-4 pr-6">{payout.orderId}</td>
                <td className="py-4 pr-6 font-medium text-yellow-400">{payout.amount}</td>
                <td className="py-4 pr-6 font-mono">{payout.bankDetails}</td>
                <td className="py-4 pr-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payout.status === "Pending" 
                      ? "bg-yellow-900 text-yellow-200" 
                      : "bg-green-900 text-green-200"
                  }`}>
                    {payout.status}
                  </span>
                </td>
                <td className="py-4 flex items-center space-x-2">
                  <button
                    className="p-1 text-blue-400 hover:text-blue-300 transition"
                    title="View Details"
                  >
                    <FaUser />
                  </button>
                  {payout.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleMarkAsPaid(payout.id)}
                        className="p-1 text-green-400 hover:text-green-300 transition"
                        title="Mark as Paid"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-300 transition"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-400">
                No payouts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}