"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/navigation";
import { get } from "../../../_hooks/fetch-hook";

// Create and export the context
export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const [authAdmin, setAuthAdmin] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);

  const setVerifiedAdmin = useCallback((adminData) => {
    setAuthAdmin(adminData);
    setRole(adminData?.role || null);
    setIsLoggedIn(!!adminData);
    if (adminData) {
      localStorage.setItem("adminData", JSON.stringify(adminData));
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsLoggedIn(false);
    setAdminData(null);
    setRole(null);
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  }, [router]);

  const verifyAdmin = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    const storedAdminData = localStorage.getItem("adminData");

    if (!token && storedAdminData) {
      localStorage.removeItem("adminData");
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAdminToken(token)
    try {
      const response = await get("/auth/verify", { token: token });
      if (!response.success) {
        throw new Error(response.error || "Verification failed");
      }
      setVerifiedAdmin(response.data.data);
      localStorage.setItem("adminToken", token);
    } catch (error) {
      console.error("Verification error:", error);
      logoutAdmin();
    } finally {
      setIsLoading(false);
    }
  }, [logoutAdmin, setVerifiedAdmin]);

  useEffect(() => {
    verifyAdmin();
  }, [verifyAdmin]);

  useEffect(() => {
    const interval = setInterval(verifyAdmin, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyAdmin]);
  return (
    <AdminAuthContext.Provider
      value={{
        authAdmin,
        isLoggedIn,
        role,
        adminToken,
        isLoading,
        setIsLoading,
        setAdminToken,
        setIsLoggedIn,
        setAuthAdmin: setVerifiedAdmin,
        setRole,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth
() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
