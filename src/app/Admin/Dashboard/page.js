// Admin/Dashboard/page.js
'use client'
import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from '../components/shared/Header'
import Sidebar from '../components/shared/Sidebar'
import MobileSidebar from '../components/shared/MobileSidebar'
import StatsCards from '../components/Dashboard/StatsCards'
import ActivityGraph from '../components/Dashboard/ActivityGraph'
import RecentActivity from '../components/Dashboard/RecentActivity'

export default function DashboardPage() {
  const { admin, logout } = useAdmin()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-100 rounded-lg p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-amber-800 mb-1">Welcome back, {admin?.name || 'Admin'}!</h2>
                <p className="text-sm text-amber-600">Here's what's happening with your business today.</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Last login: {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <StatsCards />
          
          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
            {/* Order Activity Chart */}
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <ActivityGraph />
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  )
}