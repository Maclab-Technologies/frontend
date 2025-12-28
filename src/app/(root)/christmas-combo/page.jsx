"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ClaimPromo from "../../_components/Christmas/ClaimPromo";

export default function ChristmasComboPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 30, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-30T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-2xl">🎄</span>
            <span>LIMITED TIME CHRISTMAS OFFER</span>
            <span className="text-2xl">🎄</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Christmas Print Combo
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
              Get 20% Off + Free Delivery
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Exclusive holiday bundle with premium prints for your business, event, or celebration
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border-2 border-green-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-2xl text-green-300 font-bold mb-2">⏰ Offer Expires In:</p>
            <p className="text-gray-400">This special Christmas combo will never be available again</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-6 font-bold text-xl">
              ⚠️ Christmas deals have ended!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Combo Details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Offer Card */}
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-lg p-8 rounded-3xl border-2 border-green-500/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-600 p-3 rounded-full">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Your Christmas Combo Includes:</h2>
                    <p className="text-green-400 text-lg">Everything you need for a successful holiday season</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 p-6 rounded-2xl border border-green-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <span className="text-2xl">🖨️</span>
                      </div>
                      <h3 className="text-xl font-bold text-green-300">Premium Quality Prints</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>High-resolution printing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Premium paper stock</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Professional finishing</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-green-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <span className="text-2xl">🚚</span>
                      </div>
                      <h3 className="text-xl font-bold text-green-300">Express Delivery</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>59-minute delivery*</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Free delivery this Christmas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Nationwide coverage</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 line-through text-lg">Regular Price: ₦50,000</p>
                      <p className="text-3xl font-bold text-white">Christmas Price: ₦40,000</p>
                    </div>
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                      Save 20%
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-green-500/20">
                  <h3 className="text-xl font-bold text-green-300 mb-4">🎯 Perfect For:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🎪</span>
                      <span className="text-gray-300">Christmas Events & Parties</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <span className="text-gray-300">Business End-of-Year Promos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🎁</span>
                      <span className="text-gray-300">Gift Packaging & Branding</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-green-500/20">
                  <h3 className="text-xl font-bold text-green-300 mb-4">✨ What You Get:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span className="text-gray-300">Custom Design Consultation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span className="text-gray-300">Unlimited Revisions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400 text-xl">•</span>
                      <span className="text-gray-300">Priority Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Promo Card */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-green-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-green-600 rounded-full mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Claim Your 20% Off</h2>
                  <p className="text-green-300 text-lg">Plus Free Christmas Delivery</p>
                  
                  <div className="mt-6 bg-black/50 p-4 rounded-xl border border-green-500/30">
                    <p className="text-gray-400 mb-1">Use Promo Code:</p>
                    <p className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">
                      59MIN_CHRISTMAS_20
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <ClaimPromo 
                    campaign="christmas_combo"
                    ctaText={
                      <span className="text-xl">
                        🎄 CLAIM MY 20% OFF NOW 🎄
                      </span>
                    }
                    onSubmitSuccess={() => {
                      console.log("Christmas promo claimed successfully");
                    }}
                  />
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Instant promo code activation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">No hidden fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Christmas-only pricing</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                  <p className="text-xs text-gray-400">
                    *59-minute delivery available in select areas. 
                    <br />
                    Offer valid until Dec 30, 2025. Limited spots available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10 text-white">
            What Customers Say About Our Christmas Combos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Femi A.",
                role: "Event Coordinator",
                text: "Saved ₦15,000 on our church Christmas program! The quality was exceptional and delivery was faster than promised.",
                emoji: "⛪"
              },
              {
                name: "Adeola B.",
                role: "Startup Founder",
                text: "Got everything I needed to rebrand for the new year. The Christmas combo made it so affordable!",
                emoji: "🚀"
              },
              {
                name: "Chika O.",
                role: "Party Planner",
                text: "Perfect for our Christmas parties! The combo had everything and saved me so much time.",
                emoji: "🎉"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/60 to-black/60 p-6 rounded-2xl border border-green-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.emoji}</div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-green-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/30 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Don't Miss This Christmas Exclusive!
            </h3>
            <p className="text-gray-300 mb-6">
              Join hundreds of satisfied customers who've saved big with our Christmas combos.
              Limited spots remaining!
            </p>
            <button
              onClick={() => {
                const claimButton = document.querySelector('[onClick^="handleClaimPromo"]');
                if (claimButton) claimButton.click();
              }}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl animate-bounce"
            >
              🎁 CLAIM CHRISTMAS COMBO NOW 🎁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}