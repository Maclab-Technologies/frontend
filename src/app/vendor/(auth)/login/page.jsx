"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { VendorAuthContext } from "@/app/vendor/_provider/useVendorProvider";

export default function VendorLogin() {
  const { setIsLoggedIn, setAuthVendor, setVendorToken } =
    useContext(VendorAuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessEmail: "",
    businessPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    calculateFormProgress();
  }, [formData]);

  const calculateFormProgress = () => {
    const requiredFields = ["businessEmail", "businessPassword"];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].trim() !== ""
    ).length;
    const progress = Math.floor((filledFields / requiredFields.length) * 100);
    setFormProgress(progress);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessEmail) {
      newErrors.businessEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email";
    }
    if (!formData.businessPassword) {
      newErrors.businessPassword = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/vendors/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Login failed. Please try again.";
        throw new Error(message);
      }

      const data = await response.json();
      const token = data.token;
      if (!token) {
        throw new Error("Authentication token missing from response.");
      }

      setAuthVendor(data.data);
      setVendorToken(token);
      setIsLoggedIn(true);
      localStorage.setItem("vendorToken", token);
      localStorage.setItem("vendorData", JSON.stringify(data.data));
      toast.success("Login successful! Redirecting to dashboard...");
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-black">Vendor Login</h1>
          <p className="text-black/80 mt-2 font-medium">
            Access your 59Minutes vendor dashboard
          </p>

          {/* Progress bar */}
          <div className="mt-6 w-full bg-yellow-300/30 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-black/80 mt-1 font-medium">
            Form completion: {formProgress}%
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Business Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Business Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="businessEmail"
                className={`w-full px-4 py-3 bg-gray-700 border ${
                  errors.businessEmail 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "border-gray-600 focus:border-yellow-500"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                placeholder="business@example.com"
                value={formData.businessEmail}
                onChange={handleInputChange}
              />
              {errors.businessEmail && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.businessEmail}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="businessPassword"
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    errors.businessPassword 
                      ? "border-red-500 ring-2 ring-red-500/20" 
                      : "border-gray-600 focus:border-yellow-500"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                  placeholder="Enter your password"
                  value={formData.businessPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              {errors.businessPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.businessPassword}
                </p>
              )}
              <div className="text-right mt-2">
                <Link
                  href="/vendor/forgot-password"
                  className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-400"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300">
                    Your connection is secure. We never store your password in plain text.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg text-base font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ${
                loading ? "opacity-75 cursor-not-allowed" : "shadow-lg hover:shadow-yellow-500/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                "Login to Dashboard"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/vendor/register"
                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
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