"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../utils/firebaseconfig";
import logo from "../../../public/images/brandimage.jpeg";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/Products" },
  { label: "Categories", href: "/Pages/Categories" },
  { label: "Features", href: "/Pages/Features" },
  { label: "Become a Vendor", href: "/Vendor" },
  { label: "About US", href: "/Pages/About" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const pathname = usePathname();
  const auth = getAuth(app);

  // Cart count state
  const [cartCount, setCartCount] = useState(0);

  // User authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Effect to update cart count whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-black to-gray-900 text-white py-3 border-b-2 border-yellow-500 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Go to homepage">
            <div className="relative overflow-hidden rounded-full border-2 border-yellow-400">
              <Image
                src={logo}
                alt="59Minutes Prints"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-xl hidden sm:block text-yellow-400">59Minutes Prints</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle mobile menu"
            className="md:hidden text-yellow-400 focus:outline-none hover:text-yellow-300 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>

          {/* Mobile Navigation */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-xl z-20 transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="navigation"
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-yellow-400 font-bold text-xl">Menu</span>
              <button
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <ul className="flex flex-col p-4">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href} className="border-b border-gray-800 last:border-0">
                  <Link
                    href={href}
                    className={`text-white hover:text-yellow-400 block py-3 transition-colors ${
                      pathname === href ? "text-yellow-400 font-bold" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Authentication Section */}
            <div className="flex flex-col items-center space-y-4 mt-6 px-4">
              {!user ? (
                <>
                  <Link
                    href="/Auth/Register"
                    className="bg-yellow-500 text-black font-medium px-4 py-2 rounded-md w-full text-center hover:bg-yellow-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SIGN UP
                  </Link>
                  <Link
                    href="/Auth/Login"
                    className="border-2 border-yellow-500 text-yellow-500 font-medium px-4 py-2 rounded-md w-full text-center hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-4 w-full items-center">
                  <Link
                    href="/Clients/Cart"
                    className="relative flex items-center justify-center w-full text-white bg-gray-800 hover:bg-gray-700 py-3 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaShoppingCart size={20} className="text-yellow-400 mr-2" />
                    <span>Your Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <div className="w-full space-y-2">
                    <p className="text-gray-400 text-sm font-medium px-2">ACCOUNT</p>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/Clients/Dashboard"
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/Inbox"
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Inbox
                    </Link>
                    <Link
                      href="/Help"
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Help
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition-colors"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-grow space-x-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-white hover:text-yellow-400 relative font-medium transition-colors ${
                  pathname === href ? "text-yellow-400" : ""
                }`}
              >
                {label.toUpperCase()}
                {pathname === href && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-400"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  href="/Auth/Login"
                  className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/Auth/Register"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
                >
                  SIGN UP
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/Clients/Cart"
                  className="relative text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <FaShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <FaUserCircle size={24} className="text-yellow-400" />
                    <span className="text-sm text-white">Account</span>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 text-white shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2 border-b border-gray-700 px-4">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium truncate">
                        {user?.email || "User"}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/Clients/Dashboard"
                      className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/Inbox"
                      className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      Inbox
                    </Link>
                    <Link
                      href="/Help"
                      className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      Help
                    </Link>
                    <div className="border-t border-gray-700">
                      <button
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      
    </>
  );
};

export default Navbar;