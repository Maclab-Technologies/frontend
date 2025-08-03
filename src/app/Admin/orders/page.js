'use client';

import { useAdmin } from '../context/AdminContext';
import OrdersTable from '../components/Orders/OrdersTable';
import OrderFilters from '../components/Orders/OrderFilters';

export default function OrdersPage() {
  const { orders } = useAdmin();

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <OrderFilters />
      <OrdersTable orders={orders} />
    </div>
  );
}