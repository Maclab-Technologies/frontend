'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FiMenu, FiX, FiBell, FiChevronDown } from "react-icons/fi";
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
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const pathname = usePathname();
  
  const { 
    isLoggedIn, 
    authUser, 
    logoutUser 
  } = useAuth();

  const cartCount = cartItems.length;

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
  };

  return (
    <header className="w-full">
      {/* Modern Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-xl shadow-2xl border-b border-yellow-500/30"
            : "bg-gradient-to-b from-black/95 to-transparent backdrop-blur-lg"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative">
                <Image
                  src={logo}
                  alt="59Minutes Prints"
                  width={45}
                  height={45}
                  className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  priority
                />
                <div className="absolute inset-0 rounded-xl bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  59Minutes
                </span>
                <span className="text-2xl font-light text-white ml-1">
                  Prints
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden xl:flex items-center space-x-1 mx-8">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                    pathname === href
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-2xl shadow-yellow-500/25 scale-105"
                      : "text-white/90 hover:text-yellow-400 hover:bg-white/5 hover:scale-105"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${
                    pathname === href ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {!isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-white/90 hover:text-yellow-400 text-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <button className="relative p-2.5 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-2xl transition-all duration-300 group">
                    <FiBell className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black shadow-lg"></span>
                  </button>

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative p-2.5 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-2xl transition-all duration-300 group"
                  >
                    <FaShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-black">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 rounded-2xl pl-4 pr-5 py-2.5 transition-all duration-300 group border border-white/10 hover:border-yellow-500/30"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <FaUser className="w-3.5 h-3.5 text-black font-bold" />
                      </div>
                      <span className="text-sm font-semibold text-white/90">
                        {authUser?.fullName?.split(" ")[0] || "Guest"}
                      </span>
                      <FiChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 transform origin-top-right scale-95 animate-in fade-in-0 zoom-in-95">
                        <div className="px-5 py-4 border-b border-white/10">
                          <p className="font-bold text-white text-sm">
                            {authUser?.fullName || "Guest"}
                          </p>
                          <p className="text-xs text-white/60 truncate mt-1">
                            {authUser?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          {[
                            { href: "/profile", icon: FaUser, label: "Profile" },
                            { href: "/dashboard", icon: FaBox, label: "Dashboard" },
                            { href: "/orders", icon: FaList, label: "My Orders" },
                            { href: "/settings", icon: FaInfo, label: "Settings" },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center px-5 py-3 text-sm text-white/80 hover:text-yellow-400 hover:bg-white/5 transition-all duration-200 group"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <Icon className="w-4 h-4 mr-3 text-white/60 group-hover:text-yellow-400 transition-colors" />
                              {label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                          >
                            <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="relative p-2.5 text-white/80 hover:text-yellow-400 rounded-2xl transition-colors duration-300"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-2xl transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in-0"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modern Mobile Menu - Login/Register after navigation items */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-black to-gray-900 shadow-2xl z-50 transform transition-transform duration-500 lg:hidden border-l border-yellow-500/30 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header - Clean with only close button */}
        <div className="flex justify-end items-center p-4 border-b border-yellow-500/30 bg-black/50">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 text-white/80 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-colors duration-300"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-y-auto">
          {/* User Section - Only show if logged in */}
          {isLoggedIn && authUser && (
            <div className="p-6 border-b border-yellow-500/30 bg-black/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-black font-bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">
                    {authUser?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {authUser?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="p-4">
            <div className="space-y-2">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300 group ${
                    pathname === href
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                      : "text-white/90 hover:text-yellow-400 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-4 transition-transform duration-300 ${
                    pathname === href ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Login/Register Buttons - Always visible when not logged in */}
          {!isLoggedIn && (
            <div className="p-4 border-t border-yellow-500/30 bg-black/30">
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center border-2 border-yellow-500 text-yellow-400 rounded-2xl font-bold hover:bg-yellow-500/10 transition-all duration-300 hover:scale-105 text-lg flex items-center justify-center"
                >
                  <FaUser className="w-5 h-5 mr-3" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl font-bold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105 text-lg flex items-center justify-center"
                >
                  <FaUser className="w-5 h-5 mr-3" />
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* User Actions - Only show if logged in */}
          {isLoggedIn && (
            <div className="p-4 border-t border-yellow-500/30 bg-black/30">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-center bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition-colors duration-300 text-sm font-semibold flex items-center justify-center"
                  >
                    <FaUser className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-center bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition-colors duration-300 text-sm font-semibold flex items-center justify-center"
                  >
                    <FaBox className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 text-center bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500/20 transition-all duration-300 hover:scale-105 border border-red-500/30 text-lg flex items-center justify-center"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientNavLayout;