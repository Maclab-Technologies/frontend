"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../utils/firebaseconfig"; // Adjust path as needed
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for the password reset link.", {
        autoClose: 5000,
      });

      setTimeout(() => router.push("/Vendor/Login"), 2000); // Redirect after delay
    } catch (error) {
      console.error("Error sending password reset email", error);

      const errorMessages = {
        "auth/invalid-email": "Invalid email address.",
        "auth/user-not-found": "No user found with this email.",
        "auth/network-request-failed": "Network error. Please try again.",
        default: "Error sending password reset email. Please try again.",
      };

      toast.error(errorMessages[error.code] || errorMessages.default, {
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handlePasswordReset} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending Email..." : "Send Password Reset Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/Vendor/Login"
            className="text-sm text-yellow-600 hover:text-yellow-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
