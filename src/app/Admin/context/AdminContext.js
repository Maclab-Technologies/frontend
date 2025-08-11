'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Changed from 'next/router'
import { toast } from 'react-toastify'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAdmin = localStorage.getItem('59minutes-admin')
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin))
        } else {
          // Only redirect if we're not already on the login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            router.push('/Admin/auth/login')
            toast.info('Please login to continue')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
          router.push('/Admin/auth/login')
          toast.error('Session expired. Please login again')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const login = async (email, password) => {
    try {
      if (email === 'admin@59minutes.com' && password === '59Minutes@2024') {
        const adminData = {
          id: 1,
          name: 'Admin User',
          email,
          role: 'superadmin',
          lastLogin: new Date().toISOString()
        }
        
        localStorage.setItem('59minutes-admin', JSON.stringify(adminData))
        setAdmin(adminData)
        toast.success('Login successful! Redirecting...')
        router.push('/Admin/dashboard')
        return { success: true }
      } else {
        toast.error('Invalid credentials')
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('59minutes-admin')
    setAdmin(null)
    toast.info('Logged out successfully')
    router.push('/Admin/auth/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    sidebarOpen,
    toggleSidebar
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}