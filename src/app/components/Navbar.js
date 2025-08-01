"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AuthContext } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebaseconfig";
import VendorNavLayout from "../Layout/vendor-layout";
import ClientNavLayout from "../Layout/client-layout";
import AdminNavLayout from "../Layout/admin-layout";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { isLoggedIn, authUser, setAuthUser, setIsLoggedIn, logoutUser } =
    useContext(AuthContext);

  const pathname = usePathname();

  const isVendor = pathname.startsWith("/Vendor");
  const isAdmin = pathname.startsWith("/Admin");
  const isAuth = pathname.startsWith("/Auth");

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

  // const handleLogout = async () => {
  //   try {
  //     //awaitng for logout api
  //     await signOut(auth);
  //     setIsLoggedIn(false);
  //     setAuthUser(null);
  //     setIsMobileMenuOpen(false);
  //     setIsScrolled(null);
  //     localStorage.removeItem("userToken");
  //     localStorage.removeItem("userData");
  //     localStorage.removeItem("vendor_token");
  //     localStorage.removeItem("vendor_data");
  //     localStorage.removeItem("admin_token");
  //     localStorage.removeItem("admin_data");
  //     router.push("/Auth/Login");
  //   } catch (error) {
  //     console.error("Logout Error:", error.message);
  //   }
  // };

  if (isAdmin) {
    return (
      <AdminNavLayout
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={logoutUser}
        authUser={authUser}
      />
    );
  }
  if (isVendor) {
    return (
      <VendorNavLayout
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={logoutUser}
      />
    );
  }
  if (isAuth) {
    return null
  }
  return (
    <ClientNavLayout
      authUser={authUser}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      isLoggedIn={isLoggedIn}
      handleLogout={logoutUser}
      cartCount={cartCount}
      pathname={pathname}
      Link={Link}
    /> 
  );
};

export default Navbar;
