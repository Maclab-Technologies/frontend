'use client'
import { AdminProviders } from './AdminProviders'
import { useAdmin } from './context/AdminContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/shared/Header'
import Sidebar from './components/shared/Sidebar'
import MobileSidebar from './components/shared/MobileSidebar'

export default function AdminLayout({ children }) {
  return (
    <AdminProviders>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProviders>
  )
}

function AdminLayoutContent({ children }) {
  const { admin, isLoading } = useAdmin()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Redirect if not authenticated (except for login page)
  useEffect(() => {
    if (!isLoading && !admin && !pathname.includes('/Admin/auth')) {
      router.push('/Admin/auth')
    }
  }, [admin, isLoading, pathname, router])

  // If it's the login page, just render it
  if (pathname.includes('/Admin/auth')) {
    return (
      <>
        {children}
        <ToastContainer position="bottom-right" />
      </>
    )
  }

  // If still loading or no admin, show loading state
  if (isLoading || !admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  // Otherwise, render the admin layout with sidebar
  return (
    <AdminAuthenticatedLayout 
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
    >
      {children}
    </AdminAuthenticatedLayout>
  )
}

function AdminAuthenticatedLayout({ children, mobileSidebarOpen, setMobileSidebarOpen }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-10">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  )
}