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
    businessEmail: "",
    businessPhone: "",
    shopAddress1: "",
    shopAddress2: "",
    businessDescription: "",
    password: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      toast.error("Authentication service is not available. Please refresh the page.");
      return;
    }
  }, []);

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

    if (!formData.businessPhone) {
      newErrors.businessPhone = "Business phone is required";
    } else if (!/^[\d\s\+\-\(\)]{10,15}$/.test(formData.businessPhone)) {
      newErrors.businessPhone = "Please enter a valid phone number";
    }

    if (!formData.shopAddress1) {
      newErrors.shopAddress1 = "Shop address is required";
    }

    if (!formData.businessDescription) {
      newErrors.businessDescription = "Business description is required";
    } else if (formData.businessDescription.length < 20) {
      newErrors.businessDescription = "Description must be at least 20 characters";
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
      const userCredential = await fetch( `${process.env.API_KEY}/vendor/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData
      });

      localStorage.setItem("vendor_token", userCredential.token);

      toast.success(
        "Vendor account created successfully! Welcome to 59Minutes Vendor Portal",
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
            {/* Business Name */}
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

            {/* Business Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="businessEmail"
                className={`w-full px-3 py-2 border ${errors.businessEmail ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="business@example.com"
                value={formData.businessEmail}
                onChange={handleInputChange}
              />
              {errors.businessEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.businessEmail}</p>
              )}
            </div>

            {/* Business Phone */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="businessPhone"
                className={`w-full px-3 py-2 border ${errors.businessPhone ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="+1 (123) 456-7890"
                value={formData.businessPhone}
                onChange={handleInputChange}
              />
              {errors.businessPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.businessPhone}</p>
              )}
            </div>

            {/* Shop Address 1 */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Shop Address (Line 1) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shopAddress1"
                className={`w-full px-3 py-2 border ${errors.shopAddress1 ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Street address, P.O. box, company name"
                value={formData.shopAddress1}
                onChange={handleInputChange}
              />
              {errors.shopAddress1 && (
                <p className="mt-1 text-sm text-red-600">{errors.shopAddress1}</p>
              )}
            </div>

            {/* Shop Address 2 (Optional) */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Shop Address (Line 2) <span className="text-gray-500">Optional</span>
              </label>
              <input
                type="text"
                name="shopAddress2"
                className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Apartment, suite, unit, building, floor, etc."
                value={formData.shopAddress2}
                onChange={handleInputChange}
              />
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                rows={4}
                className={`w-full px-3 py-2 border ${errors.businessDescription ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                placeholder="Tell us about your business (minimum 20 characters)"
                value={formData.businessDescription}
                onChange={handleInputChange}
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* Terms and Conditions */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating Account..." : "Register as Vendor"}
            </button>
          </form>

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