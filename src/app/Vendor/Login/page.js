"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function VendorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      toast.error("Authentication service is not available. Please refresh the page.");
      return;
    }
    
    // Calculate form progress
    calculateFormProgress();
  }, [formData]);

  const calculateFormProgress = () => {
    const requiredFields = ['businessEmail', 'password'];
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].trim() !== ''
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.businessEmail,
        formData.password
      );
      
      // Get and store authentication token
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("firebase_token", token);
  
      toast.success("Login successful! Redirecting to dashboard...", { 
        autoClose: 1000,
        onClose: () => router.push("/Vendor/Dashboard")
      });
      
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Please register first.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed login attempts. Please try again later.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection.";
            break;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-t-yellow-400">
        <div className="bg-yellow-400 p-8 text-center">
          <h1 className="text-3xl font-bold text-black">Vendor Login</h1>
          <p className="text-black mt-2">Access your 59Minutes vendor dashboard</p>
          
          {/* Progress bar */}
          <div className="mt-6 w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-black mt-1">Form completion: {formProgress}%</p>
        </div>

        <div className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full px-4 py-3 border ${errors.password ? "border-red-500 ring-1 ring-red-500" : "border-black"} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                  placeholder="Enter your password"
                  value={formData.password}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="text-right mt-2">
                <Link
                  href="/Vendor/Forget"
                  className="text-sm text-yellow-600 hover:text-yellow-800 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Security Information Box */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Your connection is secure. We never store your password in plain text.
                  </p>
                </div>
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
                  Signing in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm border-t border-gray-200 pt-6">
            <p className="text-black">
              Don't have an account?{" "}
              <Link
                href="/Vendor/Register"
                className="font-medium text-yellow-600 hover:text-yellow-800"
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