"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../public/images/brandimage.jpeg";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Features", href: "/Features" },
  { label: "Orders", href: "/orders" },
  { label: "Track Orders", href: "/track-orders" },
];

const AuthButtons = ({ isMobile = false, closeMenu }) => (
  <div className={`flex ${isMobile ? "flex-col items-center space-y-4 mt-6 " : "space-x-4"}`}>
    <Link
      href="/Register"
      className={`bg-yellow-400 text-black px-4 py-2 rounded ${
        isMobile ? "w-3/4 text-center" : "hover:bg-yellow-300"
      }`}
      onClick={closeMenu}
    >
      Sign Up
    </Link>
    <Link
      href="/login"
      className={`border border-yellow-400 text-yellow-400 px-4 py-2 rounded ${
        isMobile ? "w-3/4 text-center" : "hover:border-yellow-300 hover:text-yellow-300"
      }`}
      onClick={closeMenu}
    >
      Login
    </Link>
  </div>
);

const NavbarLinks = ({ isMobile, closeMenu }) => (
  <ul className={`${isMobile ? "flex flex-col space-y-4 p-6" : "hidden md:flex space-x-6"}`}>
    {NAV_LINKS.map(({ label, href }) => (
      <li key={href}>
        <Link
          href={href}
          className="text-white hover:text-yellow-400 block py-2"
          onClick={closeMenu}
        >
          {label.toUpperCase()}
        </Link>
      </li>
    ))}
  </ul>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-black text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="59 Minutes Print Logo" width={50} height={50} className="h-12" />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Mobile Navigation */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-black shadow-md transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 md:hidden`}
        >
          <button className="absolute top-4 right-4 text-white" onClick={toggleMobileMenu}>
            <FiX size={32} />
          </button>
          <NavbarLinks isMobile closeMenu={closeMobileMenu} />
          <AuthButtons isMobile closeMenu={closeMobileMenu} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavbarLinks />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
