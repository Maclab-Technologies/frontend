"use client"
import { batchRequests } from '@/app/hooks/fetch-hook'
import { useEffect } from 'react'
import { FiPackage, FiUsers, FiTruck, FiDollarSign } from 'react-icons/fi'

export default function StatsCards() {
  const stats = [
    { title: 'Total Orders', value: '1,248', change: '+12%', icon: <FiPackage className="w-5 h-5" /> },
    { title: 'Clients', value: '893', change: '+5%', icon: <FiUsers className="w-5 h-5" /> },
    { title: 'Vendors', value: '156', change: '+3%', icon: <FiTruck className="w-5 h-5" /> },
    { title: 'Revenue', value: '₦48,256,000', change: '+18%', icon: <FiDollarSign className="w-5 h-5" /> }
  ]

   useEffect(() => {
      const loadInitialData = async () => {
        try {
          const token = localStorage.getItem("vendor_token");
          const data = JSON.parse(localStorage.getItem("vendor_data"));
          setVendorToken(token);
          setVendorData(data);
  
          if (!token || !data) {
            router.push("/Vendor/Login");
            return;
          }
  
          // Using batchRequests for parallel API calls
          const result = await batchRequests([
            {
              // vendor orders
              url: `/orders/vendor/my-orders`,
              options: {
                method: "GET",
                token,
                config: { showToast: false },
              },
            },
            {
              // vendor earnings stats
              url: `/payments/earnings/stats/${data.id}`,
              options: {
                method: "GET",
                token,
                config: { showToast: false },
              },
            },
          ]);
  
          // Destructure results (batchRequests returns array in same order)
          const [
            productsResult,
            ordersResult,
            earningsResult,
            earningStats,
            statsSummary,
          ] = result;
  
          // Handle products
          if (productsResult.success) {
            setProducts(productsResult.data?.data || []);
          } else if (!productsResult.data.data.length === 0) {
            toast.warning("No Product found");
          } else if (!productsResult._failed) {
            toast.warning("Failed to fetch products");
          }
  
          // Handle orders
          if (ordersResult.success) {
            setOrders(ordersResult.data?.data || []);
          } else if (!ordersResult._failed) {
            toast.warning("Failed to fetch orders");
          }
  
          // Handle earnings
          if (earningsResult.success) {
            setEarnings(earningsResult.data?.data || []);
          } else if (!earningsResult._failed) {
            toast.warning("Failed to fetch earnings");
          }
  
          if (earningStats.success) {
            setEarningsStats(earningStats.data?.data || []);
          } else if (!earningStats._failed) {
            toast.warning("Failed to fetch earnings stats");
          }
          // Handle vendor summary
          if (statsSummary.success) {
            setSummary(statsSummary.data?.data || []);
          } else if (!statsSummary._failed) {
            toast.warning("Failed to fetch earnings");
          }
  
          // Check if any critical requests failed
          const criticalFailures = result.filter((r) => r._failed).length;
          if (criticalFailures > 0) {
            toast.warning(
              `${criticalFailures} requests failed. Some data may be incomplete.`
            );
          }
        } catch (error) {
          console.error("Error loading initial data:", error);
          toast.error("Failed to load data");
        } finally {
          setLoading(false);
        }
      };
  
      loadInitialData();
    },[]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}