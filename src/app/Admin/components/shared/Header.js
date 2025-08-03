'use client';

import { useAdmin } from '../../context/AdminContext';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const { 
    activeTab, 
    mobileNavOpen, 
    setMobileNavOpen,
    handleLogout 
  } = useAdmin();

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm sticky top-16 z-10 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="mr-4 lg:hidden text-gray-300 hover:text-white"
          >
            <FaBars size={20} />
          </button>
          <h2 className="text-xl font-bold text-white flex items-center">
            {activeTab}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gray-750 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400">
              <FaUser size={14} />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white text-sm"
          >
            <FaSignOutAlt size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}