'use client';

import { useAdmin } from '../../context/AdminContext';
import { FaChartPie, FaBoxOpen, FaUsers, FaUserTie, FaPaintBrush, FaMoneyCheckAlt, FaReceipt, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    mobileNavOpen, 
    setMobileNavOpen,
    handleLogout 
  } = useAdmin();

  const navItems = [
    { name: "Dashboard", icon: <FaChartPie />, path: "/Admin/dashboard" },
    { name: "Orders Management", icon: <FaBoxOpen />, path: "/Admin/orders" },
    { name: "Users Management", icon: <FaUsers />, path: "/Admin/users" },
    { name: "Vendor Management", icon: <FaUserTie />, path: "/Admin/vendors" },
    { name: "Design Management", icon: <FaPaintBrush />, path: "/Admin/designs" },
    { name: "Payout", icon: <FaMoneyCheckAlt />, path: "/Admin/payouts" },
    { name: "Payments Overview", icon: <FaReceipt />, path: "/Admin/payments" }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col top-40`}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.name
                  ? 'bg-yellow-500 text-gray-900 font-semibold shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-850 lg:hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-650 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}