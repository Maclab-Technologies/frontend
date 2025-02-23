"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router for redirection
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../utils/firebaseconfig"; // Adjust import path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const router = useRouter(); // Initialize router

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("User registered successfully!");

      // Redirect after successful registration
      setTimeout(() => {
        router.push("/Client/Dashboard"); // Redirect user
      }, 2000); // Delay to show toast

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google Sign-In successful!");

      // Redirect after Google sign-in
      setTimeout(() => {
        router.push("/Clients/Dashboard");
      }, 2000);
    } catch (err) {
      toast.error(err.message);
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
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="flex space-x-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-1/2 p-3 rounded-md border border-gray-400"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-1/2 p-3 rounded-md border border-gray-400"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border border-gray-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone No.:"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border border-gray-400"
          />
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 rounded-md font-semibold shadow-md hover:bg-yellow-300 transition-all"
          >
            Sign up
          </button>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-2 bg-white text-gray-700 py-3 rounded-md font-semibold shadow-md hover:bg-gray-100 transition-all"
          >
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
