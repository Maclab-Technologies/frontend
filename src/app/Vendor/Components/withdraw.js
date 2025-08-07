"use client";
import { batchRequests } from "@/app/hooks/fetch-hook";
import { config } from "dotenv";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Withdraw({ vendorData }) {
  const [formData, setFormData] = useState({
    vendorId: "",
    amount: "",
    accountNumber: "",
    bankName: "",
    accountName: "",
    saveDetails: false,
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('vendor_token')
      if(!token){
        toast.error('Unable to untenticate user, try again.')
      }

      const res = batchRequests([
        {
          url: "vendors/bank/details",
          {
          method: "GET",
          token,
          config:{ showToast: false}
        }
      ])

      const [bankDetails] = res.data;
      
      setFormData(bankDetails.data)

    } catch (error) {
      console.error(error)
      toast.warning('Something went wromg while retrieving bank details')
    }
  });

  const handleSubmitWithdrawal = (e) => {
    e.preventDefault();

    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountName ||
      !formData.withdrawAmount
    ) {
      toast.error("Please fill all bank details");
      return;
    }

    if (parseFloat(withdrawAmount) > earnings.available) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    // In a real app, this would send a request to the backend
    const newPayout = {
      id: `PYT-00${payouts.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      amount: `₦${parseFloat(withdrawAmount).toLocaleString()}`,
      status: "Pending",
      txnId: `TXN${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setPayouts([newPayout, ...payouts]);
    setEarnings({
      ...earnings,
      available: earnings.available - parseFloat(withdrawAmount),
      pending: earnings.pending + parseFloat(withdrawAmount),
    });

    toast.success("Withdrawal request submitted");
    setWithdrawAmount("");
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-sm text-gray-400">Available Balance</span>
              <h2 className="text-3xl font-bold text-green-400">
                {/* ₦{earnings.available || 0} */}0
              </h2>
            </div>

            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Minimum Withdrawal</span>
              <p className="text-lg font-medium">₦5,000</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
              <div>
                <input
                  type="text"
                  value={vendorData.id}
                  onChange={(e) => setFormData.vendorId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your bank name"
                  hidden
                />
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData.bankName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData.accountNumber(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData.accountName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter account holder name"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.saveDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        saveDetails: e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  Save Bank Details
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData.amount(e.target.value)}
                  min="5000"
                  // max={earnings.available}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter amount to withdraw"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum withdrawal: ₦5,000 | Available: ₦0
                  {/* {earnings.available || 0} */}
                </p>
              </div>

              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
                <h3 className="font-medium mb-2">Withdrawal Notes</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Withdrawals are processed within 24-48 hours</li>
                  <li>• All bank details must be accurate</li>
                  <li>• 80% commission is paid on all sales</li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
                >
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              {/* <tbody className="divide-y divide-gray-700">
                {payouts.slice(0, 3).map((payout, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {payout.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {payout.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payout.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
