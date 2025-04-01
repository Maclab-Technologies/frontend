"use client"; 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure you import from 'next/navigation'
import { auth } from "../utils/firebaseconfig"; // Adjust accordingly
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toast notifications

const AdminLogin = () => {
  const router = useRouter();
  
  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Hardcoded credentials for admin
  const adminUsers = [
    { email: "admin1@example.com", password: "password1" },
    { email: "admin2@example.com", password: "password2" },
  ];

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => { // Use the auth object directly
      if (user) {
        router.push("/Admin/Dashboard"); // Redirect to dashboard if authenticated
      }
    });
    return () => unsubscribe(); // Clean up the listener
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the entered credentials match the hardcoded ones
    const matchedAdmin = adminUsers.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (matchedAdmin) {
      try {
        // If email/password is correct, sign in with Firebase
        await auth.signInWithEmailAndPassword(email, password); // Use the auth instance
        toast.success("Login successful!"); // Show success toast
        // If login is successful, push to dashboard.
        router.push("/Admin/dashboard"); // Redirect to dashboard on success
      } catch (err) {
        console.error(err);
        toast.error("Failed to log in. Please try again."); // Show error toast
      }
    } else {
      toast.error("Invalid email or password."); // Notify of invalid credentials with a toast
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer /> {/* Render ToastContainer for showing toasts */}
    </div>
  );
};

export default AdminLogin;