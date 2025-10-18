'use client';

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";
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
  const [fieldStatus, setFieldStatus] = useState({});

  useEffect(() => {
    calculateFormProgress();
    validateFieldStatus();
  }, [formData]);

  const validateFieldStatus = () => {
    const status = {};

    // Email validation
    if (formData.businessEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      status.businessEmail = emailRegex.test(formData.businessEmail) 
        ? 'valid' 
        : 'invalid';
    }

    // Password validation
    if (formData.businessPassword) {
      status.businessPassword = formData.businessPassword.length >= 1 
        ? 'valid' 
        : 'invalid';
    }

    setFieldStatus(status);
  };

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

  const getInputStatus = (fieldName) => {
    if (!formData[fieldName]) return 'neutral';
    return fieldStatus[fieldName] || 'neutral';
  };

  const getStatusIcon = (fieldName) => {
    const status = getInputStatus(fieldName);
    
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getInputClasses = (fieldName) => {
    const status = getInputStatus(fieldName);
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 pr-10 text-black placeholder-gray-500";
    
    switch (status) {
      case 'valid':
        return `${baseClasses} border-green-500 ring-1 ring-green-500 focus:ring-green-400`;
      case 'invalid':
        return `${baseClasses} border-red-500 ring-1 ring-red-500 focus:ring-red-400`;
      default:
        return `${baseClasses} border-gray-300 focus:ring-yellow-400`;
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

      // Ensure token is present
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-t-yellow-400">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Vendor Login</h1>
          <p className="text-black/80 text-lg">
            Access your 59Minutes vendor dashboard
          </p>

          {/* Progress bar */}
          <div className="mt-6 bg-white/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-black h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-black/80 mt-2 font-medium">
            Form completion: {formProgress}%
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Business Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Business Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="businessEmail"
                  className={getInputClasses('businessEmail')}
                  placeholder="business@example.com"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {getStatusIcon('businessEmail')}
                </div>
              </div>
              {errors.businessEmail && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.businessEmail}
                </p>
              )}
              {formData.businessEmail && !errors.businessEmail && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Valid email format
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="businessPassword"
                  className={getInputClasses('businessPassword')}
                  placeholder="Enter your password"
                  value={formData.businessPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  {getStatusIcon('businessPassword')}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>
              {errors.businessPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.businessPassword}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                <div>
                  {formData.businessPassword && !errors.businessPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Password entered
                    </p>
                  )}
                </div>
                <Link
                  href="/vendor/forgot-password"
                  className="text-sm text-yellow-600 hover:text-yellow-800 font-semibold transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Security Information Box */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Secure Connection
                  </p>
                  <p className="text-sm text-green-700">
                    Your connection is encrypted and secure. We never store passwords in plain text.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white transition-all duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black transform hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Signing In...
                </span>
              ) : (
                "Access Dashboard 🚀"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-700">
              Don't have a vendor account?{" "}
              <Link
                href="/vendor/register"
                className="font-semibold text-yellow-600 hover:text-yellow-800 transition-colors hover:underline"
              >
                Start selling today
              </Link>
            </p>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Pro Tip:</strong> Use the same email you used during vendor registration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}