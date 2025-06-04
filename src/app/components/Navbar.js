"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle, FaHome, FaBoxOpen, FaListAlt, FaStar, FaStore, FaInfoCircle, FaBell } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../utils/firebaseconfig";
import logo from "../../../public/images/brandimage.jpeg";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: <FaHome className="mr-2" /> },
  { label: "Products", href: "/Products", icon: <FaBoxOpen className="mr-2" /> },
  { label: "Categories", href: "/Pages/Categories", icon: <FaListAlt className="mr-2" /> },
  { label: "Features", href: "/Pages/Features", icon: <FaStar className="mr-2" /> },
  { label: "Become a Vendor", href: "/Vendor", icon: <FaStore className="mr-2" /> },
  { label: "About Us", href: "/Pages/About", icon: <FaInfoCircle className="mr-2" /> },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const pathname = usePathname();
  const auth = getAuth(app);

  // Cart count state with improved calculation
  const [cartCount, setCartCount] = useState(0);

  // Effect to handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // User authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Effect to update cart count whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    setCartCount(count);
    
    if (count > 0) {
      const cartIcons = document.querySelectorAll('.cart-icon');
      cartIcons.forEach(icon => {
        if (icon) {
          icon.classList.add('cart-pulse');
          setTimeout(() => {
            if (icon) icon.classList.remove('cart-pulse');
          }, 1000);
        }
      });
    }
  }, [cartItems]);

  // Effect to detect scrolling for navbar style change with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInScale {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .navbar-gradient {
          background: linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #333333);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
        
        .navbar-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.85);
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .logo-glow {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .logo-glow:hover {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          transform: scale(1.05);
        }
        
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .nav-link:hover::before {
          left: 100%;
        }
        
        .cart-pulse {
          animation: cartPulse 0.6s ease-in-out;
        }
        
        @keyframes cartPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        .mobile-menu-slide {
          animation: slideInFromTop 0.3s ease-out;
        }
        
        .user-menu-fade {
          animation: fadeInScale 0.2s ease-out;
        }
        
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        .btn-glow {
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .btn-glow:hover {
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
        }
        
        .search-expand {
          transition: width 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .mobile-backdrop {
            backdrop-filter: blur(10px);
          }
        }
        
        .notification-dot {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "navbar-glass shadow-2xl" 
            : "navbar-gradient border-b border-yellow-400/30"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="Go to homepage">
            <div className="relative logo-glow rounded-full border-2 border-yellow-400 p-1">
              <Image
                src={logo}
                alt="59Minutes Prints"
                width={45}
                height={45}
                className="object-cover rounded-full transition-all duration-300 group-hover:rotate-12"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-yellow-400 transition-all duration-300 group-hover:text-white">
                59Minutes
              </span>
              <span className="font-light text-lg text-gray-300 ml-1">Prints</span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-grow">
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/20">
              {NAV_LINKS.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    pathname === href 
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shimmer-effect" 
                      : "text-white hover:bg-white/10 hover:text-yellow-400"
                  }`}
                >
                  <span className="mr-2 transition-transform duration-300 group-hover:scale-110">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Enhanced Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-full bg-gray-800/50 text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 transition-all duration-300"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
              {showSearch && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 user-menu-fade">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {!user ? (
              <>
                <Link
                  href="/Auth/Login"
                  className="text-white border border-yellow-400/60 px-6 py-2.5 rounded-full font-medium hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300 hover:shadow-lg"
                >
                  Login
                </Link>
                <Link
                  href="/Auth/Register"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2.5 rounded-full font-medium btn-glow hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Notifications */}
                <button className="relative p-2.5 rounded-full bg-gray-800/50 text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 transition-all duration-300">
                  <FaBell size={18} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full notification-dot"></span>
                </button>

                {/* Enhanced Cart */}
                <Link
                  href="/Clients/Cart"
                  className="relative p-2.5 rounded-full bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
                  aria-label="View cart"
                >
                  <FaShoppingCart size={18} className="cart-icon" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Enhanced User Menu */}
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full pl-2 pr-4 py-2 transition-all duration-300 border border-transparent hover:border-yellow-400/30"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-black shadow-lg">
                      <FaUserCircle size={20} />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {user?.displayName?.split(' ')[0] || "Account"}
                    </span>
                  </button>
                  <div 
                    className="absolute right-0 mt-3 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right user-menu-fade"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-4 border-b border-gray-700 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-black">
                          <FaUserCircle size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user?.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {[
                        { href: "/profile", icon: FaUserCircle, label: "Profile" },
                        { href: "/Clients/Dashboard", icon: FaBoxOpen, label: "Dashboard" },
                        { href: "/Inbox", icon: FaListAlt, label: "Inbox" },
                        { href: "/Help", icon: FaInfoCircle, label: "Help" }
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center px-5 py-3 hover:bg-gray-800/50 transition-all duration-200 hover:translate-x-1"
                          role="menuitem"
                        >
                          <Icon className="mr-3 text-yellow-400" size={16} />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-700 py-2">
                      <button
                        className="flex items-center w-full text-left px-5 py-3 text-red-400 hover:bg-gray-800/50 transition-all duration-200 hover:translate-x-1"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <FiX className="mr-3" size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Link
                href="/Clients/Cart"
                className="relative p-2 text-yellow-400 hover:scale-110 transition-transform duration-200"
                aria-label="View cart"
              >
                <FaShoppingCart size={20} className="cart-icon" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2.5 rounded-full bg-gray-800/50 text-yellow-400 focus:outline-none hover:bg-gray-700/50 transition-all duration-300 hover:rotate-90"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 mobile-backdrop z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Mobile Navigation Sidebar */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 transition-transform duration-500 ease-out overflow-y-auto md:hidden border-l border-yellow-400/20 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {isMobileMenuOpen && (
          <div className="mobile-menu-slide">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center">
                  <FiMenu className="text-black" size={16} />
                </div>
                <span className="text-yellow-400 font-bold text-xl">Menu</span>
              </div>
              <button
                className="p-2 rounded-full bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50 transition-all duration-300 hover:rotate-90"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* User Profile Section */}
              {user && (
                <div className="mb-8 pb-6 border-b border-gray-700/50">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-black shadow-lg">
                      <FaUserCircle size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-2 mb-4">Navigation</p>
                {NAV_LINKS.map(({ label, href, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center rounded-xl py-4 px-4 transition-all duration-300 ${
                      pathname === href
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold shadow-lg"
                        : "text-white hover:bg-gray-800/50 hover:translate-x-2"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <span className="mr-4 text-lg">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Authentication Section */}
              <div className="pt-6 border-t border-gray-700/50">
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-2 mb-4">Get Started</p>
                    <Link
                      href="/Auth/Login"
                      className="w-full py-4 border-2 border-yellow-400/60 text-yellow-400 rounded-xl text-center font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      href="/Auth/Register"
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-xl text-center font-semibold btn-glow hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-2 mb-4">Account</p>
                    {[
                      { href: "/profile", icon: FaUserCircle, label: "Profile" },
                      { href: "/Clients/Dashboard", icon: FaBoxOpen, label: "Dashboard" },
                      { href: "/Clients/Cart", icon: FaShoppingCart, label: "Cart", badge: cartCount },
                      { href: "/Inbox", icon: FaListAlt, label: "Inbox" },
                      { href: "/Help", icon: FaInfoCircle, label: "Help" }
                    ].map(({ href, icon: Icon, label, badge }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center justify-between rounded-xl py-4 px-4 text-white hover:bg-gray-800/50 transition-all duration-300 hover:translate-x-2"
                        onClick={closeMobileMenu}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-4 text-yellow-400 text-lg" />
                          <span className="font-medium">{label}</span>
                        </div>
                        {badge > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                            {badge > 99 ? '99+' : badge}
                          </span>
                        )}
                      </Link>
                    ))}
                    <button
                      className="flex items-center w-full text-left rounded-xl py-4 px-4 text-red-400 hover:bg-gray-800/50 transition-all duration-300 hover:translate-x-2 mt-4"
                      onClick={handleLogout}
                    >
                      <FiX className="mr-4 text-lg" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="pt-20"></div>
    </>
  );
};

export default Navbar;