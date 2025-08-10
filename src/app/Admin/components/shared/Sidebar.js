import { FiHome, FiShoppingCart, FiUsers, FiTruck, FiImage, FiDollarSign, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()
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
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-yellow-600">59Minutes Prints</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`flex items-center px-4 py-3 rounded-lg transition-colors ${router.pathname === item.path ? 'bg-yellow-100 text-yellow-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom Section */}
        <div className="px-4 py-6 border-t border-gray-200">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <FiSettings className="mr-3" />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <FiLogOut className="mr-3" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}