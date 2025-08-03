'use client';

export default function StatsCard({ title, value, icon, bgColor = 'bg-black bg-opacity-30', textColor = 'text-white' }) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-700`}>
      <div className="flex items-center">
        <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className={`text-xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}