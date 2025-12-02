"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaGift, FaTag, FaShoppingBag, FaArrowRight, FaFire, FaCalendarAlt, FaRocket } from "react-icons/fa";
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [campaignPhase, setCampaignPhase] = useState("christmas"); // "christmas", "newyear", "normal"
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
    // Update current date every minute
    const dateTimer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    // Check campaign phase
    const now = new Date().getTime();
    
    if (now >= newYearStart && now <= newYearEnd) {
      setCampaignPhase("newyear");
      setVisibleCampaigns([3]); // Only show New Year campaign
      setActiveCampaign(0);
    } else if (now > newYearEnd) {
      setCampaignPhase("normal");
      setVisibleCampaigns([]); // No campaigns visible
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

    return () => clearInterval(dateTimer);
  }, [currentDate]);

  useEffect(() => {
    if (campaignPhase === "normal" || visibleCampaigns.length === 0) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      let targetDate;
      
      if (campaignPhase === "newyear") {
        targetDate = newYearEnd; // Countdown to end of New Year campaign
      } else {
        targetDate = campaignEndDates[activeCampaign];
      }
      
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

    // Auto-rotate campaigns (only for Christmas phase with multiple campaigns)
    let campaignTimer;
    if (campaignPhase === "christmas" && visibleCampaigns.length > 1) {
      campaignTimer = setInterval(() => {
        setActiveCampaign((prev) => {
          const currentIndex = visibleCampaigns.indexOf(prev);
          const nextIndex = (currentIndex + 1) % visibleCampaigns.length;
          return visibleCampaigns[nextIndex];
        });
      }, 4000);
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => {
      clearInterval(timer);
      if (campaignTimer) clearInterval(campaignTimer);
    };
  }, [activeCampaign, campaignPhase, visibleCampaigns]);

  const christmasCampaigns = [
    {
      id: 1,
      title: "20% Christmas Discount",
      description: "Get instant 20% off all Christmas printing",
      icon: <FaTag className="text-yellow-500" />,
      color: "from-yellow-500 to-amber-600",
      badge: "MOST POPULAR",
      link: "/christmas-discount",
      expires: "Dec 10, 2025",
      numberColor: "bg-gradient-to-br from-yellow-500 to-amber-500 text-black",
      sectionColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/20",
      emoji: "🏷️"
    },
    {
      id: 2,
      title: "₦20,000 Voucher Giveaway",
      description: "Win ₦20,000 for your Christmas printing needs",
      icon: <FaGift className="text-blue-500" />,
      color: "from-blue-500 to-cyan-600",
      badge: "LIMITED TIME",
      link: "/christmas-voucher",
      expires: "Dec 20, 2025",
      numberColor: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
      sectionColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/20",
      emoji: "💰"
    },
    {
      id: 3,
      title: "Christmas Combo Deals",
      description: "Massive savings on bundled print packages",
      icon: <FaShoppingBag className="text-green-500" />,
      color: "from-green-500 to-emerald-600",
      badge: "BEST VALUE",
      link: "/christmas-combo",
      expires: "Dec 30, 2025",
      numberColor: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
      sectionColor: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/20",
      emoji: "🛍️"
    },
  ];

  const newYearCampaign = {
    id: 4,
    title: "New Year 2026 Kickstart",
    description: "Start 2026 with amazing print deals for your business",
    icon: <FaRocket className="text-purple-500" />,
    color: "from-purple-500 to-pink-600",
    badge: "NEW YEAR SPECIAL",
    link: "/new-year-promo",
    expires: "Jan 15, 2026",
    numberColor: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
    sectionColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/20",
    emoji: "🚀"
  };

  // Get active campaign data
  let activeCampaignData;
  if (campaignPhase === "newyear") {
    activeCampaignData = newYearCampaign;
  } else if (campaignPhase === "christmas" && visibleCampaigns.length > 0) {
    activeCampaignData = christmasCampaigns[activeCampaign];
  }

  // Calculate actual time left for each campaign
  const getTimeLeftForCampaign = (campaignIndex, isNewYear = false) => {
    const now = new Date().getTime();
    let targetDate;
    
    if (isNewYear) {
      targetDate = newYearEnd;
    } else {
      targetDate = campaignEndDates[campaignIndex];
    }
    
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

  // If normal phase (after Jan 15), return normal promotion
  if (campaignPhase === "normal") {
    return (
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Check out our Latest 
              <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Promotions!
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
            </p>
          </motion.div>

          <div className="text-center">
            <button
              onClick={() => router.push("/products")}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Get correct time display for current campaign
  const displayTimeLeft = getTimeLeftForCampaign(
    campaignPhase === "newyear" ? 0 : activeCampaign,
    campaignPhase === "newyear"
  );

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          let emoji, color;
          if (campaignPhase === "newyear") {
            emoji = i % 3 === 0 ? "🎉" : i % 3 === 1 ? "✨" : "🚀";
            color = i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#ec4899' : '#8b5cf6';
          } else {
            emoji = i % 3 === 0 ? "🎄" : i % 3 === 1 ? "🎁" : "✨";
            color = i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#3b82f6' : '#10b981';
          }
          
          return (
            <motion.div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                color: color
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-4 shadow-lg ${campaignPhase === "newyear" ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-yellow-400 to-amber-500'}`}>
            {campaignPhase === "newyear" ? <FaRocket className="mr-2 text-white" /> : <FaFire className="mr-2 text-white" />}
            <span className="text-white font-bold text-sm">
              {campaignPhase === "newyear" ? "NEW YEAR SPECIAL" : "CHRISTMAS SPECIAL"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {campaignPhase === "newyear" ? "New Year 2026" : "Christmas"}
            <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {campaignPhase === "newyear" ? "Print Deals Launch!" : "Print Deals Are Here!"}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            {campaignPhase === "newyear" 
              ? "Start the new year with amazing printing offers for your business!"
              : "Don't miss out on our exclusive Christmas promotions. Limited time offers with massive savings!"}
          </p>
        </motion.div>

        {/* Main Promo Card - Only show if we have active campaigns */}
        {campaignPhase !== "normal" && activeCampaignData && (
          <motion.div
            key={campaignPhase === "newyear" ? "newyear" : activeCampaign}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden mb-10 border-2 border-gray-700/50"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Campaign Info */}
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl ${activeCampaignData.numberColor} text-white shadow-lg`}>
                      {activeCampaignData.icon}
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 ${activeCampaignData.bgColor} ${activeCampaignData.sectionColor} text-xs font-bold rounded-full border ${activeCampaignData.borderColor}`}>
                        {activeCampaignData.badge}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {activeCampaignData.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg mb-6">
                    {activeCampaignData.description} – expires {activeCampaignData.expires}
                  </p>
                  
                  {/* Countdown Timer */}
                  <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-3">Offer ends in:</p>
                    <div className="flex gap-3">
                      {Object.entries(displayTimeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="bg-gray-900 text-white text-2xl font-bold py-3 px-4 rounded-xl min-w-[70px] shadow-lg">
                            {value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-gray-400 mt-2 uppercase">
                            {unit}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Today is {currentDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • This offer ends on {activeCampaignData.expires}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => router.push(activeCampaignData.link)}
                    className={`inline-flex items-center px-8 py-4 ${activeCampaignData.numberColor} font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
                  >
                    Claim This Offer
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
                
                {/* Campaign Visual */}
                <div className="lg:w-1/3 relative">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600/50 shadow-2xl">
                      <div className="text-8xl">
                        {activeCampaignData.emoji}
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      🔥 HOT DEAL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Campaign Grid - Only show for Christmas phase with multiple campaigns */}
        {campaignPhase === "christmas" && visibleCampaigns.length > 1 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {visibleCampaigns.map((campaignIndex, index) => {
              const campaign = christmasCampaigns[campaignIndex];
              const campaignTimeLeft = getTimeLeftForCampaign(campaignIndex);
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${campaignIndex === activeCampaign ? 'border-yellow-400/50' : 'border-gray-700/50'} hover:scale-[1.02] cursor-pointer`}
                  onClick={() => {
                    setActiveCampaign(campaignIndex);
                    setTimeout(() => {
                      router.push(campaign.link);
                    }, 300);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${campaign.numberColor} shadow-lg`}>
                      {campaign.icon}
                    </div>
                    <span className={`text-xs font-bold ${campaign.sectionColor} ${campaign.bgColor} px-2 py-1 rounded border ${campaign.borderColor}`}>
                      Ends {campaign.expires}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">
                    {campaign.title}
                  </h4>
                  
                  <p className="text-gray-300 mb-4">
                    {campaign.description}
                  </p>
                  
                  {/* Mini Timer for each campaign card */}
                  <div className="mb-4">
                    <div className="flex gap-1 justify-between">
                      {Object.entries(campaignTimeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded">
                            {value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 uppercase">
                            {unit.charAt(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${campaign.sectionColor}`}>
                      {campaign.badge}
                    </span>
                    <button className={`${campaign.sectionColor} hover:opacity-80 font-medium text-sm flex items-center`}>
                      View Offer
                      <FaArrowRight className="ml-1 text-xs" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {campaignPhase === "newyear" ? "🎉 Start 2026 with Impact! 🎉" : "🎄 Make This Christmas Unforgettable! 🎄"}
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {campaignPhase === "newyear" 
                ? "Whether it's business rebranding, marketing materials, or office printing, start the year right with our amazing offers!"
                : "Whether it's church programs, business promotions, or party souvenirs, we've got your Christmas printing covered with unbeatable deals."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/products")}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Explore All Products
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="px-8 py-3 bg-gray-700/50 text-white font-bold rounded-xl hover:bg-gray-600/50 transition-colors border-2 border-gray-600"
              >
                Need Help? Contact Us
              </button>
            </div>
          </div>
          
          {/* Campaign Indicators - Only show for Christmas phase */}
          {campaignPhase === "christmas" && visibleCampaigns.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
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
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500"></div>
    </section>
  );
};

export default ChristmasPromotion;