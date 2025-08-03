'use client';

import { useAdmin } from '../context/AdminContext';
import PayoutsTable from '../components/Payouts/PayoutsTable';
import PayoutSummary from '../components/Payouts/PayoutSummary';

export default function PayoutsPage() {
  const { payouts } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Vendor Payouts</h1>
      <PayoutsTable payouts={payouts} />
      <PayoutSummary payouts={payouts} />
    </div>
  );
}