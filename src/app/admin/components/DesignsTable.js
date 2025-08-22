// components/DesignsTable.js
"use client";
import { FiImage, FiUser, FiCalendar, FiCheck, FiX, FiEdit, FiEye, FiClipboard } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function DesignsTable() {
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

  // Mobile card view
  if (isMobile) {
    return (
      <div className="p-4">
        {designs.map((design) => (
          <div key={design.id} className="mb-4 p-4 bg-gray-700 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-yellow-500 font-medium text-sm">{design.id}</div>
                <div className="text-white font-medium flex items-center mt-1">
                  <FiImage className="mr-2" /> {design.name}
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(design.status)}
                <div className="text-xs text-gray-400 mt-1">Revisions: {design.revisions}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-300">
                <FiUser className="mr-2" /> {design.customer}
              </div>
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-2" /> {design.uploaded}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
              <button className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center">
                <FiEye className="mr-1" /> Preview
              </button>
              <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                <FiClipboard className="mr-1" /> Review
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
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Design ID</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Design</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">Customer</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Uploaded</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden xl:table-cell">Revisions</th>
            <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {designs.map((design) => (
            <tr key={design.id} className="hover:bg-gray-750">
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">{design.id}</td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiImage className="mr-2" /> {design.name}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden md:table-cell">
                <div className="flex items-center">
                  <FiUser className="mr-1" /> {design.customer}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden lg:table-cell">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> {design.uploaded}
                </div>
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(design.status)}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-gray-100 hidden xl:table-cell">
                {design.revisions}
              </td>
              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button className="text-yellow-500 hover:text-yellow-400">Preview</button>
                  <button className="text-blue-500 hover:text-blue-400">Review</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}