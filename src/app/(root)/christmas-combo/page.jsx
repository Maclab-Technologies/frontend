"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ChristmasSignupForm from "../../_components/Christmas/SignupForm";
import { FacebookPixel } from "../../_components/Christmas/FacebookPixel";

export default function ChristmasComboPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 30, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-30T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Facebook Pixel */}
      <FacebookPixel eventName="PageView" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full mb-4 shadow-lg">
            🎄 Christmas Combo Deals 🎄
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Christmas Combo Deals – 
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Massive Savings on All Your Prints!
            </span>
          </h1>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <div className="text-center mb-4">
            <p className="text-xl text-green-300">Combo deals end in:</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-4 font-bold">
              ⚠️ Combo deals have ended!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-green-300">Perfect Christmas Bundles</h2>
              <p className="text-lg mb-4 text-gray-300">
                Get the perfect bundle for your event, business, or celebration at unbeatable Christmas prices.
              </p>
              <p className="mb-6 text-gray-300">
                Choose from ready-made combos designed to save you money and time – all delivered fast.
              </p>
              
              {/* Combo Options */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-green-500/20">
                  <h4 className="font-bold text-green-300 mb-2">🎪 Event Combo</h4>
                  <p className="text-gray-300">Roll-up banner + 500 flyers + 100 stickers</p>
                  <p className="text-green-400 mt-1 font-semibold">Save 35% compared to buying separately</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-green-500/20">
                  <h4 className="font-bold text-green-300 mb-2">🏢 Business Combo</h4>
                  <p className="text-gray-300">500 business cards + branded envelopes + letterheads</p>
                  <p className="text-green-400 mt-1 font-semibold">Save 40% compared to buying separately</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-green-500/20">
                  <h4 className="font-bold text-green-300 mb-2">🎉 Party Combo</h4>
                  <p className="text-gray-300">50 T-shirts + 100 souvenirs + 200 stickers</p>
                  <p className="text-green-400 mt-1 font-semibold">Save 45% compared to buying separately</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Customer Success Stories</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300">"The Event Combo saved me ₦15,000 on our church Christmas program!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Event Coordinator Femi</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300">"Business Combo gave me everything I needed to rebrand for the new year!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Startup Founder Adeola</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Form Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border-2 border-green-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 text-white">Grab Your Christmas Combo</h2>
              <p className="text-green-300">Sign up to access exclusive combo deals</p>
            </div>

            <ChristmasSignupForm 
              campaign="christmas_combo"
              ctaText="Grab My Christmas Combo"
              onSubmitSuccess={() => {
                if (window.fbq) {
                  window.fbq('track', 'Lead');
                }
              }}
            />
            
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>After signup, you'll get access to all combo deals</p>
              <p className="mt-2">By signing up, you agree to our Terms and Privacy Policy</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-green-300">Can I customize the combos?</h4>
              <p className="text-gray-300">Yes! After signup, you can customize any combo to fit your exact needs.</p>
            </div>
            <div>
              <h4 className="font-bold text-green-300">How fast will I get my order?</h4>
              <p className="text-gray-300">Most combo orders are delivered within 59 minutes in select areas.</p>
            </div>
            <div>
              <h4 className="font-bold text-green-300">Can I split the combo with friends?</h4>
              <p className="text-gray-300">Yes, many customers split combos for group events and parties.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <button
            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl"
          >
            🛒 Get Your Christmas Combo Now! 🛒
          </button>
        </div>
      </div>
    </div>
  );
}