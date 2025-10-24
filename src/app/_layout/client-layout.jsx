'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FiMenu, FiX, FiBell, FiChevronDown, FiSearch, FiLogIn, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../(root)/_provider/useClientProvider";
import {
  FaShoppingCart,
  FaUser,
  FaHome,
  FaBox,
  FaList,
  FaStar,
  FaStore,
  FaInfo,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../../public/images/brandimage.jpeg";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: FaHome },
  { label: "Products", href: "/products", icon: FaBox },
  { label: "Categories", href: "/categories", icon: FaList },
  { label: "Features", href: "/features", icon: FaStar },
  { label: "Become a Vendor", href: "/vendor", icon: FaStore },
  { label: "About Us", href: "/about", icon: FaInfo },
];

const ClientNavLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const pathname = usePathname();
  
  const { 
    isLoggedIn, 
    authUser, 
    logoutUser 
  } = useAuth();

  const cartCount = cartItems.length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full">
      {/* Global Styles */}
      <style jsx global>{`
        .navbar-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(0, 0, 0, 0.85);
        }
        .cart-bounce {
          animation: bounce 0.4s ease-in-out;
        }
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes bounce {
          0%, 20%, 60%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          80% { transform: translateY(-3px); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "navbar-blur shadow-2xl border-b border-yellow-400/30"
            : "bg-gradient-to-b from-black/95 to-black/80"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative">
                <Image
                  src={logo}
                  alt="59Minutes Prints"
                  width={45}
                  height={45}
                  className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  59Minutes
                </span>
                <span className="text-xl font-light text-white ml-1">
                  Prints
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 mx-8">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    pathname === href
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/25"
                      : "text-white/90 hover:text-yellow-400 hover:bg-white/5 hover:shadow-lg"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${
                    pathname === href ? 'text-black' : 'group-hover:scale-110'
                  }`} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Button */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-3 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
                
                {/* Search Dropdown */}
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-black/95 navbar-blur rounded-2xl shadow-2xl border border-yellow-400/20 p-4 fade-in">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, categories..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50 transition-colors duration-300"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-3 text-white/80 hover:text-yellow-400 font-medium transition-all duration-300 hover:bg-white/5 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Notifications */}
                  <button className="p-3 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 hover:shadow-lg relative group">
                    <FiBell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
                    <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 navbar-blur rounded-2xl shadow-2xl border border-yellow-400/20 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 fade-in">
                      <p className="text-white font-semibold mb-2">Notifications</p>
                      <p className="text-white/60 text-sm">No new notifications</p>
                    </div>
                  </button>

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="p-3 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 hover:shadow-lg relative group"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full cart-bounce border-2 border-black">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 rounded-xl pl-4 pr-5 py-3 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-yellow-400/30"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {authUser?.fullName?.split(" ")[0] || "Guest"}
                      </span>
                      <FiChevronDown className={`w-4 h-4 text-yellow-400 transition-transform duration-300 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-black/95 navbar-blur rounded-2xl shadow-2xl border border-yellow-400/20 fade-in">
                        <div className="p-6 border-b border-yellow-400/20">
                          <p className="font-semibold text-white text-lg">
                            {authUser?.fullName || "Guest"}
                          </p>
                          <p className="text-sm text-white/60 truncate mt-1">
                            {authUser?.email}
                          </p>
                        </div>
                        <div className="p-2">
                          {[
                            { href: "/profile", icon: FaUser, label: "Profile" },
                            { href: "/dashboard", icon: FaBox, label: "Dashboard" },
                            { href: "/orders", icon: FaList, label: "My Orders" },
                            { href: "/help", icon: FaInfo, label: "Help Center" },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center px-4 py-4 text-sm text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200 group"
                            >
                              <Icon className="w-4 h-4 mr-3 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                              {label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-4 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group mt-2"
                          >
                            <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-3 text-white/80 hover:text-yellow-400 rounded-xl transition-colors duration-200"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="p-3 text-white/80 hover:text-yellow-400 rounded-xl relative transition-colors duration-200"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full cart-bounce border border-black">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              )}
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 border border-transparent hover:border-yellow-400/30"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden pb-4 fade-in">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50 transition-colors duration-300"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-black/95 navbar-blur shadow-2xl z-50 transform transition-transform duration-500 md:hidden border-l border-yellow-400/30 slide-in-right ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <FaUser className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Menu
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-colors duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-y-auto">
          {/* User Section */}
          {isLoggedIn && authUser ? (
            <div className="p-6 border-b border-yellow-400/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-lg truncate">
                    {authUser?.fullName || "Guest"}
                  </p>
                  <p className="text-sm text-white/60 truncate mt-1">
                    {authUser?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Show auth status for non-logged in users
            <div className="p-6 border-b border-yellow-400/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-lg">
                    Welcome!
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    Sign in to your account
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-6">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-6 py-5 text-base font-semibold transition-all duration-300 group ${
                  pathname === href
                    ? "bg-yellow-400/10 text-yellow-400 border-r-4 border-yellow-400 shadow-inner"
                    : "text-white/80 hover:text-yellow-400 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 mr-4 transition-transform duration-300 ${
                  pathname === href ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="p-6 border-t border-yellow-400/20">
            {!isLoggedIn ? (
              <div className="space-y-4">
                {/* Login Link in Sidebar */}
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full py-4 px-6 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 group border border-transparent hover:border-yellow-400/30"
                >
                  <FiLogIn className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Login</span>
                </Link>

                {/* Register Link in Sidebar */}
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  <FiUserPlus className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign Up</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { href: "/profile", icon: FaUser, label: "Profile" },
                  { href: "/dashboard", icon: FaBox, label: "Dashboard" },
                  { href: "/orders", icon: FaList, label: "My Orders" },
                  { 
                    href: "/cart", 
                    icon: FaShoppingCart, 
                    label: "Cart", 
                    badge: cartCount 
                  },
                  { href: "/help", icon: FaInfo, label: "Help Center" },
                ].map(({ href, icon: Icon, label, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 px-4 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{label}</span>
                    </div>
                    {badge && badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-4 px-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-400/30"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Additional Auth Links for Non-Logged In Users */}
          {!isLoggedIn && (
            <div className="p-6 border-t border-yellow-400/20">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-3">
                  Don't have an account?
                </p>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors duration-200"
                >
                  Create one now →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mb-16"></div>
    </header>
    
  );
};

export default ClientNavLayout;