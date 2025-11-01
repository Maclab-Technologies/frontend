// app/dashboard/_components/SideNav.jsx
"use client";

import { useContext } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "@/app/(root)/_provider/useClientProvider";
import { useRouter, usePathname } from "next/navigation";

export default function SideNav() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: FaHome, path: "/dashboard" },
    { id: "orders", name: "My Orders", icon: FaShoppingCart, path: "/dashboard/orders" },
    { id: "transactions", name: "Transactions", icon: FaMoneyBillWave, path: "/dashboard/transaction" },
    { id: "settings", name: "Settings", icon: FaCog, path: "/dashboard/settings" },
  ];

  const handleNavigation = (item) => {
    router.push(item.path);
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="hidden lg:block w-72 bg-gray-800 rounded-lg flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-white text-xl font-bold">Customer Dashboard</h1>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm
                    ${active 
                      ? 'bg-yellow-400 text-gray-900 font-semibold' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`text-lg ${active ? 'text-gray-900' : 'text-current'}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400 hover:text-white rounded-lg transition-all duration-200 text-sm"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}