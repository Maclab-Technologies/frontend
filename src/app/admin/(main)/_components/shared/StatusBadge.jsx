import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

export default function StatusBadge({ status }) {
  const statusConfig = {
    active: {
      icon: <FiCheckCircle className="mr-1" />,
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    pending: {
      icon: <FiClock className="mr-1" />,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    },
    suspended: {
      icon: <FiXCircle className="mr-1" />,
      bg: 'bg-red-100',
      text: 'text-red-800'
    },
    processing: {
      icon: <FiAlertCircle className="mr-1" />,
      bg: 'bg-blue-100',
      text: 'text-blue-800'
    },
    default: {
      icon: null,
      bg: 'bg-gray-100',
      text: 'text-gray-800'
    }
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.default

  return (
    <span className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${config.bg} ${config.text}`}>
      {config.icon} {status}
    </span>
  )
}