"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { VendorAuthContext } from "../../_provider/useVendorProvider";

export default function VendorRegister() {
  const { setAuthVendor, setVendorToken, setIsLoggedIn } =
    useContext(VendorAuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhoneNumber: "",
    businessAddress: "",
    businessAddress2: "",
    businessDescription: "",
    businessPassword: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    calculateFormProgress();
  }, [formData]);

  const calculateFormProgress = () => {
    const requiredFields = [
      "businessName",
      "businessEmail",
      "businessPhoneNumber",
      "businessAddress",
      "businessDescription",
      "businessPassword",
      "confirmPassword",
    ];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].trim() !== ""
    ).length;
    const progress = Math.floor((filledFields / requiredFields.length) * 100);
    setFormProgress(progress);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters";
    }
    if (!formData.businessEmail) {
      newErrors.businessEmail = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email";
    }
    if (!formData.businessPhoneNumber) {
      newErrors.businessPhoneNumber = "Business phone is required";
    } else if (!/^[\d\s\+\-\(\)]{10,15}$/.test(formData.businessPhoneNumber)) {
      newErrors.businessPhoneNumber = "Please enter a valid phone number";
    }
    if (!formData.businessAddress) {
      newErrors.businessAddress = "Shop address is required";
    }
    if (!formData.businessDescription) {
      newErrors.businessDescription = "Business description is required";
    } else if (formData.businessDescription.length < 20) {
      newErrors.businessDescription = "Description must be at least 20 characters";
    }
    if (!formData.businessPassword) {
      newErrors.businessPassword = "Password is required";
    } else if (formData.businessPassword.length < 6) {
      newErrors.businessPassword = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.businessPassword)) {
      newErrors.businessPassword = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.businessPassword)) {
      newErrors.businessPassword = "Password must contain at least one number";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.businessPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must accept the Terms & Conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/vendors/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const message = data?.message || "Registration failed. Please try again.";
        throw new Error(message);
      }

      if (data?.data && data?.token) {
        setAuthVendor(data.data);
        setVendorToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem("vendorData", JSON.stringify(data.data));
        localStorage.setItem("vendorToken", data.token);
        setLoading(false);
      }

      toast.success("Registration successful! Redirecting to dashboard...", {
        autoClose: 1000,
        onClose: () => router.push("/vendor/dashboard"),
      });
    } catch (error) {
      console.error("Registration error:", error);
      const fallback = "Registration failed. Please try again.";
      toast.error(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-black">Join 59Minutes</h1>
          <p className="text-black/80 mt-2 font-medium">
            Start selling your prints in minutes
          </p>

          {/* Progress bar */}
          <div className="mt-6 w-full bg-yellow-300/30 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-black/80 mt-1 font-medium">
            Profile completion: {formProgress}%
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8 pt-6 max-h-[600px] overflow-y-auto">
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                className={`w-full px-4 py-3 bg-gray-700 border ${
                  errors.businessName 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "border-gray-600 focus:border-yellow-500"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                placeholder="Your business name"
                value={formData.businessName}
                onChange={handleInputChange}
              />
              {errors.businessName && (
                <p className="mt-2 text-sm text-red-400">{errors.businessName}</p>
              )}
            </div>

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
                <p className="mt-2 text-sm text-red-400">{errors.businessEmail}</p>
              )}
            </div>

            {/* Business Phone */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Business Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="businessPhoneNumber"
                className={`w-full px-4 py-3 bg-gray-700 border ${
                  errors.businessPhoneNumber 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "border-gray-600 focus:border-yellow-500"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                placeholder="+234 (123) 456-7890"
                value={formData.businessPhoneNumber}
                onChange={handleInputChange}
              />
              {errors.businessPhoneNumber && (
                <p className="mt-2 text-sm text-red-400">{errors.businessPhoneNumber}</p>
              )}
            </div>

            {/* Shop Address */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Shop Address (Line 1) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    errors.businessAddress 
                      ? "border-red-500 ring-2 ring-red-500/20" 
                      : "border-gray-600 focus:border-yellow-500"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                  placeholder="Street address, P.O. box, company name"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
                {errors.businessAddress && (
                  <p className="mt-2 text-sm text-red-400">{errors.businessAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Shop Address (Line 2){" "}
                  <span className="text-gray-400 text-xs">Optional</span>
                </label>
                <input
                  type="text"
                  name="businessAddress2"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition duration-200"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.businessAddress2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Business Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="businessDescription"
                rows={4}
                className={`w-full px-4 py-3 bg-gray-700 border ${
                  errors.businessDescription 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "border-gray-600 focus:border-yellow-500"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                placeholder="Tell us about your business (minimum 20 characters)"
                value={formData.businessDescription}
                onChange={handleInputChange}
              />
              {errors.businessDescription && (
                <p className="mt-2 text-sm text-red-400">{errors.businessDescription}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                {formData.businessDescription.length}/20 characters minimum
              </p>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="At least 6 characters"
                    value={formData.businessPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                {errors.businessPassword && (
                  <p className="mt-2 text-sm text-red-400">{errors.businessPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.confirmPassword 
                        ? "border-red-500 ring-2 ring-red-500/20" 
                        : "border-gray-600 focus:border-yellow-500"
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition duration-200`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div>
              <p className="text-xs text-gray-400 mb-3">
                Password must contain at least 6 characters, one uppercase letter, and one number
              </p>
              {formData.businessPassword && (
                <div className="password-strength">
                  <div className="flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        formData.businessPassword.length >= 6 ? "bg-yellow-400" : "bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        /[A-Z]/.test(formData.businessPassword) ? "bg-yellow-400" : "bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        /[0-9]/.test(formData.businessPassword) ? "bg-yellow-400" : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-5 w-5 text-yellow-400 focus:ring-yellow-400 border-gray-500 rounded bg-gray-600"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-white">
                  I agree to the{" "}
                  <Link
                    href="/vendor/terms"
                    className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
                    target="_blank"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-xs mt-1">
                  20% platform fee applies to all sales
                </p>
                {errors.agreeToTerms && (
                  <p className="mt-2 text-sm text-red-400">{errors.agreeToTerms}</p>
                )}
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
                  Creating Account...
                </span>
              ) : (
                "Register as Vendor"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/vendor/login"
                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
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