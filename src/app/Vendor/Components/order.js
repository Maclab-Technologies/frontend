import { FaFileDownload, FaCheck } from 'react-icons/fa';

export default function Orders({ orders, handleDesignLinkSubmit }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white text-white"
          >
            All
          </button>
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-yellow-400 text-yellow-400"
          >
            Pending
          </button>
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-purple-400 text-purple-400"
          >
            In Review
          </button>
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-green-400 text-green-400"
          >
            Completed
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Files
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders ? orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {order.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.user}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.createdAt}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.orderStatus === "processing"
                            ? "bg-purple-100 text-purple-800"
                            : order.orderStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                    } 
                  `}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.total}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {order.items.map((item) =>
                      item.uploadedImages.map((file, index) => (
                        <button
                          key={index}
                          className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaFileDownload className="mr-1" />
                          <span className="truncate max-w-xs">{file}</span>
                        </button>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {order.orderStatus === "Pending" ||
                  order.orderStatus === "Processing" ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Enter design link"
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-48 mr-2"
                        defaultValue={order.designLink}
                      />
                      <button
                        onClick={() =>
                          handleDesignLinkSubmit(
                            order.id,
                            document.querySelector(
                              `input[placeholder="Enter design link"]`
                            ).value
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded text-xs"
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-green-400 flex items-center">
                        <FaCheck className="mr-1" /> Design Submitted
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">
                  No order found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}