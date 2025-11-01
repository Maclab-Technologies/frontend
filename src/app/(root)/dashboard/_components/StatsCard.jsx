// app/dashboard/_components/StatsCard.jsx
export default function StatCard({ icon, label, value, compact = false }) {
  return (
    <div className={`
      bg-gray-700 rounded-lg p-3 lg:p-4 border-l-4 border-yellow-400
      ${compact ? 'min-h-0' : 'min-h-20 lg:min-h-24'}
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-300 text-xs lg:text-sm font-medium">
          {label}
        </div>
        <div className="text-lg lg:text-xl">
          {icon}
        </div>
      </div>
      <div className="text-white text-xl lg:text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}