'use client';

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
  const [fieldStatus, setFieldStatus] = useState({});

  useEffect(() => {
    calculateFormProgress();
    validateFieldStatus();
  }, [formData]);

  const validateFieldStatus = () => {
    const status = {};

    // Business Name validation
    if (formData.businessName) {
      status.businessName = formData.businessName.trim().length >= 3 
        ? 'valid' 
        : 'invalid';
    }

    // Email validation
    if (formData.businessEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      status.businessEmail = emailRegex.test(formData.businessEmail) 
        ? 'valid' 
        : 'invalid';
    }

    // Phone validation
    if (formData.businessPhoneNumber) {
      const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
      status.businessPhoneNumber = phoneRegex.test(formData.businessPhoneNumber) 
        ? 'valid' 
        : 'invalid';
    }

    // Address validation
    if (formData.businessAddress) {
      status.businessAddress = formData.businessAddress.trim().length >= 5 
        ? 'valid' 
        : 'invalid';
    }

    // Description validation
    if (formData.businessDescription) {
      status.businessDescription = formData.businessDescription.length >= 20 
        ? 'valid' 
        : 'invalid';
    }

    // Password validation
    if (formData.businessPassword) {
      const hasMinLength = formData.businessPassword.length >= 6;
      const hasUpperCase = /[A-Z]/.test(formData.businessPassword);
      const hasNumber = /[0-9]/.test(formData.businessPassword);
      status.businessPassword = hasMinLength && hasUpperCase && hasNumber 
        ? 'valid' 
        : 'invalid';
    }

    // Confirm Password validation
    if (formData.confirmPassword) {
      status.confirmPassword = formData.confirmPassword === formData.businessPassword 
        ? 'valid' 
        : 'invalid';
    }

    setFieldStatus(status);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-t-yellow-400">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Join 59Minutes</h1>
          <p className="text-black/80 text-lg">
            Start selling your prints in minutes
          </p>

          {/* Progress bar */}
          <div className="mt-6 bg-white/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-black h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-black/80 mt-2 font-medium">
            Profile completion: {formProgress}%
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="businessName"
                    className={getInputClasses('businessName')}
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getStatusIcon('businessName')}
                  </div>
                </div>
                {errors.businessName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.businessName}
                  </p>
                )}
                {formData.businessName && !errors.businessName && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Business name looks good!
                  </p>
                )}
              </div>

              {/* Business Email */}
              <div className="md:col-span-1">
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
              </div>

              {/* Business Phone */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="businessPhoneNumber"
                    className={getInputClasses('businessPhoneNumber')}
                    placeholder="+234 (123) 456-7890"
                    value={formData.businessPhoneNumber}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getStatusIcon('businessPhoneNumber')}
                  </div>
                </div>
                {errors.businessPhoneNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.businessPhoneNumber}
                  </p>
                )}
              </div>

              {/* Shop Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Shop Address (Line 1) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="businessAddress"
                    className={getInputClasses('businessAddress')}
                    placeholder="Street address, P.O. box, company name"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getStatusIcon('businessAddress')}
                  </div>
                </div>
                {errors.businessAddress && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.businessAddress}
                  </p>
                )}
              </div>

              {/* Shop Address 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Shop Address (Line 2){" "}
                  <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="businessAddress2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200 text-black placeholder-gray-500"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.businessAddress2}
                  onChange={handleInputChange}
                />
              </div>

              {/* Business Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="businessDescription"
                    rows={4}
                    className={`${getInputClasses('businessDescription')} text-black placeholder-gray-500`}
                    placeholder="Tell us about your business, products, and services..."
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusIcon('businessDescription')}
                  </div>
                </div>
                {errors.businessDescription && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.businessDescription}
                  </p>
                )}
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-600">
                    {formData.businessDescription.length}/20 characters minimum
                  </p>
                  {formData.businessDescription.length >= 20 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Good description length
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="businessPassword"
                    className={getInputClasses('businessPassword')}
                    placeholder="Create a strong password"
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
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={getInputClasses('confirmPassword')}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                    {getStatusIcon('confirmPassword')}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && getInputStatus('confirmPassword') === 'valid' && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Passwords match!
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            {formData.businessPassword && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className={`flex items-center gap-2 ${formData.businessPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.businessPassword.length >= 6 ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    At least 6 characters
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.businessPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    {/[A-Z]/.test(formData.businessPassword) ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${/[0-9]/.test(formData.businessPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    {/[0-9]/.test(formData.businessPassword) ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    One number
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className={`flex items-start p-4 rounded-lg border transition-colors ${
              errors.agreeToTerms 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
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
                <label
                  htmlFor="agreeToTerms"
                  className="font-medium text-gray-900"
                >
                  I agree to the{" "}
                  <Link
                    href="/vendor/terms"
                    className="text-yellow-600 hover:text-yellow-800 underline font-semibold"
                    target="_blank"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-600 text-xs mt-1">
                  20% platform fee applies to all sales. By registering, you agree to our vendor agreement.
                </p>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.agreeToTerms}
                  </p>
                )}
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
                  Creating Your Vendor Account...
                </span>
              ) : (
                "Start Selling Now 🚀"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-700">
              Already have a vendor account?{" "}
              <Link
                href="/vendor/login"
                className="font-semibold text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}