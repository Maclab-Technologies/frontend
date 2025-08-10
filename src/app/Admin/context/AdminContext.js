import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would verify the token with your API
        const storedAdmin = localStorage.getItem('59minutes-admin')
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin))
        } else if (!router.pathname.includes('/auth')) {
          router.push('/Admin/auth/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (!router.pathname.includes('/auth')) {
          router.push('/Admin/auth/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, you would call your API here
      // This is just mock authentication with hardcoded credentials
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
        router.push('/Admin/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('59minutes-admin')
    setAdmin(null)
    router.push('/Admin/auth/login')
  }

  // Toggle sidebar (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Context value
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
      {!loading && children}
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