"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const router = useRouter();

  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Password match validation
    if (formData.password && formData.confirmPassword && 
        formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Phone format validation (optional field)
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Firebase error message parser
  const getReadableErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in or use another email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An error occurred during registration. Please try again.';
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      toast.success("Registration successful!");
      
      // Redirect after successful registration
      setTimeout(() => {
        router.push("/Clients/Dashboard"); // Fixed path to match Google sign-in redirect
      }, 2000);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(getReadableErrorMessage(err.code));
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google Sign-In successful!");
      
      // Redirect after Google sign-in
      setTimeout(() => {
        router.push("/Clients/Dashboard");
      }, 2000);
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Section: Registration Form */}
      <div className="w-full md:w-1/2 bg-[#726002] p-8 flex flex-col justify-center">
        <h2 className="text-white text-3xl font-bold mb-4">Sign up</h2>
        <p className="text-white mb-8">
          To get started enjoying a wide range of printing services at 59MinutesPrint
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignUp} noValidate>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-md border ${
                  errors.firstName ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-red-300 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-md border ${
                  errors.lastName ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-red-300 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone No.:"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-md border ${
                errors.phone ? "border-red-500" : "border-gray-400"
              }`}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full bg-yellow-400 text-black py-3 rounded-md font-semibold shadow-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-300"
            } transition-all`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign up"}
          </button>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full mt-2 bg-white text-gray-700 py-3 rounded-md font-semibold shadow-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            } transition-all flex justify-center items-center gap-2`}
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign up with Google
          </button>

          <p className="text-white mt-4 text-center">
            If you have an account before,
            <a href="/Auth/Login" className="text-yellow-400 font-semibold hover:underline ml-1">Login</a>
          </p>
        </form>
      </div>

      {/* Right Section: Image */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-[#726002]">
        <Image src={logo} alt="59 Minutes Print Logo" className="w-3/4 h-[90%] rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default Register;