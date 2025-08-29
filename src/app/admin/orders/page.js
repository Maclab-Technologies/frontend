import { AdminAuth } from "@/app/context/useAuthMiddleware";
import OrdersTable from "../_components/OrdersTable";
import OrderFilters from "../_components/OrderFilters";

export const metadata = {
  title: 'Orders Management | Admin',
  description: 'Manage all orders from this admin panel',
};
export default function OrdersPage() {
  // AdminAuth()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
      </div>

      {/* Filters */}
      <OrderFilters />

      {/* Orders Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <OrdersTable />
      </div>
    </div>
  );
}
