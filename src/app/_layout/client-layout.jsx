'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
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
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const pathname = usePathname()
  
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

  return (
    
    <header className="w-full">
      <div className="h-full px-4 flex justify-between items-center">
        {/* Global Styles */}
        <style jsx global>{`
          .navbar-blur {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .cart-bounce {
            animation: bounce 0.3s ease-in-out;
          }
          @keyframes bounce {
            0%,
            20%,
            60%,
            100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-6px);
            }
            80% {
              transform: translateY(-3px);
            }
          }
        `}</style>

        {/* Main Navbar */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-black/95 navbar-blur shadow-lg border-b border-yellow-400/20"
              : "bg-black/90 navbar-blur"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src={logo}
                    alt="59Minutes Prints"
                    width={40}
                    height={40}
                    className="rounded-lg transition-transform duration-200 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-yellow-400">
                    59Minutes
                  </span>
                  <span className="text-xl font-light text-white ml-1">
                    Prints
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === href
                        ? "bg-yellow-400 text-black shadow-md"
                        : "text-white hover:bg-yellow-400/10 hover:text-yellow-400"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Desktop Right Section */}
              <div className="hidden md:flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="text-white hover:text-yellow-400 px-4 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-yellow-400 text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors duration-200 shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Notifications */}
                    <button className="p-2 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors duration-200 relative">
                      <FiBell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Cart */}
                    <Link
                      href="/cart"
                      className="p-2 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors duration-200 relative"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </Link>

                    {/* User Menu */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg pl-3 pr-4 py-2 transition-colors duration-200">
                        <FaUser className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">
                          {authUser?.fullName?.split(" ")[0] || "Guest"}
                        </span>
                      </button>

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-64 bg-black/95 rounded-xl shadow-xl border border-yellow-400/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                        <div className="p-4 border-b border-yellow-400/20">
                          <p className="font-medium text-white">
                            {authUser?.fullName || "Guest"}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {authUser?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          {[
                            {
                              href: "/profile",
                              icon: FaUser,
                              label: "Profile",
                            },
                            {
                              href: "/dashboard",
                              icon: FaBox,
                              label: "Dashboard",
                            },
                            { href: "/inbox", icon: FaList, label: "Inbox" },
                            { href: "/help", icon: FaInfo, label: "Help" },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors duration-200"
                            >
                              <Icon className="w-4 h-4 mr-3 text-gray-400" />
                              {label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                          >
                            <FiX className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-3">
                {authUser && (
                  <Link
                    href="/cart"
                    className="p-2 text-white hover:text-yellow-400 rounded-lg relative"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors duration-200"
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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-black/95 shadow-2xl z-50 transform transition-transform duration-300 md:hidden border-l border-yellow-400/20 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div className="flex justify-between items-center p-6 border-b border-yellow-400/20">
            <span className="text-lg font-semibold text-yellow-400">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* User Section */}
            {isLoggedIn && authUser && (
              <div className="p-6 border-b border-yellow-400/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaUser className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {authUser?.fullName || "Guest"}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {authUser?.email}
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
                  className={`flex items-center px-6 py-4 text-base font-medium transition-colors duration-200 ${
                    pathname === href
                      ? "bg-yellow-400/10 text-yellow-400 border-r-2 border-yellow-400"
                      : "text-white hover:bg-yellow-400/10 hover:text-yellow-400"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="p-6 border-t border-yellow-400/20">
              {!isLoggedIn ? (
                <div className="space-y-3">
                  <Link
                    href="/Auth/Login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center border border-yellow-400/60 text-yellow-400 rounded-lg font-medium hover:bg-yellow-400/10 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { href: "/profile", icon: FaUser, label: "Profile" },
                    {
                      href: "/dashboard",
                      icon: FaBox,
                      label: "Dashboard",
                    },
                    {
                      href: "/cart",
                      icon: FaShoppingCart,
                      label: "Cart",
                      badge: cartCount,
                    },
                    { href: "/Inbox", icon: FaList, label: "Inbox" },
                    { href: "/Help", icon: FaInfo, label: "Help" },
                  ].map(({ href, icon: Icon, label, badge }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-4 text-white hover:bg-yellow-400/10 hover:text-yellow-400 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        <span>{label}</span>
                      </div>
                      {badge > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-3 px-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                  >
                    <FiX className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default ClientNavLayout;
