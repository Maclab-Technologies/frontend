"use client";

import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const AuthContext = React.createContext({
  authUser: null,
  isLoggedIn: false,
  role: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  setRole: () => {},
});

export default function AuthContextProvider({children}) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState({});
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = localStorage.getItem("userToken");
  if (!token) {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Token invalid or expired");
        }

        const data = await res.json();
        setRole(data.payload?.role);
        setAuthUser(data.payload);
        setIsLoggedIn(true);

        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(resData.message || "Failed to verify user.");
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
        setIsLoggedIn(false);
        toast.error("Session expired. Please log in again.");
      }
    };

    verify();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoggedIn,
        role,
        setAuthUser,
        setIsLoggedIn,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
