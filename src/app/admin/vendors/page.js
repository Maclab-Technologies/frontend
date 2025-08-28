"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/context/useAuth";
import { AdminAuth } from "@/app/context/useAuthContext";
import VendorsTable from '../components/VendorsTable'

export default function VendorsPage() {
    const { role, isLoggedIn, authUser } = useContext(AuthContext);
  // setAdmin(authUser);
  AdminAuth(role, isLoggedIn, authUser);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors Management</h1>
      </div>
      
      {/* Vendors Table */}
      <div className="mt-6 bg-black rounded-lg shadow overflow-hidden">
        <VendorsTable />
      </div>
    </div>
  )
}