"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AuthContext } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebaseconfig";
import ClientLayout from "../Layout/client-layout";
import VendorLayout from "../Layout/vendor-layout";



const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { isLoggedIn, authUser, setAuthUser, setIsLoggedIn } = useContext(AuthContext);

  const pathname = usePathname();

  const isClient = pathname.startsWith("/Client");
  const isVendor = pathname.startsWith("/Vendor");
  const isAdmin = pathname.startsWith("/Admin");

  const cartCount = cartItems.length;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      //awaitng for logout api
      await signOut(auth);
      setIsLoggedIn(false);
      setAuthUser(null);
      setIsMobileMenuOpen(false);
      setIsScrolled(null);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      router.push("/Auth/Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <>
      {isAdmin && <div> Admin Nav bar </div>}
      {
      isVendor && (
        <VendorLayout 
          isMobileMenuOpen
          setIsMobileMenuOpen
          handleLogout
        />
      )}

      <ClientLayout
        authUser={authUser}
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        cartCount={cartCount}
        pathname={pathname}
        Link={Link}
      />
    </>
  );
};

export default Navbar;
