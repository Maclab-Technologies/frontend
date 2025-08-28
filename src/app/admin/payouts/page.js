"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/context/useAuth";
import { AdminAuth } from "@/app/context/useAuthContext";
import PayoutsTable from "../components/PayoutsTable";
import PayoutSummary from "../components/PayoutSummary";

export default function PayoutsPage() {
    // AdminAuth()
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payouts Management</h1>
      </div>

      {/* Payout Summary */}
      <PayoutSummary />

      {/* Payouts Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <PayoutsTable />
      </div>
    </div>
  );
}
