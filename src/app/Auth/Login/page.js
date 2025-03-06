"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence 
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();  // Initialize router
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Set persistence for session
      await setPersistence(auth, browserLocalPersistence);
      
      // Sign in
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Login successful!");
      setFormData({ email: "", password: "" });

      // Redirect after login
      setTimeout(() => {
        router.push("/Client/Dashboard"); // Updated for consistency
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      
      // Map Firebase error codes to user-friendly messages
      const errorMap = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid login credentials',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/too-many-requests': 'Too many failed login attempts. Please try again later'
      };
      
      toast.error(errorMap[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set persistence
      await setPersistence(auth, browserLocalPersistence);
      
      // Sign in with popup
      await signInWithPopup(auth, provider);
      toast.success("Google Sign-In successful!");

      // Redirect after Google login
      setTimeout(() => {
        router.push("/Clients/Dashboard"); // Updated for consistency
      }, 1500);
    } catch (err) {
      console.error("Google Sign-In error:", err);
      
      const errorMap = {
        'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials',
        'auth/popup-blocked': 'The popup was blocked by your browser',
        'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the process',
        'auth/cancelled-popup-request': 'The operation was canceled',
        'auth/network-request-failed': 'Network error. Please check your connection'
      };
      
      toast.error(errorMap[err.code] || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Section: Image */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-[#726002] p-6">
        <Image src={logo} alt="59 Minutes Print Logo" className="w-3/4 h-[100%] rounded-lg shadow-lg" />
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 bg-white shadow-lg">
        <h2 className="text-gray-800 text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-600 mb-6 text-center">Sign in to your 59MinutesPrint account</p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-md font-semibold shadow-md hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password & Sign Up Links */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Forgot your password?{" "}
            <a href="/Auth/ForgotPassword" className="text-yellow-500 hover:text-yellow-400 underline">
              Reset it here
            </a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Don't have an account?{" "}
            <a href="/Auth/Register" className="text-yellow-500 hover:text-yellow-400 underline">
              Sign up
            </a>
          </p>
        </div>

        {/* Social Login Section */}
        <div className="mt-6">
          <p className="text-gray-600 text-center mb-4">Or sign in with</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-md font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span>{loading ? "Processing..." : "Sign in with Google"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;