"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiBell,
  FiChevronDown,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
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
  FaTachometerAlt,
  FaClipboardList,
  FaQuestionCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

// Public navigation links for non-authenticated users
const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/", icon: FaHome },
  { label: "Products", href: "/products", icon: FaBox },
  { label: "Categories", href: "/categories", icon: FaList },
  { label: "Features", href: "/features", icon: FaStar },
  { label: "Vendor", href: "/vendor", icon: FaStore },
  { label: "About", href: "/about", icon: FaInfo },
];

// User dashboard links for authenticated users
const USER_DASHBOARD_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
  { label: "My Orders", href: "/dashboard/orders", icon: FaClipboardList },
  { label: "Products", href: "/products", icon: FaBox },
  {
    label: "Transaction",
    href: "/dashboard/transaction",
    icon: FaMoneyBillWave,
  },
];

const ClientNavLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const pathname = usePathname();

  const { isLoggedIn, authUser, logoutUser } = useAuth();

  const cartCount = cartItems.length;

  // Get the appropriate navigation links based on authentication
  const getNavLinks = () => {
    return [
      ...PUBLIC_NAV_LINKS,
      // {
      //   label: "Cart",
      //   href: "/cart",
      //   icon: FaShoppingCart,
      //   badge: cartCount,
      // },
    ];
  };

  // Get mobile menu links based on authentication
  const getMobileMenuLinks = () => {
    if (isLoggedIn) {
      return [...PUBLIC_NAV_LINKS, ...USER_DASHBOARD_LINKS];
    } else {
      return [
        ...PUBLIC_NAV_LINKS,
        {
          label: "Cart",
          href: "/cart",
          icon: FaShoppingCart,
          badge: cartCount,
        },
      ];
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <header className="w-full">
      {/* Global Styles */}
      <style jsx global>{`
        .navbar-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.9);
        }
        .cart-bounce {
          animation: bounce 0.3s ease-in-out;
        }
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes bounce {
          0%,
          20%,
          60%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          80% {
            transform: translateY(-2px);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "navbar-blur shadow-xl border-b border-yellow-400/20"
            : "bg-black"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative">
                <Image
                  src='./images/brandimage.jpeg'
                  alt="59Minutes Prints"
                  width={40}
                  height={40}
                  className="rounded-lg transition-all duration-200 group-hover:scale-105"
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

            {/* Desktop Navigation - Different links based on auth status */}
            <div className="hidden lg:flex items-center space-x-1">
              {getNavLinks().map(({ label, href, icon: Icon }) => (
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
            <div className="hidden md:flex items-center space-x-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-white hover:text-yellow-400 font-medium transition-colors duration-200 hover:bg-white/5 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Notifications */}
                  <button className="p-2 text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors duration-200 relative">
                    <FiBell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
                  </button>

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="p-2 text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors duration-200 relative"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full cart-bounce border border-black">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 rounded-lg pl-3 pr-4 py-2 transition-colors duration-200"
                    >
                      <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FaUser className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {authUser?.fullName?.split(" ")[0] || "Guest"}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 text-yellow-400 transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 navbar-blur rounded-xl shadow-xl border border-yellow-400/20 fade-in">
                        <div className="p-4 border-b border-yellow-400/20">
                          <p className="font-medium text-white text-sm">
                            {authUser?.fullName || "Guest"}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {authUser?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          {[
                            // {
                            //   href: "/profile",
                            //   icon: FaUser,
                            //   label: "Profile",
                            // },
                            {
                              href: "/dashboard",
                              icon: FaTachometerAlt,
                              label: "Dashboard",
                            },
                            {
                              href: "/orders",
                              icon: FaClipboardList,
                              label: "My Orders",
                            },
                            {
                              href: "/help",
                              icon: FaQuestionCircle,
                              label: "Help Center",
                            },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors duration-200"
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                          >
                            <FaSignOutAlt className="w-4 h-4 mr-3" />
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
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="p-2 text-white hover:text-yellow-400 rounded-lg relative"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full cart-bounce">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors duration-200"
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
          className="fixed inset-0 bg-black/80 z-40 md:hidden fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[70vw] bg-black/95 navbar-blur shadow-xl z-50 transform transition-transform duration-300 md:hidden border-l border-yellow-400/20 slide-in-right ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* User Section */}
          {isLoggedIn && authUser ? (
            <div className="flex justify-between items-center p-4 border-b border-yellow-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">
                    {authUser?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {authUser?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // Welcome section for non-logged in users
            <div className="p-4 border-b border-yellow-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Welcome!</p>
                  <p className="text-xs text-gray-400">
                    Sign in to your account
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links - Different based on auth status */}
          <div className="flex-1 py-4">
            {getMobileMenuLinks().map(({ label, href, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-base font-medium transition-colors duration-200 ${
                  pathname === href
                    ? "bg-yellow-400/10 text-yellow-400 border-r-2 border-yellow-400"
                    : "text-white hover:bg-yellow-400/10 hover:text-yellow-400"
                }`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                </div>
                {badge && badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section - Always show auth buttons for non-logged in users */}
          <div className="p-4 border-t border-yellow-400/20">
            {!isLoggedIn ? (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm mb-2">
                    Join our community today
                  </p>
                </div>

                {/* Login Button */}
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
                >
                  <FiLogIn className="w-4 h-4 mr-3" />
                  <span>Login to Account</span>
                </Link>

                {/* Register Button */}
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200 shadow-sm"
                >
                  <FiUserPlus className="w-4 h-4 mr-3" />
                  <span>Create New Account</span>
                </Link>

                {/* Quick Info */}
                <div className="text-center pt-2">
                  <p className="text-gray-500 text-xs">
                    Get started in seconds
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-3 px-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed nav */}
      <div className="h-16"></div>
    </header>
  );
};

export default ClientNavLayout;
