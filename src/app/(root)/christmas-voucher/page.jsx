"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ClaimPromo from "../../_components/Christmas/ClaimPromo";

export default function ChristmasVoucherPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 20, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-20T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-2xl">💰</span>
            <span>₦20,000 VOUCHER GIVEAWAY</span>
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Win ₦20,000 for Your
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Christmas Printing Needs!
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enter now for a chance to win a ₦20,000 print voucher - cover all your holiday printing expenses for FREE!
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border-2 border-blue-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-2xl text-blue-300 font-bold mb-2">⏰ Giveaway Closes In:</p>
            <p className="text-gray-400">Don't miss your chance to win ₦20,000 worth of FREE printing!</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-6 font-bold text-xl">
              ⚠️ The ₦20,000 giveaway has ended!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Giveaway Details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Prize Card */}
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-lg p-8 rounded-3xl border-2 border-blue-500/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">₦20,000 Print Voucher Giveaway</h2>
                    <p className="text-blue-400 text-lg">Print anything you want for the holidays - completely FREE!</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 p-6 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <h3 className="text-xl font-bold text-blue-300">What You Can Print</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Banners & Roll-up Stands</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Flyers & Brochures</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Christmas Cards & Invitations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>T-shirts & Souvenirs</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-bold text-blue-300">Giveaway Features</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Multiple winners selected</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Voucher never expires</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Use anytime in 2025</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>59-minute delivery available</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Voucher Value */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-gray-400 text-lg">Total Voucher Value</p>
                      <p className="text-5xl font-bold text-white mt-2">
                        ₦20,000
                      </p>
                      <p className="text-blue-400 mt-2">Enough to cover all your Christmas printing!</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-black/40 rounded-xl">
                        <p className="text-sm text-gray-400">That's Like</p>
                        <p className="text-xl font-bold text-white">1000 Flyers</p>
                      </div>
                      <div className="text-center p-3 bg-black/40 rounded-xl">
                        <p className="text-sm text-gray-400">Or</p>
                        <p className="text-xl font-bold text-white">50 T-shirts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-blue-500/20 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Enter Giveaway</h3>
                  <p className="text-gray-300">Click the button below to enter with one click</p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-blue-500/20 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Wait For Draw</h3>
                  <p className="text-gray-300">Winners drawn after December 20th, 2025</p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-blue-500/20 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Claim Your Prize</h3>
                  <p className="text-gray-300">₦20,000 voucher credited instantly if you win</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enter Giveaway Card */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-blue-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
                    <span className="text-3xl">🎰</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Enter ₦20,000 Giveaway</h2>
                  <p className="text-blue-300 text-lg">One click could get you FREE Christmas printing!</p>
                  
                  <div className="mt-6 bg-black/50 p-4 rounded-xl border border-blue-500/30">
                    <p className="text-gray-400 mb-1">Entry Confirmation:</p>
                    <p className="text-xl font-bold text-blue-400 tracking-wider">
                      Entered Successfully!
                    </p>
                    <p className="text-xs text-gray-400 mt-2">You'll get a confirmation email after entry</p>
                  </div>
                </div>

                <div className="mb-8">
                  <ClaimPromo 
                    campaign="20000_voucher"
                    ctaText={
                      <span className="text-xl">
                        🎯 ENTER TO WIN ₦20,000 NOW
                      </span>
                    }
                    onSubmitSuccess={() => {
                      console.log("Giveaway entered successfully");
                    }}
                  />
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Entry takes 10 seconds</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">No purchase necessary</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <span className="text-xl">✅</span>
                    <span className="text-sm">Multiple winners selected</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-400">Giveaway Terms:</p>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Open to Nigeria residents 18+</li>
                    <li>• One entry per person</li>
                    <li>• Winners announced Dec 21, 2025</li>
                    <li>• Voucher valid for all print products</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Winners */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10 text-white">
            Meet Our Previous Winners
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Chinedu O.",
                role: "Business Owner",
                text: "Won ₦20,000 last month! Printed all my business cards, flyers, and banners. Saved my entire marketing budget!",
                emoji: "💼",
                win: "October 2024 Winner"
              },
              {
                name: "Grace A.",
                role: "Church Secretary",
                text: "The voucher covered our entire Christmas program printing. From invitation cards to banners - all FREE!",
                emoji: "⛪",
                win: "November 2024 Winner"
              },
              {
                name: "Bisi T.",
                role: "Event Planner",
                text: "Printed 200 T-shirts and souvenirs for our Christmas party. The ₦20,000 voucher made it possible!",
                emoji: "🎉",
                win: "September 2024 Winner"
              }
            ].map((winner, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/60 to-black/60 p-6 rounded-2xl border border-blue-500/20 relative"
              >
                <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {winner.win}
                </div>
                <div className="flex items-center gap-3 mb-4 pt-4">
                  <div className="text-3xl">{winner.emoji}</div>
                  <div>
                    <p className="font-bold text-white">{winner.name}</p>
                    <p className="text-sm text-blue-400">{winner.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{winner.text}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">Verified Winner</span>
                  <span className="text-green-400">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-2 border-blue-500/30 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Don't Miss This Life-Changing Opportunity!
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Imagine getting ₦20,000 worth of FREE printing this Christmas. That's enough to cover flyers, banners, souvenirs, and more for your entire event or business!
            </p>
            <button
              onClick={() => {
                const claimButton = document.querySelector('[onClick^="handleClaimPromo"]');
                if (claimButton) claimButton.click();
              }}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl animate-bounce"
            >
              🎰 ENTER ₦20,000 GIVEAWAY NOW 🎰
            </button>
          </div>
          
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            *Giveaway closes December 20, 2025 at 11:59 PM. Winners selected randomly from all eligible entries. 
            No purchase necessary. Winners will be notified via email and phone call.
          </p>
        </div>
      </div>
    </div>
  );
}