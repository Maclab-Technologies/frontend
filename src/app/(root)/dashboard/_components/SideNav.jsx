"use client";

import Link from "next/link";
import {
  FaHome,
  FaShoppingCart,
  FaFileAlt,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../../_provider/useClientProvider";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
  { name: "My Orders", href: "/dashboard/orders", icon: <FaShoppingCart /> },
  // {
  //   name: "Track Progress",
  //   href: "/dashboard/track-order-progress",
  //   icon: <FaFileAlt />,
  // },
  { name: "Transactions", href: "/dashboard/transaction", icon: <FaMoneyBillWave /> },
  { name: "Settings", href: "/dashboard/settings", icon: <FaCog /> },
];

const SideNav = () => {
  const pathname = usePathname()
  const { authUser, logoutUser } = useContext(AuthContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(null);

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-40 
      w-64 bg-gray-800 shadow-lg 
      transform transition-transform duration-300 ease-in-out rounded
      ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:relative lg:translate-x-0 lg:w-64
      mt-16 lg:mt-0
    `}
    >
      <div className="lg:hidden absolute top-2 right-2">
        <button
          onClick={() => setMobileNavOpen(false)}
          className="p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
            <FaUser className="text-yellow-400" />
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-white truncate">
              {authUser?.displayName || "Client"}
            </p>
            <p className="text-xs text-gray-400 truncate">{authUser?.email}</p>
          </div>
        </div>
      </div>

      <nav className="p-2  overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => {
              setMobileNavOpen(false);
            }}
            className={`
              w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
              transition-all duration-200
              ${
                pathname === item.href
                  ? "bg-yellow-400 text-black font-bold shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <span className="mr-3 text-base">{item.icon}</span>
            <span className="text-left">{item.name}</span>
          </Link>
        ))}

        <button
          onClick={logoutUser}
          className="lg:hidden w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
          text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mt-4"
        >
          <span className="mr-3 text-base">
            <FaSignOutAlt />
          </span>
          <span className="text-left">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideNav;
