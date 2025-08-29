import { AdminAuth } from "@/app/context/useAuthMiddleware";
import UsersTable from "../components/UsersTable";

export const metadata = {
  title: 'Users Management | Admin',
  description: 'Manage all users from this admin panel',
};

export default function UserPage() {
  // AdminAuth()

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Users Management</h1>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <UsersTable />
      </div>
    </div>
  );
}
