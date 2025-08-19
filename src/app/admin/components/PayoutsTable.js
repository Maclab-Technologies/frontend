import { FiDollarSign, FiUser, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'

export default function PayoutsTable() {
  // Sample payouts data
  const payouts = [
    { id: 'PYT-4001', vendor: 'PrintHub Lagos', amount: 1250000, date: '2023-06-15', status: 'Completed', method: 'Bank Transfer' },
    { id: 'PYT-4002', vendor: 'SignMaster', amount: 850000, date: '2023-06-14', status: 'Completed', method: 'Bank Transfer' },
    { id: 'PYT-4003', vendor: 'QuickPrint', amount: 320000, date: '2023-06-12', status: 'Pending', method: 'Paystack' },
    { id: 'PYT-4004', vendor: 'StickerPro', amount: 450000, date: '2023-06-10', status: 'Failed', method: 'Bank Transfer' },
    { id: 'PYT-4005', vendor: 'BannerKing', amount: 2100000, date: '2023-06-08', status: 'Processing', method: 'Flutterwave' }
  ]

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full inline-flex items-center"
    switch(status) {
      case 'Completed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FiCheckCircle className="mr-1" /> {status}</span>
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FiClock className="mr-1" /> {status}</span>
      case 'Processing':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>⏳ {status}</span>
      case 'Failed':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>✖ {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payout ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Method</th> */}
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th> */}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-500">
          {payouts.map((payout) => (
            <tr key={payout.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{payout.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 flex items-center">
                <FiUser className="mr-2 text-gray-500" /> {payout.vendor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                <FiDollarSign className="mr-1 text-gray-500" /> ₦{payout.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 flex items-center">
                <FiCalendar className="mr-1" /> {payout.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(payout.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{payout.method}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {payout.status === 'Pending' && (
                  <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                )}
                <button className="text-blue-600 hover:text-blue-900">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}