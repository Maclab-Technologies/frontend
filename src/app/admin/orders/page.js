"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/app/context/useAuth";
import { AdminAuth } from "@/app/context/useAuthContext";
import OrdersTable from "../components/OrdersTable";
import OrderFilters from "../components/OrderFilters";

// Sample orders data
const sampleOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Business Cards",
    amount: 25000,
    status: "Processing",
    vendor: "PrintHub Lagos",
    date: "2023-10-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Banner Stand",
    amount: 45000,
    status: "Design Review",
    vendor: "SignMaster",
    date: "2023-10-16",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Stickers",
    amount: 15000,
    status: "Shipped",
    vendor: "StickerPro",
    date: "2023-10-14",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "Brochures",
    amount: 35000,
    status: "Delivered",
    vendor: "QuickPrint",
    date: "2023-10-10",
  },
];

export default function OrdersPage() {
  // AdminAuth()
  const [filterQueries, setFilterQueries] = useState(sampleOrders);
  const handleFilterChange = (filters) => {
    // Simple filter implementation
    let filtered = sampleOrders.filter((order) => {
      return (
        (filters.search === "" ||
          order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.product.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.id.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.status === "" || order.status === filters.status) &&
        (filters.vendor === "" || order.vendor === filters.vendor)
      );
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
      </div>

      {/* Filters */}
      <OrderFilters onFilterChange={handleFilterChange}/>

      {/* Orders Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <OrdersTable filterQueries={filterQueries} />
      </div>
    </div>
  );
}
