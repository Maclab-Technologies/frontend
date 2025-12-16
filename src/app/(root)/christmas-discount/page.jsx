"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "../../_components/Christmas/CountdownTimer";
import ChristmasSignupForm from "../../_components/Christmas/SignupForm";

export default function ChristmasDiscountPage() {
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Countdown target: Dec 10, 2025, 23:59:59
  const countdownTarget = new Date("2025-12-10T23:59:59").getTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full mb-4 shadow-lg">
            🎄 Christmas Special 🎄
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Get 20% Off All 
            <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Christmas Printing Instantly!
            </span>
          </h1>
        </header>

        {/* Countdown Timer */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <div className="text-center mb-4">
            <p className="text-xl text-yellow-300">Offer expires in:</p>
          </div>
          <CountdownTimer 
            targetDate={countdownTarget} 
            onExpire={() => setTimerExpired(true)}
          />
          {timerExpired && (
            <p className="text-center text-red-400 mt-4 font-bold">
              ⚠️ This offer has expired!
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-300">Your Exclusive Offer</h2>
              <p className="text-lg mb-4 text-gray-300">
                Sign up now and unlock your exclusive 20% discount on flyers, banners, souvenirs, and more.
              </p>
              <p className="mb-6 text-gray-300">
                No stress. No delay. Just fast, affordable Christmas printing delivered in minutes.
                Offer expires soon – claim it now.
              </p>
              
              {/* Trust Elements */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>59-minute delivery on select items</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Premium quality guaranteed</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Free design assistance</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">What Our Customers Say</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="text-gray-300">"Got my church flyers in under an hour! Amazing service!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Pastor David</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="text-gray-300">"Perfect for our Christmas party souvenirs. Will use again!"</p>
                  <p className="text-sm text-gray-400 mt-1">- Event Planner Sarah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Form Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-6 rounded-2xl border-2 border-yellow-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 text-white">Claim Your 20% Discount</h2>
              <p className="text-yellow-300">Fill the form below to activate your discount</p>
            </div>

            <ChristmasSignupForm 
              campaign="20_percent_discount"
              ctaText="Unlock My 20% Discount"
              onSubmitSuccess={() => {
                // Simple success handler without Facebook Pixel
                console.log("Form submitted successfully");
              }}
            />
            
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>By signing up, you agree to our Terms and Privacy Policy</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-gray-700/50 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-yellow-300">How do I use my discount?</h4>
              <p className="text-gray-300">After signup, you'll receive a unique code via email and SMS. Apply it at checkout.</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-300">What items are eligible?</h4>
              <p className="text-gray-300">All Christmas-themed prints: flyers, banners, souvenirs, business cards, and more.</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-300">When does the offer expire?</h4>
              <p className="text-gray-300">This offer ends on December 10, 2025, at 11:59 PM.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <button
            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-2xl"
          >
            🎁 Claim Your Christmas Discount Now! 🎁
          </button>
        </div>
      </div>
    </div>
  );
}