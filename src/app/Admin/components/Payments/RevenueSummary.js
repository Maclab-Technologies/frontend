'use client';

export default function RevenueSummary({ payments }) {
  const totalRevenue = payments.reduce(
    (sum, p) => sum + (parseFloat(p.amountPaid.replace(/[^0-9.]/g, '')) || 0), 
    0
  ).toFixed(2);
  
  const vendorPayouts = payments.reduce(
    (sum, p) => sum + (parseFloat(p.vendorCut.replace(/[^0-9.]/g, '')) || 0), 
    0
  ).toFixed(2);
  
  const platformEarnings = payments.reduce(
    (sum, p) => sum + (parseFloat(p.platformCommission.replace(/[^0-9.]/g, '')) || 0), 
    0
  ).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
        <p className="text-2xl font-bold">₦{totalRevenue}</p>
      </div>
      <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-sm mb-1">Vendor Payouts (80%)</p>
        <p className="text-2xl font-bold text-yellow-400">₦{vendorPayouts}</p>
      </div>
      <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-sm mb-1">Platform Earnings (20%)</p>
        <p className="text-2xl font-bold text-green-400">₦{platformEarnings}</p>
      </div>
    </div>
  );
}