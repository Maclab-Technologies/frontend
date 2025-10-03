"use client";

import { useContext } from "react";
import { AdminAuthContext } from "../../_provider/useAdminProvider";

export default function Banner() {
  const { authAdmin } = useContext(AdminAuthContext);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 md:p-6 mb-g p-4g p-46">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Welcome back, Admin {authAdmin?.id || "Guest Admin"}!
          </h2>
          <p className="text-sm text-white">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="text-xs font-medium px-3 py-2 bg-gray-400 text-white rounded-full">
            Last login:{" "}
            {new Date(authAdmin?.updatedAt).toLocaleString() || "now"}
          </span>
        </div>
      </div>
    </div>
  );
}
