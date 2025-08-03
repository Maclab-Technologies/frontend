'use client';

import React, { useEffect, useState, useCallback, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { get } from "./fetch-hook";

// Create and export the context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // ... rest of your AuthProvider implementation ...
  
  return (
    <AuthContext.Provider value={{
      authUser,
      isLoggedIn,
      role,
      isLoading,
      token,
      setToken,
      setIsLoggedIn,
      setAuthUser,
      setRole,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}