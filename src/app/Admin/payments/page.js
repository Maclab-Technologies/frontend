'use client';

import { useAdmin } from '../context/AdminContext';
import PaymentsTable from '../components/Payments/PaymentsTable';
import RevenueSummary from '../components/Payments/RevenueSummary';

export default function PaymentsPage() {
  const { payments } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Payments Overview</h1>
      <RevenueSummary payments={payments} />
      <PaymentsTable payments={payments} />
    </div>
  );
}