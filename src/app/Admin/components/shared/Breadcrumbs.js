'use client';

import { useAdmin } from '../../context/AdminContext';
import Link from 'next/link';

export default function Breadcrumbs() {
  const { activeTab } = useAdmin();

  return (
    <div className="text-sm text-gray-400 mb-4">
      <Link href="/Admin/dashboard" className="hover:text-yellow-400 transition">
        Dashboard
      </Link>
      {activeTab !== 'Dashboard' && (
        <>
          <span className="mx-2">/</span>
          <span>{activeTab}</span>
        </>
      )}
    </div>
  );
}