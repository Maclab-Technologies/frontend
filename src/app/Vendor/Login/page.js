"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../utils/firebaseconfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function VendorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // New state for showing/hiding password
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      toast.success(
        <div>
          <p className="font-bold">Login successful!</p>
          <p className="text-sm">Redirecting to your dashboard...</p>
        </div>,
        { 
          autoClose: 2000,
          icon: "🔐"
        }
      );
      
      setTimeout(() => router.push("/Vendor/Dashboard"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessages = {
        "auth/invalid-credential": "Invalid email or password",
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/too-many-requests": "Account temporarily locked due to too many attempts",
        "auth/network-request-failed": "Network error. Please check your connection.",
        default: "Login failed. Please try again.",
      };
      
      toast.error(
        <div>
          <p className="font-bold">Login Failed</p>
          <p className="text-sm">{errorMessages[error.code] || errorMessages.default}</p>
        </div>,
        { 
          autoClose: 5000,
          icon: "❌"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      
      toast.success(
        <div>
          <p className="font-bold">Google login successful!</p>
          <p className="text-sm">Redirecting to your dashboard...</p>
        </div>,
        { 
          autoClose: 2000,
          icon: "✅"
        }
      );
      
      setTimeout(() => router.push("/Vendor/Dashboard"), 1500);
    } catch (error) {
      console.error("Google login error:", error);
      
      const errorMessages = {
        "auth/popup-closed-by-user": "Login popup was closed",
        "auth/network-request-failed": "Network error. Please check your connection.",
        "auth/cancelled-popup-request": "Login process was cancelled",
        default: "Google login failed. Please try again.",
      };
      
      toast.error(
        <div>
          <p className="font-bold">Google Login Failed</p>
          <p className="text-sm">{errorMessages[error.code] || errorMessages.default}</p>
        </div>,
        { 
          autoClose: 5000,
          icon: "❌"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="border border-gray-200 shadow-lg"
      />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-yellow-400 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Login
          </h1>
          <p className="text-gray-700 mt-1">
            Access your 59Minutes vendor account
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  name="password"
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle state
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="text-right mt-1">
                <Link
                  href="/Vendor/Forget"
                  className="text-xs text-yellow-600 hover:text-yellow-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login to Your Account"
              )}
            </button>
          </form>

          

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/Vendor/Register"
                className="font-medium text-yellow-600 hover:text-yellow-500"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}