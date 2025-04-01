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
  { label: "Track Orders", href: "/track-orders" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const auth = getAuth(app);
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (error) {
        console.error("Error updating cart count:", error);
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleStorageChange = () => updateCartCount();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
      <nav className="fixed top-0 left-0 w-full bg-black text-white py-4 border-b-4 border-yellow-400 z-50">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Go to homepage">
            <Image
              src={logo}
              alt="Brand Logo"
              width={50}
              height={50}
              className="h-12"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle mobile menu"
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
          </button>

          {/* Mobile Navigation */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-black shadow-md z-20 transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="navigation"
            aria-hidden={!isMobileMenuOpen}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              <FiX size={32} />
            </button>
            <ul className="flex flex-col space-y-4 p-6">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-white hover:text-yellow-400 block py-2 ${
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
            <div className="flex flex-col items-center space-y-4 mt-6">
              {!user ? (
                <>
                  <Link
                    href="/Auth/Register"
                    className="bg-yellow-400 text-black px-4 py-2 rounded w-3/4 text-center hover:bg-yellow-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/Auth/Login"
                    className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded w-3/4 text-center hover:border-yellow-300 hover:text-yellow-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-4 w-full items-center">
                  <Link
                    href="/Clients/Cart"
                    className="relative text-yellow-400 text-lg hover:text-yellow-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaShoppingCart size={40} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative group">
                    <FaUserCircle size={40} className="text-yellow-400 cursor-pointer" />
                    <div className="absolute right-0 mt-2 bg-black text-white shadow-md rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/Clients/Dashboard"
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/Inbox"
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Inbox
                      </Link>
                      <Link
                        href="/Help"
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Help
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
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
                className={`text-white hover:text-yellow-400 block py-2 ${
                  pathname === href ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  href="/Auth/Register"
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
                >
                  Sign Up
                </Link>
                <Link
                  href="/Auth/Login"
                  className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:border-yellow-300 hover:text-yellow-300"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/Clients/Cart"
                  className="relative text-yellow-400 text-lg hover:text-yellow-300"
                >
                  <FaShoppingCart size={40} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <FaUserCircle size={40} className="text-yellow-400 cursor-pointer" />
                  <div className="absolute right-0 mt-2 bg-black text-white shadow-md rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/Clients/Dashboard"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/Inbox"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Inbox
                    </Link>
                    <Link
                      href="/Help"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Help
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Add a margin top to the main content to prevent it from being hidden behind the Navbar */}
      <div className="mt-16">
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Navbar;