"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaGift, FaTag, FaShoppingBag, FaArrowRight, FaFire, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";

const ChristmasPromotion = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [campaignPhase, setCampaignPhase] = useState("christmas");
  const [visibleCampaigns, setVisibleCampaigns] = useState([]);

  // Campaign end dates
  const campaignEndDates = [
    new Date("2025-12-10T23:59:59").getTime(), // 20% Discount ends Dec 10
    new Date("2025-12-20T23:59:59").getTime(), // ₦20,000 Voucher ends Dec 20
    new Date("2025-12-30T23:59:59").getTime(), // Combo deals ends Dec 30
  ];

  // New Year campaign dates
  const newYearStart = new Date("2025-12-30T00:00:00").getTime();
  const newYearEnd = new Date("2026-01-15T23:59:59").getTime();

  useEffect(() => {
    // Check campaign phase
    const now = new Date().getTime();
    
    if (now >= newYearStart && now <= newYearEnd) {
      setCampaignPhase("newyear");
      setVisibleCampaigns([]);
    } else if (now > newYearEnd) {
      setCampaignPhase("normal");
      setVisibleCampaigns([]);
    } else {
      // Christmas phase - show only campaigns that haven't expired
      const activeCampaigns = [];
      campaignEndDates.forEach((endDate, index) => {
        if (now < endDate) {
          activeCampaigns.push(index);
        }
      });
      setCampaignPhase("christmas");
      setVisibleCampaigns(activeCampaigns);
      if (activeCampaigns.length > 0 && !activeCampaigns.includes(activeCampaign)) {
        setActiveCampaign(activeCampaigns[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (campaignPhase === "normal" || visibleCampaigns.length === 0) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = campaignEndDates[activeCampaign];
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Auto-rotate campaigns
    let campaignTimer;
    if (campaignPhase === "christmas" && visibleCampaigns.length > 1) {
      campaignTimer = setInterval(() => {
        setActiveCampaign((prev) => {
          const currentIndex = visibleCampaigns.indexOf(prev);
          const nextIndex = (currentIndex + 1) % visibleCampaigns.length;
          return visibleCampaigns[nextIndex];
        });
      }, 8000);
    }

    setTimeLeft(calculateTimeLeft());

    return () => {
      clearInterval(timer);
      if (campaignTimer) clearInterval(campaignTimer);
    };
  }, [activeCampaign, campaignPhase, visibleCampaigns]);

  const campaigns = [
    {
      id: 1,
      title: "20% Christmas Discount",
      description: "Get instant 20% off all Christmas printing",
      icon: <FaTag className="w-6 h-6" />,
      color: "from-yellow-500 to-amber-600",
      badge: "MOST POPULAR",
      link: "/christmas-discount",
      expires: "Dec 10, 2025",
      numberColor: "bg-gradient-to-br from-yellow-500 to-amber-500",
      sectionColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/20",
      image: "/images/christmas-discount.png"
    },
    {
      id: 2,
      title: "₦20,000 Voucher Giveaway",
      description: "Win ₦20,000 for your Christmas printing needs",
      icon: <FaGift className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
      badge: "LIMITED TIME",
      link: "/christmas-voucher",
      expires: "Dec 20, 2025",
      numberColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
      sectionColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/20",
      image: "/images/christmas-voucher.png"
    },
    {
      id: 3,
      title: "Christmas Combo Deals",
      description: "Massive savings on bundled print packages",
      icon: <FaShoppingBag className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
      badge: "BEST VALUE",
      link: "/christmas-combo",
      expires: "Dec 30, 2025",
      numberColor: "bg-gradient-to-br from-green-500 to-emerald-500",
      sectionColor: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/20",
      image: "/images/christmas-combo.png"
    },
  ];

  // Navigation functions
  const nextCampaign = () => {
    if (visibleCampaigns.length > 1) {
      const currentIndex = visibleCampaigns.indexOf(activeCampaign);
      const nextIndex = (currentIndex + 1) % visibleCampaigns.length;
      setActiveCampaign(visibleCampaigns[nextIndex]);
    }
  };

  const prevCampaign = () => {
    if (visibleCampaigns.length > 1) {
      const currentIndex = visibleCampaigns.indexOf(activeCampaign);
      const prevIndex = (currentIndex - 1 + visibleCampaigns.length) % visibleCampaigns.length;
      setActiveCampaign(visibleCampaigns[prevIndex]);
    }
  };

  // If normal phase or no campaigns, return modern compact promotion
  if (campaignPhase === "normal" || visibleCampaigns.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mb-4">
              <FaFire className="w-4 h-4 mr-2 text-black" />
              <span className="text-black font-bold text-sm">SPECIAL OFFERS</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Check out our Latest Promotions!
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
            </p>
            
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-lg hover:scale-105 transition-transform shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>
    );
  }

  const activeCampaignData = campaigns[activeCampaign];

  return (
    <section className="py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mb-4">
            <FaFire className="w-4 h-4 mr-2 text-white" />
            <span className="text-white font-bold text-sm">CHRISTMAS SPECIAL</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Christmas Print Deals Are Here!
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't miss out on our exclusive Christmas promotions. Limited time offers with massive savings!
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {visibleCampaigns.length > 1 && (
            <>
              <button
                onClick={prevCampaign}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110 hidden md:block"
                aria-label="Previous campaign"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextCampaign}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110 hidden md:block"
                aria-label="Next campaign"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Main Promo Card - Carousel Style */}
          <motion.div
            key={activeCampaign}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/50"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Campaign Info (Left Side - Desktop) / (Top - Mobile) */}
              <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${activeCampaignData.numberColor} text-white shadow-lg`}>
                    {activeCampaignData.icon}
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 ${activeCampaignData.bgColor} ${activeCampaignData.sectionColor} text-xs font-bold rounded-full border ${activeCampaignData.borderColor}`}>
                      {activeCampaignData.badge}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  {activeCampaignData.title}
                </h3>
                
                <p className="text-gray-300 text-base lg:text-lg mb-6">
                  {activeCampaignData.description} – expires {activeCampaignData.expires}
                </p>
                
                {/* Countdown Timer */}
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">Offer ends in:</p>
                  <div className="flex gap-3">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div className="bg-gray-900 text-white text-2xl lg:text-3xl font-bold py-3 px-4 rounded-xl min-w-[70px] shadow-lg">
                          {value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 uppercase">
                          {unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push(activeCampaignData.link)}
                    className={`flex-1 py-4 ${activeCampaignData.numberColor} text-white font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl flex items-center justify-center`}
                  >
                    Claim This Offer
                    <FaArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => router.push("/products")}
                    className="py-4 px-6 bg-gray-700/50 text-white font-bold text-lg rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600"
                  >
                    View All
                  </button>
                </div>
              </div>
              
              {/* Campaign Image (Right Side - Desktop) / (Bottom - Mobile) */}
              <div className="lg:w-1/2 relative">
                <div className="relative h-64 lg:h-auto min-h-[300px] lg:min-h-[400px]">
                  <img
                    src={activeCampaignData.image}
                    alt={activeCampaignData.title}
                    className="w-full h-full object-contain lg:object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=800&h=600&fit=crop&auto=format`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-gray-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🔥 HOT DEAL
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Campaign Indicators */}
          {visibleCampaigns.length > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              {visibleCampaigns.map((campaignIndex, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCampaign(campaignIndex)}
                  className={`w-3 h-3 rounded-full transition-all ${campaignIndex === activeCampaign ? 'bg-yellow-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}
                  aria-label={`View campaign ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Campaigns Grid - Only on Desktop */}
        {visibleCampaigns.length > 1 && (
          <div className="hidden md:grid md:grid-cols-3 gap-6 mt-8">
            {visibleCampaigns.map((campaignIndex, index) => {
              const campaign = campaigns[campaignIndex];
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border ${campaignIndex === activeCampaign ? 'border-yellow-400/50' : 'border-gray-700/50'} hover:scale-[1.02] cursor-pointer`}
                  onClick={() => {
                    setActiveCampaign(campaignIndex);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${campaign.numberColor} text-white shadow-md`}>
                      {campaign.icon}
                    </div>
                    <span className={`text-xs font-bold ${campaign.sectionColor} ${campaign.bgColor} px-3 py-1 rounded-full border ${campaign.borderColor}`}>
                      Ends {campaign.expires}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3">
                    {campaign.title}
                  </h4>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {campaign.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${campaign.sectionColor}`}>
                      {campaign.badge}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(campaign.link);
                      }}
                      className={`${campaign.sectionColor} hover:opacity-80 font-medium text-sm flex items-center`}
                    >
                      View Offer
                      <FaArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile Navigation for campaigns grid */}
        {visibleCampaigns.length > 1 && (
          <div className="md:hidden mt-6">
            <div className="flex justify-center gap-4 overflow-x-auto pb-2">
              {visibleCampaigns.map((campaignIndex, index) => {
                const campaign = campaigns[campaignIndex];
                
                return (
                  <button
                    key={campaign.id}
                    onClick={() => setActiveCampaign(campaignIndex)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${campaignIndex === activeCampaign ? `${campaign.numberColor} text-white` : 'bg-gray-800 text-gray-300'}`}
                  >
                    <span className="text-sm font-medium">{campaign.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-8"
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">
              🎄 Make This Christmas Unforgettable! 🎄
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Whether it's church programs, business promotions, or party souvenirs, 
              we've got your Christmas printing covered with unbeatable deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg"
              >
                Explore All Products
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="px-6 py-3 bg-gray-700/50 text-white font-bold text-lg rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600"
              >
                Need Help? Contact Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChristmasPromotion;