"use client";
import React from "react";
import { Printer, Users, ShoppingCart, Truck, Clock, AlertCircle, CheckCircle } from "lucide-react";

const DashboardContent = () => {
  // Mock data that would typically come from an API
  const stats = {
    ordersToday: 24,
    activePrintJobs: 12,
    pendingShipments: 8,
    newCustomers: 5,
    completionRate: '92%',
    urgentJobs: 3
  };

  const recentOrders = [
    { id: '#ORD-7890', customer: 'Jane Cooper', type: 'Business Cards (500)', status: 'completed', amount: '$125.00', dueDate: 'Today 3PM' },
    { id: '#ORD-7891', customer: 'Michael Johnson', type: 'Posters (24x36) - 50', status: 'printing', amount: '$89.50', dueDate: 'Today 5PM' },
    { id: '#ORD-7892', customer: 'Sarah Williams', type: 'Brochures - 1000', status: 'processing', amount: '$210.75', dueDate: 'Tomorrow 10AM' },
    { id: '#ORD-7893', customer: 'Robert Chen', type: 'Banners (3x6)', status: 'urgent', amount: '$345.20', dueDate: 'Today 12PM' }
  ];

  const printQueue = [
    { job: 'Business Cards - Jane Cooper', status: 'in-progress', progress: 45, startTime: '10:30 AM', printer: 'Printer #2' },
    { job: 'Flyers - Bob Smith', status: 'queued', progress: 0, queueTime: '11:15 AM', printer: 'Printer #1' },
    { job: 'Urgent: Event Posters - Tech Conf', status: 'in-progress', progress: 15, startTime: '11:45 AM', printer: 'Printer #3' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Orders Today */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50">
              <ShoppingCart className="text-blue-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Orders Today</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-800">{stats.ordersToday}</p>
                <span className="ml-2 text-xs text-green-600 font-medium">+2 from yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Print Jobs */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50">
              <Printer className="text-green-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Print Jobs</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-800">{stats.activePrintJobs}</p>
                <span className="ml-2 text-xs text-red-600 font-medium flex items-center">
                  <AlertCircle className="mr-1" size={12} /> {stats.urgentJobs} urgent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-50">
              <Truck className="text-yellow-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Shipments</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-800">{stats.pendingShipments}</p>
                <span className="ml-2 text-xs text-gray-500 font-medium flex items-center">
                  <Clock className="mr-1" size={12} /> 2 delayed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50">
              <CheckCircle className="text-purple-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="text-2xl font-semibold text-gray-800">{stats.completionRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Print Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-500">{order.customer}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.type}</div>
                      <div className="text-xs text-gray-500">{order.amount}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {order.dueDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'printing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'urgent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Queue */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Print Queue</h2>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="flex items-center mr-3"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> In Progress</span>
              <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div> Queued</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {printQueue.map((job, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                job.status === 'in-progress' ? 'border-green-100 bg-green-50' : 'border-yellow-100 bg-yellow-50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">{job.job}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    job.status === 'in-progress' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status === 'in-progress' ? 'In Progress' : 'Queued'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      job.status === 'in-progress' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{job.status === 'in-progress' ? `Started: ${job.startTime}` : `Queued: ${job.queueTime}`}</span>
                  <span>{job.progress}% Complete</span>
                </div>
                {job.printer && (
                  <div className="mt-1 text-xs text-gray-500">
                    Printer: <span className="font-medium">{job.printer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;