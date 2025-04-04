"use client";
import React, { useState } from "react";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";

const OrdersContent = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  // Sample order data
  const orders = [
    { 
      id: "ORD-7890", 
      customer: "Jane Cooper", 
      email: "jane@example.com",
      type: "Business Cards", 
      status: "Completed", 
      date: "2025-04-01", 
      amount: 125.00 
    },
    { 
      id: "ORD-7891", 
      customer: "Michael Johnson", 
      email: "michael@example.com",
      type: "Posters (24x36)", 
      status: "Printing", 
      date: "2025-04-02", 
      amount: 89.50 
    },
    { 
      id: "ORD-7892", 
      customer: "Sarah Williams", 
      email: "sarah@example.com",
      type: "Brochures", 
      status: "Processing", 
      date: "2025-04-03", 
      amount: 210.75 
    },
    { 
      id: "ORD-7893", 
      customer: "Robert Brown", 
      email: "robert@example.com",
      type: "Flyers", 
      status: "Pending", 
      date: "2025-04-03", 
      amount: 75.20 
    },
    { 
      id: "ORD-7894", 
      customer: "Emily Davis", 
      email: "emily@example.com",
      type: "Banners", 
      status: "Shipped", 
      date: "2025-04-02", 
      amount: 145.80 
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Printing":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Orders header with actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Manage Orders</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter panel (collapsible) */}
      {filterOpen && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-medium mb-4">Filter Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="printing">Printing</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Types</option>
                <option value="business-cards">Business Cards</option>
                <option value="flyers">Flyers</option>
                <option value="brochures">Brochures</option>
                <option value="posters">Posters</option>
                <option value="banners">Banners</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">22</span> orders
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-50 border border-blue-500 rounded-md text-sm text-blue-600">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersContent;