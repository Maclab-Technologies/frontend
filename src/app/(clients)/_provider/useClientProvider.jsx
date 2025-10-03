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
export const AuthContext = createContext();

export function ClientAuthProvider({ children }) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const setVerifiedUser = useCallback((userData) => {
    setAuthUser(userData);
    setRole(userData?.role || null);
    setIsLoggedIn(!!userData);
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, []);

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    setAuthUser(null);
    setRole(null);
    setToken(null);
    const user = localStorage.removeItem("userToken");

      router.push("/login");
  }, [router]);

  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    const storedUserData = localStorage.getItem("userData");

    if (!token && storedUserData) {
      localStorage.removeItem("userData");
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await get("/auth/verify", { token });
      if (!response.success) {
        throw new Error(response.error || "Verification failed");
      }
      setVerifiedUser(response.data.data);
      setToken(token);
      localStorage.setItem("userToken", token);
      setIsLoading(false)
    } catch (error) {
      console.error("Verification error:", error);
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  }, [logoutUser, setVerifiedUser]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  useEffect(() => {
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
        token,
        setToken,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
