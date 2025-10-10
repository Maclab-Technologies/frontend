'use client';

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ClientNavLayout from "../_layout/client-layout";
import { useAuth } from "../(root)/_provider/useClientProvider";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  
  // Use the useAuth hook instead of useContext directly
  const { 
    isLoggedIn, 
    authUser, 
    setAuthUser, 
    setIsLoggedIn, 
    logoutUser 
  } = useAuth();

  // const pathname = usePathname();

  // const isVendor = pathname.startsWith("/Vendor");
  // const isAdmin = pathname.startsWith("/admin");
  // const isAuth = pathname.startsWith("/Auth");

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
    <ClientNavLayout
      authUser={authUser}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      isLoggedIn={isLoggedIn}
      handleLogout={logoutUser}
      cartCount={cartCount}
      Link={Link}
    /> 
  );
};

export default Navbar;