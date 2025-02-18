"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/brandimage.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
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
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row md:space-x-6 absolute md:relative top-14 md:top-0 left-0 w-full md:w-auto bg-black md:bg-transparent text-center z-20`}
        >
          <li>
            <Link href="/" className="hover:text-yellow-400 block py-2">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-yellow-400 block py-2">
              All Products
            </Link>
          </li>
          <li>
            <Link href="/categories" className="hover:text-yellow-400 block py-2">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/features" className="hover:text-yellow-400 block py-2">
              Features
            </Link>
          </li>
          <li>
            <Link href="/orders" className="hover:text-yellow-400 block py-2">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/track-orders" className="hover:text-yellow-400 block py-2">
              Track Orders
            </Link>
          </li>

          {/* Mobile Buttons */}
          <div className="md:hidden flex flex-col items-center space-y-2 mt-4">
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
