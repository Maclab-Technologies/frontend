'use client';

import { useAdmin } from '../context/AdminContext';
import VendorsTable from '../components/Vendors/VendorsTable';

export default function VendorsPage() {
  const { vendors } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
      <VendorsTable vendors={vendors} />
    </div>
  );
}