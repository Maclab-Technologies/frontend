"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";
import { FaEye, FaEyeSlash, FaSpinner, FaLock, FaEnvelope } from "react-icons/fa";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const emailInputRef = useRef(null);
  const [token, setToken] = useState('');

  // Auto-focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        redirectUserBasedOnRole(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form inputs
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    
    if (!isForgotPassword && !formData.password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  // Redirect user based on their role
  const redirectUserBasedOnRole = async (uid) => {
    try {
      // In production, fetch user role from your database
      // This is a mock implementation - replace with actual role lookup
      const role = "Customer"; // Default role
      
      switch(role) {
        case "Customer":
          router.push("/Clients/Dashboard");
          break;
        case "Vendor":
          router.push("/Vendor");
          break;
        case "Graphics Designer":
          router.push("/Designer");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      console.error("Role redirection error:", error);
      router.push("/");
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Set session persistence
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const idToken = userCredential.user.accessToken
      setToken(idToken), 
      localStorage.setItem('userToken', idToken)

      toast.success("Login successful!");
      redirectUserBasedOnRole(userCredential.user.uid);
      
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const result = await signInWithPopup(auth, provider);

      console.log(result)

      const idToken = result.user.accessToken
      setToken(idToken), 
      localStorage.setItem('userToken', idToken)


      toast.success("Google login successful!");
      redirectUserBasedOnRole(result.user.uid);
      
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!forgotPasswordEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      toast.success(`Password reset email sent to ${forgotPasswordEmail}`);
      setIsForgotPassword(false);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    const errorMap = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'Account disabled',
      'auth/user-not-found': 'Account not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Account temporarily locked. Try again later or reset your password.',
      'auth/popup-blocked': 'Popup blocked by browser. Please allow popups for this site.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completing',
      'auth/network-request-failed': 'Network error. Please check your internet connection',
      'auth/cancelled-popup-request': 'Sign-in cancelled',
      'auth/missing-email': 'Please enter your email address',
      'auth/invalid-action-code': 'Password reset link is invalid or expired',
      'auth/expired-action-code': 'Password reset link has expired',
      'INVALID_LOGIN_CREDENTIALS': 'INVALID_LOGIN_CREDENTIALS'
    };

    toast.error(error.message);
    console.error("Authentication error:", error);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Left Section - Brand Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#726002] items-center justify-center p-8">
        <div className="relative w-full h-full max-w-md">
          <Image
            src={logo}
            alt="59MinutesPrint Logo"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-12">
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
          {isForgotPassword ? (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <FaLock className="h-6 w-6 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                <p className="text-gray-600">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handlePasswordReset}
                  disabled={forgotPasswordLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ${forgotPasswordLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-sm text-yellow-600 hover:text-yellow-500 font-medium"
                >
                  Back to login
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to access your 59MinutesPrint account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                      autoComplete="email"
                      required
                      ref={emailInputRef}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition pr-10"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/Auth/Register" className="font-medium text-yellow-600 hover:text-yellow-500">
                  Sign up
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;