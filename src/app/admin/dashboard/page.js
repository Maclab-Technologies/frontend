import StatsCards from "../_components/StatsCards";
import ActivityGraph from "../_components/ActivityGraph";
import RecentActivity from "../_components/RecentActivity";
import { AdminAuth } from "@/app/context/useAuthMiddleware";

export const metadata = {
  title: 'Dashboard | Admin',
  description: 'Overview of key metrics and recent activity in the admin panel',
};

export default function DashboardPage() {
  const admin = {
    role: "admin",
    isLoggedIn: true,
    isLoading: false,
    authUser: {
      name: "Admin User",
      lastLogin: new Date().toISOString(),
    },
  }
  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 md:p-6 mb-g p-4g p-46">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Welcome back, {admin.authUser?.name || "Guest Admin"}!
            </h2>
            <p className="text-sm text-white">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="text-xs font-medium px-3 py-2 bg-gray-400 text-white rounded-full">
              Last login: {new Date(admin.authUser?.lastLogin).toLocaleString() || "now"}
            </span>
          </div>
        </div>
      </div>

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
