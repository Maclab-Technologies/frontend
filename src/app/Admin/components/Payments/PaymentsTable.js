import { FiDollarSign, FiUser, FiCalendar, FiCreditCard } from 'react-icons/fi'

export default function PaymentsTable() {
  // Sample payments data
  const payments = [
    { id: 'PMT-5001', customer: 'John Doe', amount: 45000, date: '2023-06-15', method: 'Card', status: 'Successful', orderId: 'ORD-1248' },
    { id: 'PMT-5002', customer: 'Sarah Smith', amount: 125000, date: '2023-06-14', method: 'Transfer', status: 'Successful', orderId: 'ORD-1247' },
    { id: 'PMT-5003', customer: 'Mike Johnson', amount: 65000, date: '2023-06-13', method: 'Card', status: 'Successful', orderId: 'ORD-1246' },
    { id: 'PMT-5004', customer: 'Emma Wilson', amount: 32000, date: '2023-06-12', method: 'Paystack', status: 'Failed', orderId: 'ORD-1245' },
    { id: 'PMT-5005', customer: 'David Brown', amount: 89000, date: '2023-06-11', method: 'Transfer', status: 'Refunded', orderId: 'ORD-1244' }
  ]

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full"
    switch(status) {
      case 'Successful':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>✓ {status}</span>
      case 'Failed':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>✖ {status}</span>
      case 'Refunded':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>↩ {status}</span>
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>⏳ {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{payment.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                <FiUser className="mr-2 text-gray-500" /> {payment.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                <FiDollarSign className="mr-1 text-gray-500" /> ₦{payment.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{payment.orderId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                <FiCalendar className="mr-1" /> {payment.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                <FiCreditCard className="mr-1" /> {payment.method}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(payment.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}