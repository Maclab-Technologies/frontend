import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi'

export default function Header({ toggleSidebar }) {
  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Search and Menu (mobile) */}
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 lg:hidden"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>
        
        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <FiBell className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2">
              <FiUser className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )
}