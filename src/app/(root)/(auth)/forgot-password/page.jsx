"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { auth } from "@/app/utils/firebaseconfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setTimeout(() => router.push("/login"), 5000); 
    } catch (error) {
      toast.error(error.message || "Error sending reset email. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email. We'll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <button
          onClick={handleResetPassword}
          className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-400 transition-all disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>

        <p className="text-gray-600 text-sm text-center mt-4">
          Remember your password?{" "}
          <a href="/login" className="text-yellow-500 hover:text-yellow-400">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
