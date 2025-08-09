'use client';

import { useAdmin } from '../context/AdminContext';
import StatsCards from '../components/Dashboard/StatsCards';
import ActivityGraph from '../components/Dashboard/ActivityGraph';
import RecentActivity from '../components/Dashboard/RecentActivity';

export default function DashboardPage() {
  const { stats } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, <span className="text-yellow-400">Admin</span>
        </h1>
        <p className="text-gray-300 mb-6">Here's an overview of the platform</p>
        
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            <h3 className="font-medium text-yellow-400 mb-2">Revenue This Month</h3>
            <p className="text-2xl font-bold">{stats.revenueThisMonth}</p>
          </div>
          {/* Add other stat cards */}
        </div>
      </div>

      <ActivityGraph />
      <RecentActivity />
    </div>
  );
}