"use client";

import { useState, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "/public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../utils/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "@/app/(clients)/_provider/useClientProvider";
import { post } from "@/app/_hooks/fetch-hook";

const Register = () => {
  const router = useRouter();
  const { setIsLoggedIn, setAuthUser, setRole } = useContext(AuthContext);

  // Form states
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
  const [token, setToken] = useState("");

  // Phone number formatting
  const formatPhoneNumber = useCallback((value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");

    // Nigerian number formatting
    if (phoneNumber.startsWith("234")) {
      const remainingDigits = phoneNumber.slice(3);
      if (remainingDigits.length <= 3) return `+234 ${remainingDigits}`;
      if (remainingDigits.length <= 6)
        return `+234 ${remainingDigits.slice(0, 3)} ${remainingDigits.slice(3)}`;
      return `+234 ${remainingDigits.slice(0, 3)} ${remainingDigits.slice(3, 6)} ${remainingDigits.slice(6, 10)}`;
    } else if (phoneNumber.startsWith("0")) {
      const remainingDigits = phoneNumber.slice(1);
      if (remainingDigits.length <= 3) return `0${remainingDigits}`;
      if (remainingDigits.length <= 6)
        return `0${remainingDigits.slice(0, 3)} ${remainingDigits.slice(3)}`;
      return `0${remainingDigits.slice(0, 3)} ${remainingDigits.slice(3, 6)} ${remainingDigits.slice(6, 10)}`;
    }

    // Default formatting
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }, []);

  const handlePhoneChange = useCallback(
    (e) => {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      setFormData((prev) => ({ ...prev, phone: formattedPhoneNumber }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: null }));
      }
    },
    [errors.phone, formatPhoneNumber]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  // Validate form fields
  const validateField = useCallback(
    (name, value) => {
      let error = "";
      switch (name) {
        case "firstName":
          if (!value.trim()) error = "First name is required";
          break;
        case "lastName":
          if (!value.trim()) error = "Last name is required";
          break;
        case "email":
          if (!value.trim()) {
            error = "Email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email format";
          }
          break;
        case "phone":
          if (value) {
            const phoneRegex =
              /^(?:\+234\s?\d{3}\s?\d{3}\s?\d{4}|0\d{3}\s?\d{3}\s?\d{4}|\(\d{3}\)\s?\d{3}-\d{4})$/;
            if (!phoneRegex.test(value)) {
              error = "Use 0814 643 8621 or +234 814 643 8621 format";
            }
          }
          break;
        case "password":
          if (!value) {
            error = "Password is required";
          } else if (value.length < 6) {
            error = "Password must be at least 6 characters";
          }
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            error = "Passwords do not match";
          }
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [formData.password]
  );

  // Error message mapping
  const getErrorMessage = useCallback((errorCode) => {
    const errorMap = {
      "auth/email-already-in-use": "This email is already registered",
      "auth/invalid-email": "Invalid email address",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/operation-not-allowed": "Email/password accounts are not enabled",
      "auth/network-request-failed":
        "Network error. Please check your connection",
    };
    return errorMap[errorCode] || "Registration failed. Please try again";
  }, []);

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.entries(formData).forEach(([field, value]) => {
      validateField(field, value);
      if (errors[field]) newErrors[field] = errors[field];
    });

    if (Object.values(newErrors).some((error) => error)) return;

    setIsLoading(true);

    try {
      const response = await post(
        `/auth/users/signup`,
        {
          email: formData.email,
          password: formData.password,
          fullName: formData.firstName + " " + formData.lastName,
          phone: formData.phone,
        }
      );

      const data = response.data.data;

      setAuthUser(data.data);
      setIsLoggedIn(true);
      setToken(data.token)
      localStorage.setItem("userData", JSON.stringify(data.data));
      localStorage.setItem("userToken", data.token);

      toast.success("Signup successful!");
      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err.code));
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Request additional scopes
      provider.addScope("email");
      provider.addScope("profile"); // This gives access to name, picture, etc.

      // await setPersistence(
      //   auth,
      //   rememberMe ? browserLocalPersistence : browserSessionPersistence
      // );

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the ID token which contains user info
      const idToken = await user.getIdToken();

      // The user object already contains the info you need
      console.log("User details:", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      // If you need these details in your backend, you can:
      // Option 1: Send the ID token (contains claims) to your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/users/google/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          // Optionally include user details in body too
          body: JSON.stringify({
            fullName: user.displayName,
            email: user.email,
            avatar: user.photoURL,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google login failed");
      }

      const data = await response.json();

      // Validate response structure
      if (!data.data || !data.token) {
        throw new Error("Invalid response from server");
      }

      // Update auth state with the full user details
      setAuthUser({
        ...data.data,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });

      setIsLoggedIn(true);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...data.data,
          name: user.displayName,
          email: user.email,
        })
      );
      localStorage.setItem("userToken", data.token);

      toast.success("Google login successful!");
      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.warning("Sign in popup was closed before completing");
      } else {
        handleAuthError(error);
      }
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
          Get started with 59MinutesPrint for seamless printing services.
        </p>

        <form className="space-y-4" onSubmit={handleSignUp} noValidate>
          {/* Name Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={(e) => validateField("firstName", e.target.value)}
                className={`w-full p-3 rounded-md border ${errors.firstName ? "border-red-500" : "border-gray-400"}`}
              />
              {errors.firstName && (
                <p className="text-red-300 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={(e) => validateField("lastName", e.target.value)}
                className={`w-full p-3 rounded-md border ${errors.lastName ? "border-red-500" : "border-gray-400"}`}
              />
              {errors.lastName && (
                <p className="text-red-300 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={(e) => validateField("email", e.target.value)}
              className={`w-full p-3 rounded-md border ${errors.email ? "border-red-500" : "border-gray-400"}`}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone (Formatted) */}
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g., 0814 643 8621 or +234 814 643 8621)"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={(e) => validateField("phone", e.target.value)}
              className={`w-full p-3 rounded-md border ${errors.phone ? "border-red-500" : "border-gray-400"}`}
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={(e) => validateField("password", e.target.value)}
              className={`w-full p-3 rounded-md border ${errors.password ? "border-red-500" : "border-gray-400"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={(e) => validateField("confirmPassword", e.target.value)}
              className={`w-full p-3 rounded-md border ${errors.confirmPassword ? "border-red-500" : "border-gray-400"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-yellow-400 text-black py-3 rounded-md font-semibold shadow-md ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-yellow-300"
            } transition`}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full bg-white text-gray-700 py-3 rounded-md font-semibold shadow-md flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            } transition`}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Login Link */}
          <p className="text-white text-center mt-4">
            Already have an account?{" "}
            <a
              href="/Auth/Login"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>

      {/* Right Section: Brand Image */}
      <div className="hidden w-full md:flex md:w-1/2 bg-[#726002] items-center justify-center p-4">
        <Image
          src={logo}
          alt="59MinutesPrint Logo"
          className="w-full max-w-md rounded-lg shadow-xl"
          priority
        />
      </div>
    </div>
  );
};

export default Register;
