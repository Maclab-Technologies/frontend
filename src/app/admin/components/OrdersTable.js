import { FiEdit, FiTruck, FiPrinter, FiDollarSign, FiCheckCircle } from 'react-icons/fi'

export default function OrdersTable() {
  // Sample orders data
  const orders = [
    { id: 'ORD-1248', customer: 'John Doe', product: 'Business Cards', amount: 45000, status: 'Processing', vendor: 'PrintHub Lagos', date: '2023-06-15' },
    { id: 'ORD-1247', customer: 'Sarah Smith', product: 'Banner Stand', amount: 125000, status: 'Design Review', vendor: 'SignMaster', date: '2023-06-14' },
    { id: 'ORD-1246', customer: 'Mike Johnson', product: 'Flyers (500)', amount: 65000, status: 'Shipped', vendor: 'QuickPrint', date: '2023-06-13' },
    { id: 'ORD-1245', customer: 'Emma Wilson', product: 'Stickers', amount: 32000, status: 'Delivered', vendor: 'StickerPro', date: '2023-06-12' },
    { id: 'ORD-1244', customer: 'David Brown', product: 'Brochures', amount: 89000, status: 'Processing', vendor: 'PrintHub Lagos', date: '2023-06-11' }
  ]

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full"
    switch(status) {
      case 'Processing':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><FiPrinter className="inline mr-1" /> {status}</span>
      case 'Design Review':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}><FiEdit className="inline mr-1" /> {status}</span>
      case 'Shipped':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FiTruck className="inline mr-1" /> {status}</span>
      case 'Delivered':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FiCheckCircle className="inline mr-1" /> {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.product}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₦{order.amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-yellow-600 hover:text-yellow-900 mr-3">View</button>
                <button className="text-blue-600 hover:text-blue-900">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}