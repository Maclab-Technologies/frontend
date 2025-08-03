'use client';

import { useAdmin } from '../context/AdminContext';
import UsersTable from '../components/Users/UsersTable';

export default function UsersPage() {
  const { users } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <UsersTable users={users} />
    </div>
  );
}