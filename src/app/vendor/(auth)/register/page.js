"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function VendorRegister() {
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
      'businessName', 
      'businessEmail', 
      'businessPhoneNumber', 
      'businessAddress', 
      'businessDescription', 
      'businessPassword', 
      'confirmPassword'
    ];
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].trim() !== ''
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
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/vendors/signup`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const message = data?.message || "Registration failed. Please try again.";
        throw new Error(message);
      }
  
      if (data?.token) {
        localStorage.setItem("vendor_token", data.token);
      }
  
      if (data?.vendor) {
        localStorage.setItem("vendor_data", JSON.stringify(data.data));
      }
  
      toast.success("Registration successful! Redirecting to dashboard...", {
        autoClose: 1000,
        onClose: () => router.push("/vendor/dashboard"),
      });
  
    } catch (error) {
      console.error("Registration error:", error);
  
      const errorCode = error.code || "";
      const errorMessageMap = {
        "auth/email-already-in-use": "Email already registered. Try logging in.",
        "auth/invalid-email": "Please enter a valid email address",
        "auth/weak-password": "Password must be at least 6 characters with uppercase and numbers",
        "auth/network-request-failed": "Network error. Please check your connection.",
      };
  
      const fallback = error.message || "Registration failed. Please try again.";
      toast.error(errorMessageMap[errorCode] || fallback);
  
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-t-yellow-400">
        <div className="bg-yellow-400 p-8 text-center">
          <h1 className="text-3xl font-bold text-black">Join 59Minutes</h1>
          <p className="text-black mt-2">Start selling your prints in minutes</p>
          
          {/* Progress bar */}
          <div className="mt-6 w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-black mt-1">Profile completion: {formProgress}%</p>
        </div>

        <div className="px-8 pb-8">
          <form onSubmit={handleEmailSignUp} className="space-y-5">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                className={`w-full px-4 py-3 border ${errors.businessName ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
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
                className={`w-full px-4 py-3 border ${errors.businessEmail ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
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
                name="businessPhoneNumber"
                className={`w-full px-4 py-3 border ${errors.businessPhoneNumber ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                placeholder="+234 (123) 456-7890"
                value={formData.businessPhoneNumber}
                onChange={handleInputChange}
              />
              {errors.businessPhoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.businessPhoneNumber}</p>
              )}
            </div>

            {/* Shop Address - Grid layout for addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shop Address 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  Shop Address (Line 1) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  className={`w-full px-4 py-3 border ${errors.businessAddress ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                  placeholder="Street address, P.O. box, company name"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
                {errors.businessAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                )}
              </div>

              {/* Shop Address 2 (Optional) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  Shop Address (Line 2) <span className="text-gray-500 text-xs">Optional</span>
                </label>
                <input
                  type="text"
                  name="businessAddress2"
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.businessAddress2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                rows={4}
                className={`w-full px-4 py-3 border ${errors.businessDescription ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                placeholder="Tell us about your business (minimum 20 characters)"
                value={formData.businessDescription}
                onChange={handleInputChange}
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">
                {formData.businessDescription.length}/20 characters minimum
              </p>
            </div>

            {/* Password fields in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-black mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="businessPassword"
                    className={`w-full px-4 py-3 border ${errors.businessPassword ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                    placeholder="At least 6 characters"
                    value={formData.businessPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-black"
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.businessPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-black mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`w-full px-4 py-3 border ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    // onClick={() /=> setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-black"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-xs text-gray-600 mb-4">
                Password must contain at least 6 characters, one uppercase letter, and one number
              </p>
            </div>

            {/* Password strength indicator */}
            {formData.businessPassword && (
              <div className="password-strength">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${formData.businessPassword.length >= 6 ? "bg-yellow-400" : "bg-gray-300"}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(formData.businessPassword) ? "bg-yellow-400" : "bg-gray-300"}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(formData.businessPassword) ? "bg-yellow-400" : "bg-gray-300"}`}></div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-5 w-5 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-black">
                  I agree to the{" "}
                  <Link
                    href="/vendor/terms"
                    className="text-yellow-600 hover:text-yellow-800 underline"
                    target="_blank"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-600 text-xs mt-1">20% platform fee applies to all sales</p>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Register as Vendor"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm border-t border-gray-200 pt-6">
            <p className="text-black">
              Already have an account?{" "}
              <Link
                href="/vendor/login"
                className="font-medium text-yellow-600 hover:text-yellow-800"
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