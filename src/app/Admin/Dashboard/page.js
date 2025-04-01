// pages/Admin/dashboard.js

"use client"; 
import React from "react";
import { auth } from "../../utils/firebaseconfig"; // Ensure the correct path
import withAuth from "../../utils/withAuth"; // Import the withAuth HOC

const AdminDashboard = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out admin
      // Optionally redirect after sign out or show a message
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      <main className="flex-grow p-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Dashboard</h2>
        <p className="text-gray-700">Here you can manage your application's settings, users, and view statistics.</p>
        {/* Additional dashboard components can go here */}
      </main>
    </div>
  );
};

export default withAuth(AdminDashboard); // Wrap the component with the authentication check