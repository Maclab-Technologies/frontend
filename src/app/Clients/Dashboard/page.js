"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/Auth/Login"); 
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/Auth/Login"); 
  };

  return user ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.displayName || user.email}!</h1>
      <p className="text-gray-600">You are now in the protected dashboard.</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </div>
  ) : (
    <p className="text-center text-gray-600">Loading...</p>
  );
};

export default Dashboard;
