'use client';

import { FaBoxOpen, FaClock, FaCheck, FaSearch } from 'react-icons/fa';

export default function OrderFilters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium flex items-center">
          <FaBoxOpen className="mr-2" /> All Orders
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
          <FaClock className="mr-2" /> Pending
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium flex items-center transition">
          <FaCheck className="mr-2" /> Completed
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search orders..."
          className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <FaSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}