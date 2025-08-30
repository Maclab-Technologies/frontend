"use client";
import { useState, useContext } from "react";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { VendorAuthContext } from "../vendor/_provider/useVendorProvider";

export default function VendorNavLayout() {
  const { logoutVendor, isLoggedIn } = useContext(VendorAuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {isLoggedIn && (
        <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden mr-4 text-white focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes size={20} />
                  ) : (
                    <FaBars size={20} />
                  )}
                </button>
                <h1 className="text-xl font-bold">
                  <span className="text-yellow-400">59Minutes</span>Print
                </h1>
                <span className="hidden md:inline-block text-gray-400 ml-2 border-l border-gray-600 pl-2">
                  Vendor
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logoutVendor}
                  className="flex items-center text-sm hover:text-yellow-400 transition"
                >
                  <FaSignOutAlt className="mr-1" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
