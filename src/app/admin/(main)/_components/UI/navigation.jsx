"use client";
import React from 'react';
import { 
  FaHome, 
  FaClipboardList, 
  FaPlus, 
  FaBoxOpen, 
  FaMoneyBillWave, 
  FaWallet,
  FaUsers
} from 'react-icons/fa';

// Reusable Navigation Button Component
const NavButton = ({ 
  tabKey, 
  activeTab, 
  icon: Icon, 
  label, 
  onClick 
}) => {
  const isActive = activeTab === tabKey;
  
  return (
    <button
      onClick={() => onClick(tabKey)}
      className={`
        w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
        transition-all duration-200 group
        ${
          isActive
            ? "bg-yellow-400 text-black font-bold shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      <span className={`mr-3 text-base transition-transform duration-200 ${
        !isActive && 'group-hover:scale-110'
      }`}>
        <Icon />
      </span>
      <span className="text-left font-medium">{label}</span>
    </button>
  );
};

// Navigation configuration
const navigationItems = [
  {
    key: 'dashboard',
    icon: FaHome,
    label: 'Dashboard'
  },
  {
    key: 'orders',
    icon: FaClipboardList,
    label: 'Orders'
  },
  {
    key: 'designs',
    icon: FaPlus,
    label: 'Designs'
  },
  {
    key: 'payments',
    icon: FaBoxOpen,
    label: 'Payments'
  },
  {
    key: 'payouts',
    icon: FaMoneyBillWave,
    label: 'Payouts'
  },
  {
    key: 'users',
    icon: FaUsers,
    label: 'Users Management'
  },
  {
    key: 'vendors',
    icon: FaWallet,
    label: 'Vendors Management'
  }
];

// Main Navigation Component
const Navigation = ({ activeTab, onNavigate, setMobileNavOpen }) => {
  const handleTabClick = (tabKey) => {
    onNavigate(tabKey);
    setMobileNavOpen(false);
  };

  return (
    <nav className="p-2 flex-1 overflow-y-auto">
      <div className="space-y-1">
        {navigationItems.map((item) => (
          <NavButton
            key={item.key}
            tabKey={item.key}
            activeTab={activeTab}
            icon={item.icon}
            label={item.label}
            onClick={handleTabClick}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;