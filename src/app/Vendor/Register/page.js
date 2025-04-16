"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../utils/firebaseconfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      toast.error("Authentication service is not available. Please refresh the page.");
      return; // Exit early if auth is not defined
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      localStorage.setItem("businessName", formData.businessName);

      toast.success(
        "Account created successfully! Welcome to 59Minutes Vendor Portal",
        { autoClose: 3000 }
      );

      setTimeout(() => router.push("/Vendor/Dashboard"), 1500);
    } catch (error) {
      console.error("Signup error:", error);

      const errorMessages = {
        "auth/email-already-in-use": "Email already registered. Try logging in.",
        "auth/invalid-email": "Please enter a valid email address",
        "auth/weak-password": "Password must be at least 6 characters with uppercase and numbers",
        "auth/network-request-failed": "Network error. Please check your connection.",
        default: error.message || "Signup failed. Please try again.",
      };

      toast.error(errorMessages[error.code] || errorMessages.default);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      localStorage.setItem("businessName", "Your Business"); // Default value

      toast.success("Google sign-in successful! Redirecting to your dashboard...", {
        autoClose: 2500
      });

      setTimeout(() => router.push("/Vendor/Dashboard"), 1500);
    } catch (error) {
      console.error("Google sign-in error:", error);

      const errorMessages = {
        "auth/popup-closed-by-user": "Sign-in popup was closed",
        "auth/network-request-failed": "Network error. Please check your connection.",
        "auth/cancelled-popup-request": "Sign-in process was cancelled",
        default: error.message || "Google sign-in failed. Please try again.",
      };

      toast.error(errorMessages[error.code] || errorMessages.default);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-black">
        <div className="bg-yellow-400 p-6 text-center border-b border-black">
          <h1 className="text-2xl font-bold text-black">Join as a 59Minutes Vendor</h1>
          <p className="text-black mt-1">Start selling your prints in minutes</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                className={`w-full px-3 py-2 border ${errors.businessName ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Your business name"
                value={formData.businessName}
                onChange={handleInputChange}
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="you@business.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  name="password"
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="At least 6 characters"
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
              <p className="mt-1 text-xs text-gray-600">Must contain at least 6 characters, one uppercase letter, and one number</p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-black rounded"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-black">
                  I agree to the{" "}
                  <Link
                    href="/Vendor/Terms"
                    className="text-yellow-600 hover:underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  (20% platform fee applies) <span className="text-red-500">*</span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating Account..." : "Register as Vendor"}
            </button>
          </form>

          

          {/* <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-black rounded-md shadow-sm bg-white text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button> */}

          <div className="mt-6 text-center text-sm">
            <p className="text-black">
              Already have an account?{" "}
              <Link
                href="/Vendor/Login"
                className="font-medium text-yellow-600 hover:text-yellow-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}