"use client";

import { useContext } from "react";
import { usePathname, redirect } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "./_provider/useClientProvider";
import LoadingErrorHandler from "../_components/LoadingErrorHandler";


function isPublicRoute(pathname) {
  const publicPaths = [
    "/",
    "/about",
    "/catgories",
    "/products",
    "/cart",
    "/designer",
    "/features",
    "/login",
    "/register",
    "/forgot-password",
  ];
  return publicPaths.includes(pathname);
}

export default function middleware({ children }) {
  const pathname = usePathname();
  const {isLoading, isLoggedIn, role, authUser } = useContext(AuthContext);
  const validRoles = ["user", "client", "vendor", "admin"];

  if (isPublicRoute(pathname)) return <>{children}</>;

  if (isLoading) {
    return (
      <LoadingErrorHandler loading={isLoading} />
    );
  }

  if (!isLoggedIn || !authUser || !validRoles.includes(role)) {
    if (pathname !== "/login") {
      toast.error("Unauthorized access. Please log in.");
      redirect("/login");
    }
    return null;
  }

  return <>{children}</>;
}