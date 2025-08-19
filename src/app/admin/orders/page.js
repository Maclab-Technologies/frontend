import OrdersTable from '../components/OrdersTable'
import OrderFilters from '../components/OrderFilters'

export default function OrdersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
      </div>
      
      {/* Filters */}
      <OrderFilters />
      
      {/* Orders Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <OrdersTable />
      </div>
    </div>
  )
}