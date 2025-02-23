"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Login successful!");
      setFormData({ email: "", password: "" });

      // Redirect after login
      router.push("/Clients/Dashboard");
    } catch (err) {
      toast.error("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google Sign-In successful!");

      // Redirect after Google login
      router.push("/Clients/Dashboard");
    } catch (err) {
      toast.error("Google Sign-In failed. Please try again.");
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
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input
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
            <label className="block text-gray-700 text-sm font-medium">Password</label>
            <input
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
              className="absolute right-3 top-10 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-md font-semibold shadow-md hover:bg-yellow-400 transition-all"
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
              onClick={handleGoogleSignIn}
              className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-all"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
