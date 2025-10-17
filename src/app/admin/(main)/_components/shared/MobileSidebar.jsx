// app/Admin/components/shared/MobileSidebar.js
'use client'
import {
  FiHome, FiPackage, FiUsers, FiTruck, 
  FiImage, FiDollarSign, FiCreditCard,
  FiSettings, FiLogOut, FiX
} from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileSidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  
  const navItems = [
    { path: '/Admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/Admin/orders', icon: <FiPackage />, label: 'Orders' },
    { path: '/Admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/Admin/vendors', icon: <FiTruck />, label: 'Vendors' },
    { path: '/Admin/designs', icon: <FiImage />, label: 'Designs' },
    { path: '/Admin/payouts', icon: <FiDollarSign />, label: 'Payouts' },
    { path: '/Admin/payments', icon: <FiCreditCard />, label: 'Payments' }
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-yellow-600">59Minutes Prints</h1>
            <button 
              onClick={onClose}
              className="text-gray-500"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                      pathname === item.path 
                        ? 'bg-yellow-100 text-yellow-600 font-medium' 
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
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <FiSettings className="mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onClose()
                    logout()
                  }}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}