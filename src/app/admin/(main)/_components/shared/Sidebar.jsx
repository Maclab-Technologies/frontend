'use client'
import { FiHome, FiShoppingCart, FiUsers, FiTruck, FiImage, FiDollarSign, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { AuthContext } from '@/app/(clients)/_provider/useClientProvider'

export default function Sidebar() {
  const {logout} = useContext(AuthContext)
  const pathname = usePathname()
  
  const navItems = [
    { path: '/Admin/Dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/Admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
    { path: '/Admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/Admin/vendors', icon: <FiTruck />, label: 'Vendors' },
    { path: '/Admin/designs', icon: <FiImage />, label: 'Designs' },
    { path: '/Admin/payouts', icon: <FiDollarSign />, label: 'Payouts' },
    { path: '/Admin/payments', icon: <FiCreditCard />, label: 'Payments' }
  ]

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10 border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-amber-600">59Minutes Prints</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg mx-2 transition-colors ${
                    pathname === item.path 
                      ? 'bg-amber-50 text-amber-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Section */}
        <div className="px-2 py-4 border-t border-gray-200">
          <ul className="space-y-1">
            <li>
              <Link 
                href="#"
                className="flex items-center px-3 py-3 rounded-lg mx-2 text-gray-700 hover:bg-gray-100"
              >
                <FiSettings className="mr-3" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={logout}
                className="flex items-center w-full px-3 py-3 rounded-lg mx-2 text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}