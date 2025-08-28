"use client";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/useAuth";
import DesignsTable from "../components/DesignsTable";

export default function DesignsPage() {
  // AdminAuth();
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Designs Management</h1>
      </div>

      {/* Designs Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <DesignsTable />
      </div>
    </div>
  );
}
