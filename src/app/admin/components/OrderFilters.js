import { FiSearch, FiFilter, FiCalendar } from 'react-icons/fi'

export default function OrderFilters() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="p-4 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-5 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-black" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="p-4 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            defaultValue=""
          >
            <option value="">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="design_review">Design Review</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="absolute inset-y-0 right-10 pl-3 flex items-center pointer-events-none">
            <FiFilter className="text-gray-700" />
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            className="p-4 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            defaultValue=""
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <div className="absolute inset-y-0 right-10 pl-3 flex items-center pointer-events-none">
            <FiCalendar className="text-gray-700" />
          </div>
        </div>

        {/* Vendor Filter */}
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 text-black focus:ring-yellow-500 sm:text-sm"
          defaultValue=""
        >
          <option value="">All Vendors</option>
          <option value="printhub">PrintHub Lagos</option>
          <option value="signmaster">SignMaster</option>
          <option value="quickprint">QuickPrint</option>
          <option value="stickerpro">StickerPro</option>
        </select>
      </div>
    </div>
  )
}