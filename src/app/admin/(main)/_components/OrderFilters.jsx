"use client";
import { get } from "@/app/_hooks/fetch-hook";
import { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";

export default function OrderFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date: "",
    vendor: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
          />
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Design Review">Design Review</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <FiFilter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all appearance-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <FiCalendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        {/* Vendor Filter */}
        <div className="relative">
          <select
            value={filters.vendor}
            onChange={(e) => handleFilterChange("vendor", e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all appearance-none"
          >
            <option value="">All Vendors</option>
            <option value="PrintHub Lagos">PrintHub Lagos</option>
            <option value="SignMaster">SignMaster</option>
            <option value="QuickPrint">QuickPrint</option>
            <option value="StickerPro">StickerPro</option>
          </select>
          <FiDollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>
    </div>
  );
}
