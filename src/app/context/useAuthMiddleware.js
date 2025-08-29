"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "./useAuth";
import Loading from "../components/loading";

function useAuthHelper() {
  const { role, isLoggedIn, isLoading, authUser } = useContext(AuthContext);
  const router = useRouter();
  return { ...useContext(AuthContext), router};
}

export function ClientAuth() {
  const { router, isLoading, isLoggedIn, role, authUser } = useAuthHelper();
  const validRoles = ["user", "client", "vendor", "admin"];

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }
  if (!isLoggedIn || !authUser || !validRoles.includes(role)) {
    toast.error("Unauthorized access. Please log in.");
    router.push("/auth/login");
    return null;
  }

  return authUser; // return user if valid
}

export function VendorAuth() {
  const { router, isLoading, isLoggedIn, role, authUser } = useAuthHelper();
  const validRoles = ["vendor", "admin"];

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }
  if (!isLoggedIn || !authUser || !validRoles.includes(role)) {
    toast.error("Unauthorized access. Please log in.");
    router.push("/auth/login");
    return null;
  }

  return authUser;
}

export function AdminAuth() {
  const { router, isLoading, isLoggedIn, role, authUser } = useAuthHelper();
  const validRoles = ["admin"];

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-800 flex justify-center p-4">
        <Loading />
      </div>
    );
  }
  if (!isLoggedIn || !authUser || !validRoles.includes(role)) {
    toast.error("Unauthorized access. Please log in.");
    router.push("/admin/login");
    return null;
  }

  return authUser;
}