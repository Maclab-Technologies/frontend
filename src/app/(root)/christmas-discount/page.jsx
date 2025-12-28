"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ClaimPromo from "../../_components/Christmas/ClaimPromo";

export default function ChristmasDiscountPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 10, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-10T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-2xl">🎅</span>
            <span>EXCLUSIVE CHRISTMAS DISCOUNT</span>
            <span className="text-2xl">🎅</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Get 20% Off All
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Christmas Printing Instantly!
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Limited-time holiday discount on banners, flyers, souvenirs, and more - with express 59-minute delivery
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border-2 border-yellow-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-2xl text-yellow-300 font-bold mb-2">⏰ Discount Ends In:</p>
            <p className="text-gray-400">This 20% discount is a Christmas exclusive - won't be repeated!</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-6 font-bold text-xl">
              ⚠️ This Christmas discount has expired!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Discount Details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Discount Card */}
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-lg p-8 rounded-3xl border-2 border-yellow-500/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Universal 20% Christmas Discount</h2>
                    <p className="text-yellow-400 text-lg">Apply to any print order, no minimum spend!</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 p-6 rounded-2xl border border-yellow-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <span className="text-2xl">📄</span>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-300">What's Included</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Banners & Roll-up Stands</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Flyers & Brochures</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Business Cards & Letterheads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Party Souvenirs & Gifts</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-yellow-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-300">Express Service</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>59-minute delivery*</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Free Christmas rush fee</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Priority order processing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Savings Example */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">💰 See Your Savings:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-black/40 rounded-xl">
                      <p className="text-gray-400">Typical Order</p>
                      <p className="text-2xl font-bold text-white">₦25,000</p>
                    </div>
                    <div className="text-center p-4 bg-black/40 rounded-xl">
                      <p className="text-gray-400">Your Discount</p>
                      <p className="text-2xl font-bold text-green-400">-₦5,000</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/40">
                      <p className="text-gray-400">You Pay Only</p>
                      <p className="text-3xl font-bold text-yellow-400">₦20,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-yellow-500/20">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">🎪 Perfect For:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">⛪</span>
                      <span className="text-gray-300">Church Christmas Programs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <span className="text-gray-300">Office End-of-Year Events</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🎉</span>
                      <span className="text-gray-300">Family Christmas Parties</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-yellow-500/20">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">✨ Additional Perks:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">•</span>
                      <span className="text-gray-300">Free Design Templates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">•</span>
                      <span className="text-gray-300">Instant Quote Generation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">•</span>
                      <span className="text-gray-300">Dedicated Support Agent</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Promo Card */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 to-amber-500"></div>
                
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-yellow-500 rounded-full mb-4">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Claim Your 20% Off</h2>
                  <p className="text-yellow-300 text-lg">Apply to any Christmas print order</p>
                  
                  <div className="mt-6 bg-black/50 p-4 rounded-xl border border-yellow-500/30">
                    <p className="text-gray-400 mb-1">Your Christmas Promo Code:</p>
                    <p className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">
                      CHRISTMAS20_OFF
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Use at checkout to save 20%</p>
                  </div>
                </div>

                <div className="mb-8">
                  <ClaimPromo 
                    campaign="20_percent_discount"
                    ctaText={
                      <span className="text-xl">
                        🔓 UNLOCK MY 20% DISCOUNT NOW
                      </span>
                    }
                    onSubmitSuccess={() => {
                      console.log("Christmas discount claimed successfully");
                    }}
                  />
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">No registration required</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Instant code activation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Works with all print items</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                  <p className="text-xs text-gray-400">
                    *59-minute delivery available in select areas. 
                    <br />
                    Discount valid until Dec 10, 2025. Limited spots remaining.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10 text-white">
            Happy Customers Using Our Christmas Discount
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Pastor David",
                role: "Church Leader",
                text: "Saved ₦8,000 on our Christmas program flyers! Quality was excellent and delivery was faster than expected.",
                emoji: "⛪"
              },
              {
                name: "Sarah M.",
                role: "Event Planner",
                text: "Perfect for our corporate Christmas party. The 20% discount made it so affordable for our entire team!",
                emoji: "🎉"
              },
              {
                name: "Chukwuemeka",
                role: "Business Owner",
                text: "Printed end-of-year reports and Christmas cards. The discount saved me thousands during this expensive season.",
                emoji: "💼"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/60 to-black/60 p-6 rounded-2xl border border-yellow-500/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.emoji}</div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-yellow-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border-2 border-yellow-500/30 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Your Christmas Printing Made Affordable!
            </h3>
            <p className="text-gray-300 mb-6">
              Don't pay full price this Christmas season. Claim your 20% discount before it's gone forever!
            </p>
            <button
              onClick={() => {
                const claimButton = document.querySelector('[onClick^="handleClaimPromo"]');
                if (claimButton) claimButton.click();
              }}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl animate-bounce"
            >
              🎄 CLAIM 20% DISCOUNT NOW 🎄
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            *Offer valid from November 15, 2025 to December 10, 2025. Cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  );
}