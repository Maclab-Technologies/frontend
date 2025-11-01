"use client";
import { batchRequests, post } from "@/app/_hooks/fetch-hook";
import LoadingMiddleware from "@/app/_components/loading";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Withdraw({ vendorData, summary, vendorToken }) {
  const [formData, setFormData] = useState({
    vendorId: vendorData?.id || "",
    amount: "",
    accountNumber: "",
    bankName: "",
    accountName: "",
    saveDetails: false,
  });
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = vendorToken

  // Fetch bank details only once when component mounts
  useEffect(() => {
    const fetchBankDetails = async () => {
      setLoading(true)
      try {
        if (!token) {
          toast.error("Unable to authenticate user, try again.");
          setLoading(false);
          return;
        }

        const res = await batchRequests([
          {
            url: "/vendors/bank/details",
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: "/withdrawals/history",
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
        ]);

        const [details, historyData] = res;

        if (details.success) {
          const bank = details.data?.data;
          setFormData((prevData) => ({
            ...prevData,
            accountNumber: bank.accountNumber || "",
            bankName: bank.bankName || "",
            accountName: bank.accountName || "",
          }));
        } else {
          toast.warning("Failed to fetch bank details");
        }

        if (historyData.success) {
          setHistory(historyData.data?.data);
        } else {
          toast.warning("Failed to fetch withdraw history");
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        toast.warning(error.message || "Something went wrong, try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []); // Empty dependency array - runs only once

  // Handle input changes properly
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("vendorToken");

      if(!token){
        toast.warning("Invalid  crsf_token found")
      }

      if (
        !formData.bankName ||
        !formData.accountNumber ||
        !formData.accountName ||
        !formData.amount
      ) {
        toast.error("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      if (parseFloat(formData.amount) < 5000) {
        toast.error("Minimum withdrawal amount is ₦5,000");
        setSubmitting(false);
        return;
      }

      const res = await post("/withdrawals/request", formData, {
        token: token,
      });

      console.log(res)

      if (res.success) {
        toast.success(res.message ?? "Withdrawal request submitted successfully");
        // Reset only the amount field, keep bank details
        setFormData((prevData) => ({
          ...prevData,
          amount: "",
        }));
      } else {
        toast.error(res.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "N/A";
    }
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
                ₦{summary.availableBalance || 0}
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

              {/* Hidden vendor ID field */}
              <input
                type="hidden"
                value={formData.vendorId}
                onChange={(e) => handleInputChange("vendorId", e.target.value)}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your bank name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your account number"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) =>
                    handleInputChange("accountName", e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.saveDetails}
                    onChange={(e) =>
                      handleInputChange("saveDetails", e.target.checked)
                    }
                    className="mr-2 h-4 w-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  Save Bank Details
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  min="5000"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter amount to withdraw"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum withdrawal: ₦5,000 | Available: ₦{summary?.availableBalance || 0}
                </p>
              </div>

              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 mb-4">
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
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                  disabled={submitting}
                >
                  {submitting ? "Submitting Request..." : "Request Withdrawal"}
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
                    Withdrawal ID
                  </th>
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
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center">
                      <LoadingMiddleware />
                    </td>
                  </tr>
                ) : history.length !== 0 ? (
                  history.map((h, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-center text-gray-400">
                        {h._id || h.id || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400">
                        {formatDate(h.requestedAt)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400">
                        ₦{h.amount || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          h.status === 'completed' ? 'bg-green-100 text-green-800' :
                          h.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          h.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {h.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-3 text-center text-gray-400"
                      colSpan="4"
                    >
                      No withdrawal history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}