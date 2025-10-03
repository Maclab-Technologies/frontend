"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/navigation";
import { get } from "../../_hooks/fetch-hook";

// Create and export the context
export const VendorAuthContext = createContext();

export function VendorAuthProvider({ children }) {
  const router = useRouter();
  const [authVendor, setAuthVendor] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorToken, setVendorToken] = useState(null);

  const setVerifiedUser = useCallback((vendorData) => {
    setAuthVendor(vendorData);
    setRole(vendorData?.role || null);
    setIsLoggedIn(!!vendorData);
    if (vendorData) {
      localStorage.setItem("vendorData", JSON.stringify(vendorData));
    }
  }, []);

  const logoutVendor = useCallback(() => {
    setIsLoggedIn(false);
    setAuthVendor(null);
    setRole(null);
    setVendorToken(null);
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");

      router.push("/vendor/login");
  }, [router]);

  const verifyVendor = useCallback(async () => {
    const token = localStorage.getItem("vendorToken");
    const storedVendorData = localStorage.getItem("vendorData");

    if (!token && storedVendorData) {
      localStorage.removeItem("vendorData");
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await get("/auth/verify", { token: token });
      if (!response.success) {
        throw new Error(response.error || "Verification failed");
      }
      setVerifiedUser(response.data.data);
      setVendorToken(token);
      localStorage.setItem("vendorToken", token);
    } catch (error) {
      console.error("Verification error:", error);
      logoutVendor();
    } finally {
      setIsLoading(false);
    }
  }, [logoutVendor, setVerifiedUser]);

  useEffect(() => {
    verifyVendor();
  }, [verifyVendor]);

  useEffect(() => {
    const interval = setInterval(verifyVendor, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyVendor]);

  return (
    <VendorAuthContext.Provider
      value={{
        authVendor,
        isLoggedIn,
        role,
        isLoading,
        vendorToken,
        setVendorToken,
        setIsLoggedIn,
        setAuthVendor: setVerifiedUser,
        setRole,
        logoutVendor,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
