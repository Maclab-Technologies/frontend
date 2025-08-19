import { FiImage, FiUser, FiCalendar, FiCheck, FiX, FiEdit } from 'react-icons/fi'

export default function DesignsTable() {
  // Sample designs data
  const designs = [
    { id: 'DSN-3001', name: 'Business Card V1', customer: 'John Doe', uploaded: '2023-06-10', status: 'Approved', revisions: 0 },
    { id: 'DSN-3002', name: 'Company Flyer', customer: 'Sarah Smith', uploaded: '2023-06-12', status: 'Pending', revisions: 1 },
    { id: 'DSN-3003', name: 'Product Label', customer: 'Mike Johnson', uploaded: '2023-06-08', status: 'Revision', revisions: 2 },
    { id: 'DSN-3004', name: 'Event Banner', customer: 'Emma Wilson', uploaded: '2023-06-15', status: 'Rejected', revisions: 1 },
    { id: 'DSN-3005', name: 'Menu Design', customer: 'David Brown', uploaded: '2023-06-14', status: 'Approved', revisions: 0 }
  ]

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full inline-flex items-center"
    switch(status) {
      case 'Approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FiCheck className="mr-1" /> {status}</span>
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>⏳ {status}</span>
      case 'Revision':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><FiEdit className="mr-1" /> {status}</span>
      case 'Rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><FiX className="mr-1" /> {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Design ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Design</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Uploaded</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Revisions</th> */}
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th> */}
          </tr>
        </thead>
        <tbody className="bg-gray700 divide-y divide-gray-500">
          {designs.map((design) => (
            <tr key={design.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{design.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 flex items-center">
                <FiImage className="mr-2 text-gray-100" /> {design.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 flex items-center">
                <FiUser className="mr-1" /> {design.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 flex items-center">
                <FiCalendar className="mr-1" /> {design.uploaded}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(design.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{design.revisions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-yellow-600 hover:text-yellow-900 mr-3">Preview</button>
                <button className="text-blue-600 hover:text-blue-900">Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}