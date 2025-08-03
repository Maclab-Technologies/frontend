'use client';

import { useAdmin } from '../context/AdminContext';
import DesignsTable from '../components/Designs/DesignsTable';

export default function DesignsPage() {
  const { designs } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Design Management</h1>
      <DesignsTable designs={designs} />
    </div>
  );
}