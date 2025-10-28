const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center">
        <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
