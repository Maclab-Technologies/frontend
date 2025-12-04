"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ChristmasSignupForm from "../../_components/Christmas/SignupForm";
import { FacebookPixel } from "../../_components/Christmas/FacebookPixel";

export default function ChristmasVoucherPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 20, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-20T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Facebook Pixel */}
      <FacebookPixel eventName="PageView" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full mb-4 shadow-lg">
            🎄 ₦20,000 Voucher Giveaway 🎄
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Win ₦20,000 for Your
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Christmas Printing!
            </span>
          </h1>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <div className="text-center mb-4">
            <p className="text-xl text-blue-300">Giveaway closes in:</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-4 font-bold">
              ⚠️ Giveaway has ended!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">Your Chance to Win ₦20,000</h2>
              <p className="text-lg mb-4 text-gray-300">
                Sign up today for a chance to win ₦20,000 you can use to print anything you want this season — flyers, banners, souvenirs, business cards and more.
              </p>
              <p className="mb-6 text-gray-300">
                Winners get the full ₦20k loaded directly into their account.
                Don't miss your shot — enter now before it closes.
              </p>
              
              {/* Prize Details */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">🏆</span>
                  <span>₦20,000 print voucher for winners</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">🎯</span>
                  <span>Can be used for any print product</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">⚡</span>
                  <span>59-minute delivery on select items</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Previous Winners</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-300">"Won last month's voucher! Printed all my business materials for FREE!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Business Owner Chinedu</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-300">"The ₦20,000 covered my church's entire Christmas printing needs!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Church Secretary Grace</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Form Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border-2 border-blue-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 text-white">Enter to Win ₦20,000</h2>
              <p className="text-blue-300">Fill the form below to enter the giveaway</p>
            </div>

            <ChristmasSignupForm 
              campaign="20000_voucher"
              ctaText="Enter to Win ₦20,000"
              onSubmitSuccess={() => {
                if (window.fbq) {
                  window.fbq('track', 'Lead');
                }
              }}
            />
            
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>By entering, you agree to our Terms and Privacy Policy</p>
              <p className="mt-2 text-xs">Winners will be notified via email and phone</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-blue-300">How are winners selected?</h4>
              <p className="text-gray-300">Winners are randomly selected from all eligible entries after the giveaway closes.</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300">When will winners be announced?</h4>
              <p className="text-gray-300">Winners will be announced within 24 hours after the giveaway ends.</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300">Can I use the voucher with other discounts?</h4>
              <p className="text-gray-300">Yes, the voucher can be combined with other offers for maximum savings.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <button
            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl"
          >
            🎯 Enter the ₦20,000 Giveaway Now! 🎯
          </button>
        </div>
      </div>
    </div>
  );
}