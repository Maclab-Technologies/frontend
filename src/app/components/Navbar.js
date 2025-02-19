"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../public/images/brandimage.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="59 Minutes Print Logo"
            width={50}
            height={50}
            className="h-12"
          />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleMobileMenu}
          ></div>
        )}

        {/* Mobile Navigation Links */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-black shadow-md transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 md:hidden`}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={toggleMobileMenu}
          >
            <FiX size={32} />
          </button>
          <ul className="flex flex-col space-y-4 p-6">
            {["/", "/Products", "/Categories", "/Features", "/Orders", "/Track-orders"].map((href, index) => (
              <li key={index}>
                <Link
                  href={href}
                  className="text-white hover:text-yellow-400 block py-2"
                  onClick={toggleMobileMenu}
                >
                  {href.replace("/", "").toUpperCase() || "HOME"}
                </Link>
              </li>
            ))}

            {/* Mobile Buttons */}
            <div className="flex flex-col items-center space-y-4 mt-6">
              <Link
                href="/signup"
                className="bg-yellow-400 text-black px-4 py-2 rounded w-3/4 text-center"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded w-3/4 text-center"
              >
                Login
              </Link>
            </div>
          </ul>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          {["/", "/products", "/categories", "/features", "/orders", "/track-orders"].map((href, index) => (
            <li key={index}>
              <Link href={href} className="hover:text-yellow-400">
                {href.replace("/", "").toUpperCase() || "HOME"}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="/signup"
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:border-yellow-300 hover:text-yellow-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
