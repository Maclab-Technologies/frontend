"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { get } from "./fetch-hook";

export const AuthContext = React.createContext({
  authUser: null,
  isLoggedIn: false,
  role: null,
  isLoading: true,
  token: null,
  setToken: () => {},
  setIsLoggedIn: () => {},
  setAuthUser: () => {},
  setRole: () => {},
  logoutUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setVerifiedUser = useCallback((userData) => {
    setAuthUser(userData);
    setRole(userData?.role || null);
    setIsLoggedIn(!!userData);
    // Store user data in localStorage
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, []);

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    setAuthUser(null);
    setRole(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("vendor_data");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    router.push("/Auth/Login");
  }, [router]);

  const verifyUser = useCallback(async () => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    // If no token but has stored user data, clear it
    if (!token && storedUserData) {
      localStorage.removeItem("userData");
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await get("/auth/verify", {
        token,
      });

      if (!response.success) {
        throw new Error(response.error || "Verification failed");
      }

      setVerifiedUser(response.data.data);
      setToken(token);
      localStorage.setItem('userToken', token)
    } catch (error) {
      console.error("Verification error:", error);
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  }, [logoutUser, setVerifiedUser]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("userToken");

    if (storedUserData && token) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setAuthUser(parsedData);
        setRole(parsedData?.role || null);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        localStorage.removeItem("userData");
      }
    }

    verifyUser();
  }, [verifyUser]);

  // Set up periodic verification
  useEffect(() => {
    const interval = setInterval(verifyUser, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [verifyUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoggedIn,
        role,
        isLoading,
        setIsLoggedIn,
        setAuthUser: setVerifiedUser,
        setRole,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
