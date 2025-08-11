'use client'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login } = useAdmin()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@59minutes.com',
    password: '59Minutes@2024'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      // Check against hardcoded credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Call login function from context
        const result = await login(email, password)
        
        if (result.success) {
          toast.success('Login successful! Redirecting...')
          router.push('/Admin/Dashboard')
        } else {
          setError(result.error || 'Login failed')
        }
      } else {
        setError('Invalid credentials')
        toast.error('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-fill demo credentials for testing (remove in production)
  const fillDemoCredentials = () => {
    setEmail(ADMIN_CREDENTIALS.email)
    setPassword(ADMIN_CREDENTIALS.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-24 h-16 md:w-28 md:h-20 px-4 bg-yellow-600 rounded-xl md:rounded-2xl mb-3 md:mb-4 shadow-lg">
            <span className="text-white font-bold text-lg md:text-xl">59MP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            Admin Portal
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Sign in to manage your print business
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-lg">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1 md:space-y-2">
              <label htmlFor="email" className="text-xs md:text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="admin@59minutes.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1 md:space-y-2">
              <label htmlFor="password" className="text-xs md:text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 md:py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Demo Credentials Button (remove in production) */}
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-yellow-600 hover:text-yellow-700 underline"
            >
              Use demo admin credentials
            </button>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-3 h-3 md:w-4 md:h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" 
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200">
                Forgot password?
              </Link>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-semibold py-2 md:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed group text-xs md:text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 59Minutes Prints. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}