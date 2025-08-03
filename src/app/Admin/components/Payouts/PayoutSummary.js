'use client';

export default function PayoutSummary({ payouts }) {
  const pendingPayouts = payouts.filter(p => p.status === "Pending");
  const totalAmountDue = pendingPayouts
    .reduce(
      (sum, p) => sum + (parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0), 
      0
    )
    .toFixed(2);

  return (
    <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-bold mb-4">Payout Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Pending</p>
          <p className="text-xl font-bold">
            {pendingPayouts.length} payouts
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Amount Due</p>
          <p className="text-xl font-bold text-yellow-400">
            ₦{totalAmountDue}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Platform Commission (20%)</p>
          <p className="text-xl font-bold text-green-400">
            ₦{(totalAmountDue * 0.25).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}