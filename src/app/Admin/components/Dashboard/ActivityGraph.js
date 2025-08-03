'use client';

import { FaChartLine } from 'react-icons/fa';

export default function ActivityGraph() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Activity Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full">Daily</button>
          <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Weekly</button>
          <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">Monthly</button>
        </div>
      </div>
      <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700 h-64 flex flex-col items-center justify-center">
        <FaChartLine className="text-4xl text-gray-500 mb-2" />
        <p className="text-gray-400">Activity graph will be displayed here</p>
      </div>
    </div>
  );
}