
import StatsCards from "../_components/StatsCards";
import ActivityGraph from "../_components/ActivityGraph";
import RecentActivity from "../_components/RecentActivity";
import Banner from "../_components/UI/banner";

export const metadata = {
  title: 'Dashboard | Admin',
  description: 'Overview of key metrics and recent activity in the admin panel',
};

export default function DashboardPage() {
  
  return (
    <>
      {/* Welcome Banner */}
      <Banner  />

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
        {/* Order Activity Chart */}
        <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700">
          <ActivityGraph />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700">
          <RecentActivity />
        </div>
      </div>
    </>
  );
}
