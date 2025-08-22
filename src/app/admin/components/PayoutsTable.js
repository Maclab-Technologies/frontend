"use client"
import { FiDollarSign, FiUser, FiCalendar, FiCheckCircle, FiClock, FiEye, FiCheck } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function PayoutsTable() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])
  
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

  // Mobile card view
  if (isMobile) {
    return (
      <div className="p-4">
        {payouts.map((payout) => (
          <div key={payout.id} className="mb-4 p-4 bg-gray-700 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-yellow-500 font-medium text-sm truncate">{payout.id}</div>
                <div className="text-white font-medium flex items-center mt-1 truncate">
                  <FiUser className="mr-2 flex-shrink-0" /> {payout.vendor}
                </div>
              </div>
              <div className="text-right ml-2">
                {getStatusBadge(payout.status)}
                <div className="text-xs text-gray-400 mt-1">{payout.method}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-300">
                <FiDollarSign className="mr-2 flex-shrink-0" /> ₦{payout.amount.toLocaleString()}
              </div>
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-2 flex-shrink-0" /> {payout.date}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
              {payout.status === 'Pending' && (
                <button className="text-green-500 hover:text-green-400 text-sm flex items-center">
                  <FiCheck className="mr-1" /> Approve
                </button>
              )}
              <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                <FiEye className="mr-1" /> Details
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payout ID</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">Amount</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Method</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {payouts.map((payout) => (
            <tr key={payout.id} className="hover:bg-gray-750">
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">{payout.id}</td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiUser className="mr-2" /> {payout.vendor}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden md:table-cell">
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" /> ₦{payout.amount.toLocaleString()}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> {payout.date}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(payout.status)}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden lg:table-cell">
                {payout.method}
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  {payout.status === 'Pending' && (
                    <button className="text-green-500 hover:text-green-400">Approve</button>
                  )}
                  <button className="text-blue-500 hover:text-blue-400">Details</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}