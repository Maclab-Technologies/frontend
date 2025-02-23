"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa"; // Icons for cart & user
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../utils/firebaseconfig"; // Import your Firebase config
import logo from "../../../public/images/brandimage.jpeg";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Features", href: "/Pages/Features" },
  { label: "Orders", href: "/orders" },
  { label: "Track Orders", href: "/track-orders" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Firebase Auth user state
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className="bg-black text-white py-4 border-b-4 border-yellow-400">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Brand Logo" width={50} height={50} className="h-12" />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-black shadow-md transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 md:hidden`}
        >
          <button className="absolute top-4 right-4 text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <FiX size={32} />
          </button>
          <ul className="flex flex-col space-y-4 p-6">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-white hover:text-yellow-400 block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {label.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
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
                <Link href="/cart" className="text-white text-lg hover:text-yellow-300">
                  <FaShoppingCart size={30} />
                </Link>
                <div className="relative group">
                  <FaUserCircle size={24} className="text-white cursor-pointer" />
                  <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-800">
                      Profile
                    </Link>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-800" onClick={handleLogout}>
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
            <Link key={href} href={href} className="text-white hover:text-yellow-400 block py-2">
              {label.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/Auth/Register" className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">
                Sign Up
              </Link>
              <Link href="/Auth/Login" className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:border-yellow-300 hover:text-yellow-300">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/cart" className="text-yellow-400 text-lg hover:text-yellow-300">
                <FaShoppingCart size={24} />
              </Link>
              <div className="relative group">
                <FaUserCircle size={24} className="text-yellow-400 cursor-pointer" />
                <div className="absolute right-0 mt-2 bg-black text-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-800">
                    Profile
                  </Link>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-800" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
