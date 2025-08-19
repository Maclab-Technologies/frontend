import UsersTable from "../components/UsersTable";

export default function UserPage() {

   const users = [
    { id: 'USR-1001', name: 'John Doe', email: 'john@example.com', phone: '08012345678', joined: '2023-05-15', orders: 12, totalSpent: 450000 },
    { id: 'USR-1002', name: 'Sarah Smith', email: 'sarah@example.com', phone: '08023456789', joined: '2023-04-22', orders: 8, totalSpent: 320000 },
    { id: 'USR-1003', name: 'Mike Johnson', email: 'mike@example.com', phone: '08034567890', joined: '2023-06-01', orders: 5, totalSpent: 180000 },
    { id: 'USR-1004', name: 'Emma Wilson', email: 'emma@example.com', phone: '08045678901', joined: '2023-03-10', orders: 15, totalSpent: 620000 },
    { id: 'USR-1005', name: 'David Brown', email: 'david@example.com', phone: '08056789012', joined: '2023-06-08', orders: 3, totalSpent: 95000 }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
