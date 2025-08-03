'use client';

export default function StatusBadge({ status }) {
  const statusStyles = {
    Completed: 'bg-green-900 text-green-200',
    Approved: 'bg-green-900 text-green-200',
    Paid: 'bg-green-900 text-green-200',
    Active: 'bg-green-900 text-green-200',
    Pending: 'bg-yellow-900 text-yellow-200',
    'Awaiting Approval': 'bg-yellow-900 text-yellow-200',
    Assigned: 'bg-blue-900 text-blue-200',
    Revision: 'bg-red-900 text-red-200',
    default: 'bg-gray-700 text-gray-300'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      statusStyles[status] || statusStyles.default
    }`}>
      {status}
    </span>
  );
}