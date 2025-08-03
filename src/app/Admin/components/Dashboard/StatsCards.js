'use client';

import { FaUsers, FaBoxOpen, FaUserTie, FaMoneyCheckAlt } from 'react-icons/fa';

export default function StatsCards({ stats }) {
  const cards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-yellow-400" />,
      bg: "bg-black bg-opacity-30"
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      icon: <FaBoxOpen className="text-yellow-400" />,
      bg: "bg-black bg-opacity-30"
    },
    { 
      title: "Total Vendors", 
      value: stats.totalVendors, 
      icon: <FaUserTie className="text-yellow-400" />,
      bg: "bg-black bg-opacity-30"
    },
    { 
      title: "Total Earnings", 
      value: stats.totalEarnings, 
      icon: <FaMoneyCheckAlt className="text-yellow-400" />,
      bg: "bg-black bg-opacity-30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bg} rounded-lg p-4 border border-gray-700`}>
          <div className="flex items-center">
            <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-300">{card.title}</p>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}