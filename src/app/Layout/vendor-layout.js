import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function VendorLayout(
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout
) {
  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden mr-4 text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <h1 className="text-xl font-bold">
              <span className="text-yellow-400">59Minutes</span>Print
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-sm hover:text-yellow-400 transition"
            >
              <FaSignOutAlt className="mr-1" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
