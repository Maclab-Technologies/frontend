"use client";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/context/useAuth';
import { Search, Filter, Calendar, Eye, Edit, Truck, Printer, CheckCircle, DollarSign, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';

// Orders Table Component
const OrdersTable = ({ filterQueries }) => {
  const { token } = useContext(AuthContext);
  const [filteredOrders, setFilteredOrders] = useState([])

    useEffect(() => {
      const fetchOrders = async () => {
        let secret = token
          ? token
          : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTdjYzg3ODZlYWExM2VmZjk0ZGE1OSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7ImNhbk1hbmFnZVByb2R1Y3RzIjpmYWxzZSwiY2FuTWFuYWdlVXNlcnMiOmZhbHNlLCJjYW5NYW5hZ2VWZW5kb3JzIjpmYWxzZSwiY2FuTWFuYWdlT3JkZXJzIjpmYWxzZSwiY2FuTWFuYWdlQ29udGVudCI6ZmFsc2UsImNhblZpZXdBbmFseXRpY3MiOmZhbHNlfSwiaWF0IjoxNzU2MTM1NjE2LCJleHAiOjE3NTYyMjIwMTZ9.2Gjepd-IQdm_QjB-zl84O8iEA_sRIFoecfCATOBJS0w";
  
        try {
          const res = await get("/admin/orders", { token: secret });
  
          if (res.success) {
            const data = res.data;
            if(data.data.length !== 0){
              setFilteredOrders(data?.data)
            } else {
              toast.warning('No order found')
            }   
          }
        } catch (error) {
          console.error("Fetch Error: ", error);
          toast.error("Failed to fetch order");
        }
      };
  
      fetchOrders();
    }, [token, filterQueries]);

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'Processing':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`}><Printer size={12} /> {status}</span>
      case 'Design Review':
        return <span className={`${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`}><Edit size={12} /> {status}</span>
      case 'Shipped':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}><Truck size={12} /> {status}</span>
      case 'Delivered':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`}><CheckCircle size={12} /> {status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`}>{status}</span>
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Vendor</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="p-4 text-sm font-mono text-yellow-400 font-medium">{order.id}</td>
                <td className="p-4 text-sm text-gray-100">{order.customer}</td>
                <td className="p-4 text-sm text-gray-100">{order.product}</td>
                <td className="p-4 text-sm text-gray-100 font-semibold">₦{order.amount.toLocaleString()}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-sm text-gray-300">{order.vendor}</td>
                <td className="p-4 text-sm text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-gray-700/50 rounded-xl p-4 space-y-3 backdrop-blur-sm border border-gray-600/50">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-mono font-semibold text-sm">{order.id}</span>
              <button className="p-1 text-gray-400 hover:text-white">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Customer</span>
                <span className="text-white font-medium">{order.customer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Product</span>
                <span className="text-white">{order.product}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Amount</span>
                <span className="text-white font-semibold">₦{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Vendor</span>
                <span className="text-gray-100">{order.vendor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Date</span>
                <span className="text-gray-100">{new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-600">
              {getStatusBadge(order.status)}
              <div className="flex items-center gap-2">
                <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default OrdersTable;