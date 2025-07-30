import { FaSignOutAlt, FaUser, FaTimes, FaBars } from "react-icons/fa";

const AdminNavLayout = ({
 isMobileMenuOpen,
 setIsMobileMenuOpen,
 handleLogout,
 // activeTab,
 authUser
}) => {
  return (
    <header className="fixed left-0 right-0 bg-gray-800 border-b border-gray-700 z-30 h-16">
      <div className="h-full px-4 flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-gray-300 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Logo/Title - Visible on all screens */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-yellow-400">
            59Minutes Prints
          </h1>
          <span className="hidden md:inline-block text-gray-400 ml-2 border-l border-gray-600 pl-2">
            Admin
          </span>
        </div>

        {/* User Menu - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-750 px-3 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400">
              <FaUser size={14} />
            </div>
            <span className="text-sm">{authUser?.email || "Admin"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-gray-700"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>

        {/* Mobile Section Title */}
        {/* <div className="lg:hidden text-lg font-semibold text-gray-200">
          {activeTab}
        </div>
        <div className="lg:hidden w-10"></div> */}

      </div>
    </header>
  );
};


export default AdminNavLayout;