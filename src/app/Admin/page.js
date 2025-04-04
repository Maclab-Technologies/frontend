"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../utils/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hardcoded admin credentials (fallback)
  const hardcodedAdmins = [
    { email: "admin1@example.com", password: "password1" },
    { email: "admin2@example.com", password: "password2" },
    // Add more as needed
  ];

  // Firebase approved admin emails
  const APPROVED_ADMIN_EMAILS = [
    "admin@59minutes.com",
    "superadmin@59minutes.com",
    ...hardcodedAdmins.map(admin => admin.email) // Include hardcoded emails
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check hardcoded credentials
      const hardcodedMatch = hardcodedAdmins.find(
        admin => admin.email === email && admin.password === password
      );

      if (hardcodedMatch) {
        toast.success("Admin login successful!");
        router.push(`/Admin/Dashboard?email=${encodeURIComponent(email)}`);
        return;
      }

      // If no hardcoded match, try Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (APPROVED_ADMIN_EMAILS.includes(user.email)) {
        toast.success("Admin login successful!");
        router.push(`/Admin/Dashboard?email=${encodeURIComponent(user.email)}`);
      } else {
        await auth.signOut();
        toast.error("Access restricted to approved admins only");
      }
    } catch (error) {
      // If Firebase fails, check if it's a credential error
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid credentials");
      } else {
        toast.error(error.message.replace("Firebase: ", ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full border-2 border-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-150 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AdminLogin;