"use client";

import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "../(clients)/_provider/useClientProvider";
import Loading from "../_components/loading";
import { VendorAuthContext } from "../vendor/_provider/useVendorProvider";
import { AdminAuthContext } from "../admin/(main)/_provider/useAdminProvider";


// ✅ Utility to skip auth checks for public routes
function isPublicRoute(pathname) {
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/vendor/login",
    "/vendor/register",
    "/vendor/forgot-password",
    "/admin/login",
  ];
  return publicPaths.includes(pathname);
}

// ---------------- CLIENT ----------------
export function ClientAuthMiddleware({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const {isLoading, isLoggedIn, role, authUser } = useContext(AuthContext);
  const validRoles = ["user", "client", "vendor", "admin"];

  if (isPublicRoute(pathname)) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn || !authUser || !validRoles.includes(role)) {
    if (pathname !== "/login") {
      toast.error("Unauthorized access. Please log in.");
      router.push("/login");
    }
    return null;
  }

  return <>{children}</>;
}

// ---------------- VENDOR ----------------
export function VendorAuthMiddleware({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const {isLoading, isLoggedIn, role, authVendor } = useContext(VendorAuthContext);
  const validRoles = ["vendor", "admin"];

  if (isPublicRoute(pathname)) return <>{children}</>;


  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn || !authVendor || !validRoles.includes(role)) {
    if (pathname !== "/vendor/login") {
      toast.error("Unauthorized access. Please log in.");
      router.push("/vendor/login");
    }
    return null;
  }

  return <>{children}</>;
}

// ---------------- ADMIN ----------------
export function AdminAuthMiddleware({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isLoggedIn, role, authAdmin } = useContext(AdminAuthContext);
  const validRoles = ["admin"];

  if (isPublicRoute(pathname)) return <>{children}</>;

  if (isLoading) {
    return (
       <div className="w-screen h-screen bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn || !authAdmin || !validRoles.includes(role)) {
    if (pathname !== "/admin/login") {
      toast.error("Unauthorized access. Please log in.");
      router.push("/admin/login");
    }
    return null;
  }

  return <>{children}</>;
}
