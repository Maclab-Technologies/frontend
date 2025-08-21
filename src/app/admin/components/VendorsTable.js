import { FiTruck, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiEdit2 } from 'react-icons/fi'

export default function VendorsTable() {
  // Sample vendors data
  const vendors = [
    { id: 'VDR-2001', name: 'PrintHub Lagos', email: 'contact@printhublagos.com', phone: '08011223344', location: 'Lagos', joined: '2023-01-15', status: 'Approved', balance: 1250000 },
    { id: 'VDR-2002', name: 'SignMaster', email: 'info@signmaster.com', phone: '08022334455', location: 'Abuja', joined: '2023-02-20', status: 'Approved', balance: 850000 },
    { id: 'VDR-2003', name: 'QuickPrint', email: 'support@quickprint.com', phone: '08033445566', location: 'Port Harcourt', joined: '2023-03-05', status: 'Pending', balance: 0 },
    { id: 'VDR-2004', name: 'StickerPro', email: 'hello@stickerpro.com', phone: '08044556677', location: 'Lagos', joined: '2023-04-12', status: 'Suspended', balance: 320000 },
    { id: 'VDR-2005', name: 'BannerKing', email: 'sales@bannerking.com', phone: '08055667788', location: 'Ibadan', joined: '2023-05-18', status: 'Approved', balance: 2100000 }
  ]

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full inline-flex items-center"
    switch(status) {
      case 'Approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FiCheckCircle className="mr-1" /> {status}</span>
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>⏳ {status}</span>
      case 'Suspended':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><FiXCircle className="mr-1" /> {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Balance</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-500 text-white">
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{vendor.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white flex items-center">
                <FiTruck className="mr-2 text-gray-200" /> {vendor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                <div className="flex items-center"><FiMail className="mr-1" /> {vendor.email}</div>
                <div className="flex items-center mt-1"><FiPhone className="mr-1" /> {vendor.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{vendor.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(vendor.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₦{vendor.balance.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-yellow-600 hover:text-yellow-900">
                  <FiEdit2 className="inline mr-1" /> Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}