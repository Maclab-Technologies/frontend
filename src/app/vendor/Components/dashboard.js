import LoadingMiddleware from "@/app/components/loading";
import { FaBoxOpen, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

export const metadata = {
  title: "Dashboard | 59Minutes Prints",
  description: "Vendor dashboard",
  icons: {
    icon: "/images/brandimage.jpeg",
  },
};

export default function Dashboard({
  vendorData,
  products,
  orders,
  summary,
  loading,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back,{" "}
          <span className="text-yellow-400">
            {vendorData?.businessName || "Vendor"}
          </span>
        </h1>
        <p className="text-gray-300 mb-6">
          Quick overview of your products and orders
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBoxOpen className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Products</p>
                  <p className="text-xl font-bold text-white">
                    {products.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaClipboardList className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Withdrawal Count</p>
                  <p className="text-xl font-bold text-white">
                    {summary.withdrawalsCount || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaMoneyBillWave className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Earnings</p>
                  <p className="text-xl font-bold text-white">
                    ₦{summary.totalEarnings || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaClipboardList className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Orders</p>
                  <p className="text-xl font-bold text-white">
                    {orders.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBoxOpen className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Withdrawal</p>
                  <p className="text-xl font-bold text-white">
                    ₦{summary.totalWithdrawals || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
            {loading ? (
              <LoadingMiddleware />
            ) : (
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaMoneyBillWave className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Available Balance</p>
                  <p className="text-xl font-bold text-white">
                    ₦{summary.availableBalance || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {loading ? (
            <LoadingMiddleware />
          ) : (
            orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {order.createdAt.toLocaleString()}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    order.orderStatus === "Completed"
                      ? "text-green-400"
                      : order.orderStatus === "Processing"
                        ? "text-blue-400"
                        : order.orderStatus === "In Review"
                          ? "text-purple-400"
                          : "text-yellow-400"
                  }`}
                >
                  {order.orderStatus}
                </p>
                <p className="text-sm">{order.total}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
