"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = React.createContext({
  authUser: null,
  isLoggedIn: false,
  role: null,
  isLoading: true,
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
  }, []);

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    setVerifiedUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("tempAuthData");
  }, [setVerifiedUser]);

  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      logoutUser();
      setIsLoading(false);
      // router.push("/Auth/Login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json()

      // const data = await res.json();
      setIsLoggedIn(true);
      setAuthUser(data.data);
    } catch (error) {
      console.error("Verification error:", error);
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  }, [logoutUser, setVerifiedUser]);

  useEffect(() => {
    // Initial verification
    verifyUser();

    // Set up periodic verification (every 5 minutes)
    const interval = setInterval(verifyUser, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoggedIn,
        role,
        isLoading,
        setAuthUser,
        setIsLoggedIn,
        setRole,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
