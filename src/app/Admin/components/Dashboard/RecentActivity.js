'use client';

import { FaUser, FaBoxOpen, FaPaintBrush } from 'react-icons/fa';

export default function RecentActivity() {
  const activities = [
    { 
      id: 1,
      icon: <FaUser />,
      title: "New user registered",
      description: "Michael Wong • 2023-09-15",
      color: "text-yellow-400"
    },
    { 
      id: 2,
      icon: <FaBoxOpen />,
      title: "New order received",
      description: "ORD-1003 • 2023-09-25",
      color: "text-yellow-400"
    },
    { 
      id: 3,
      icon: <FaPaintBrush />,
      title: "Design submitted for approval",
      description: "DSG-1002 • 2023-09-19",
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <button className="text-sm text-yellow-400 hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center">
            <div className={`bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3 ${activity.color}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-gray-400">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}   