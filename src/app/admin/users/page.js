"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/useAuth";
import { AdminAuth } from "@/app/context/useAuthContext";
import UsersTable from "../components/UsersTable";

export default function UserPage() {
    // AdminAuth()
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data for demonstration - replace with API call
  const sampleUsers = [
    {
      id: "USR-1001",
      name: "John Doe",
      email: "john@example.com",
      phone: "08012345678",
      joined: "2023-05-15",
      orders: 12,
      totalSpent: 450000,
    },
    {
      id: "USR-1002",
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "08023456789",
      joined: "2023-04-22",
      orders: 8,
      totalSpent: 320000,
    },
    {
      id: "USR-1003",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "08034567890",
      joined: "2023-06-01",
      orders: 5,
      totalSpent: 180000,
    },
    {
      id: "USR-1004",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "08045678901",
      joined: "2023-03-10",
      orders: 15,
      totalSpent: 620000,
    },
    {
      id: "USR-1005",
      name: "David Brown",
      email: "david@example.com",
      phone: "08056789012",
      joined: "2023-06-08",
      orders: 3,
      totalSpent: 95000,
    },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/users');
        // const data = await response.json();
        // setUsers(data);

        // Using sample data for now
        setUsers(sampleUsers);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    // Update user in state (replace with API call)
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleUserDelete = (userId) => {
    // Delete user from state (replace with API call)
    setUsers(users.filter((user) => user.id !== userId));
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Users Management</h1>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <UsersTable
          users={users}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
        />
      </div>
    </div>
  );
}
