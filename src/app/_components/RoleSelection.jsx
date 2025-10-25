'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  FaStore, 
  FaUser, 
  FaRocket, 
  FaShield, 
  FaChartLine, 
  FaUsers,
  FaShoppingCart,
  FaStar,
  FaCheckCircle
} from "react-icons/fa";

const RoleSelection = () => {
  const [activeTab, setActiveTab] = useState('vendor');

  const vendorFeatures = [
    {
      icon: "FaStore",
      title: "Sell Products",
      description: "Reach thousands of customers"
    },
    {
      icon: "FaChartLine",
      title: "Analytics",
      description: "Track sales and performance"
    },
    {
      icon: "FaShield",
      title: "Secure Payments",
      description: "Get paid securely"
    },
    {
      icon: "FaUsers",
      title: "Customer Management",
      description: "Manage orders and shipments"
    }
  ];

  const clientFeatures = [
    {
      icon: "FaShoppingCart",
      title: "Shop Confidently",
      description: "Quality products from trusted vendors"
    },
    {
      icon: "FaStar",
      title: "Best Prices",
      description: "Competitive pricing and deals"
    },
    {
      icon: "FaShield",
      title: "Buyer Protection",
      description: "Your purchases are protected"
    },
    {
      icon: "FaCheckCircle",
      title: "Easy Returns",
      description: "Hassle-free returns"
    }
  ];

  const vendorBenefits = [
    "Zero setup fees",
    "Real-time inventory",
    "Marketing tools",
    "Dedicated support",
    "Flexible payments",
    "Performance analytics"
  ];

  const clientBenefits = [
    "Wide product variety",
    "Fast shipping",
    "Secure payments",
    "24/7 support",
    "Loyalty rewards",
    "Easy tracking"
  ];

  // Icon mapping object
  const iconMap = {
    FaStore,
    FaUser,
    FaRocket,
    FaShield,
    FaChartLine,
    FaUsers,
    FaShoppingCart,
    FaStar,
    FaCheckCircle
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || FaStore;
  };

  return (
    <section className="py-12 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Join 59MinutesPrint
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Sell your products or shop amazing deals - your platform awaits
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('vendor')}
              className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'vendor'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FaStore className="w-4 h-4" />
              For Vendors
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'client'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FaUser className="w-4 h-4" />
              For Clients
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {activeTab === 'vendor' ? (
                  <>
                    <FaRocket className="w-5 h-5 text-yellow-400" />
                    Why Sell With Us?
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="w-5 h-5 text-yellow-400" />
                    Why Shop With Us?
                  </>
                )}
              </h3>

              <div className="grid gap-4">
                {(activeTab === 'vendor' ? vendorFeatures : clientFeatures).map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon);
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="p-2 rounded-lg bg-yellow-400 text-black flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-sm mb-1">{feature.title}</h4>
                        <p className="text-gray-400 text-xs">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-3">
                Key Benefits
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(activeTab === 'vendor' ? vendorBenefits : clientBenefits).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                    <FaCheckCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                    <span className="truncate">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CTA and Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 shadow-xl border border-yellow-400/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'vendor' ? (
                    <FaStore className="w-6 h-6 text-black" />
                  ) : (
                    <FaUser className="w-6 h-6 text-black" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  {activeTab === 'vendor' ? 'Start Selling' : 'Start Shopping'}
                </h3>
                
                <p className="text-gray-300 mb-6 text-sm">
                  {activeTab === 'vendor' 
                    ? 'Join successful vendors and grow your business' 
                    : 'Discover products and enjoy seamless shopping'}
                </p>

                <div className="space-y-3">
                  <Link
                    href={activeTab === 'vendor' ? '/vendor/register' : '/register'}
                    className="block w-full py-3 px-6 bg-yellow-400 text-black rounded-lg font-bold text-base hover:bg-yellow-300 transition-colors duration-200 text-center"
                  >
                    {activeTab === 'vendor' ? 'Become a Vendor' : 'Create Account'}
                  </Link>
                  
                  <Link
                    href={activeTab === 'vendor' ? '/vendor/login' : '/login'}
                    className="block w-full py-2 px-6 border border-yellow-400 text-yellow-400 rounded-lg font-semibold text-sm hover:bg-yellow-400 hover:text-black transition-all duration-200 text-center"
                  >
                    {activeTab === 'vendor' ? 'Vendor Login' : 'Client Login'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {activeTab === 'vendor' ? '1K+' : '50K+'}
                </div>
                <div className="text-gray-400 text-xs font-medium">
                  {activeTab === 'vendor' ? 'Vendors' : 'Customers'}
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {activeTab === 'vendor' ? '95%' : '4.8'}
                </div>
                <div className="text-gray-400 text-xs font-medium">
                  {activeTab === 'vendor' ? 'Success' : 'Rating'}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                <FaRocket className="w-4 h-4 text-yellow-400" />
                Quick Start
              </h4>
              <p className="text-gray-400 text-xs">
                {activeTab === 'vendor' 
                  ? 'Setup in minutes, no tech skills needed' 
                  : 'Start shopping in under 2 minutes'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Compact */}
        <div className="text-center mt-10">
          <div className="bg-gray-900 rounded-xl p-6 border border-yellow-400/30">
            <h3 className="text-xl font-bold text-white mb-3">
              Ready to Begin?
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Join today and experience the best platform for {activeTab === 'vendor' ? 'selling' : 'shopping'}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vendor/register"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200 text-sm"
              >
                Join as Vendor
              </Link>
              <Link
                href="/register"
                className="bg-transparent border border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-colors duration-200 text-sm"
              >
                Join as Client
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;