"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
import { auth } from "../utils/firebaseconfig.js";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext({
  authUser: null,
  isLoggedIn: false,
  role: null,
  setIsLoggedIn: () => {},
  setAuthUser: () => {},
  setRole: () => {},
});

export default function AuthContextProvider({ children }) {
  // const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const token = typeof window !== "undefined" && localStorage.getItem("userToken");

  //   if (!token) {
  //     setIsLoggedIn(false);
  //     return;
  //   }

  //   const verify = async () => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log(res)

  //       const data = await res.json();

  //       if (!res.ok) {
  //         throw new Error(data.message || "Invalid token");
  //       }

  //       setRole(data.payload?.role);
  //       setAuthUser(data.payload);
  //       setIsLoggedIn(true);
  //     } catch (err) {
  //       console.error("Auth verification error:", err);
  //       localStorage.removeItem("userToken");
  //       setAuthUser(null);
  //       setRole(null);
  //       setIsLoggedIn(false);
  //       toast.error("Session expired. Please log in again.");
  //     }
  //   };

  //   verify();
  // }, [router]);
  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setIsLoggedIn(true);
      } else {
        setAuthUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
