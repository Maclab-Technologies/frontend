const StatusBadge = ({ status }) => {
  const statusClasses = {
    "completed": "bg-green-900 text-green-200",
    "inProgress": "bg-blue-900 text-blue-200",
    "pending": "bg-yellow-900 text-yellow-200"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;