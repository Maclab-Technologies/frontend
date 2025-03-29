"use client";

import Link from "next/link";
import { useState } from "react";

export default function VendorLandingPage() {
  const [isHoverPrimary, setIsHoverPrimary] = useState(false);
  const [isHoverSecondary, setIsHoverSecondary] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Grow Your Print Business with <span className="text-amber-500">59Minutes</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join our marketplace to reach thousands of customers and manage your print business effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/Vendor/Register"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 ${
                isHoverPrimary 
                  ? "bg-amber-400 text-gray-900 shadow-lg transform scale-105" 
                  : "bg-amber-500 text-gray-900 shadow-md"
              }`}
              onMouseEnter={() => setIsHoverPrimary(true)}
              onMouseLeave={() => setIsHoverPrimary(false)}
            >
              Register as Vendor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/Vendor/Login"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 ${
                isHoverSecondary 
                  ? "bg-white text-gray-900 shadow-lg transform scale-105" 
                  : "bg-transparent border-2 border-white text-white shadow-md"
              }`}
              onMouseEnter={() => setIsHoverSecondary(true)}
              onMouseLeave={() => setIsHoverSecondary(false)}
            >
              Vendor Login
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Vendors Love 59Minutes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to scale your print business in one platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "👥",
              title: "Built-In Audience",
              description: "Access thousands of active buyers searching for unique prints daily.",
            },
            {
              icon: "💸",
              title: "Competitive Earnings",
              description: "Keep 80% of every sale with our straightforward 20% platform fee.",
            },
            {
              icon: "⏱️",
              title: "Fast Payouts",
              description: "Reliable bi-weekly payments via your preferred method.",
            },
            {
              icon: "📊",
              title: "Smart Dashboard",
              description: "Intuitive tools to manage products, orders, and inventory.",
            },
            {
              icon: "📈",
              title: "Performance Insights",
              description: "Real-time analytics to optimize your product offerings.",
            },
            {
              icon: "🛡️",
              title: "Risk Protection",
              description: "Secure transactions and dispute resolution support.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-100"
            >
              <span className="text-5xl mb-6 block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-50 py-20 px-4 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center bg-amber-100 text-amber-600 rounded-full w-12 h-12 text-xl">
                ❝
              </div>
              <div className="ml-4">
                <p className="font-bold text-gray-900">Sarah K.</p>
                <p className="text-gray-500">Print Vendor since 2022</p>
              </div>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              "59Minutes transformed my small print shop into a thriving business. The vendor tools make order management so simple, and I've tripled my sales in just six months."
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join hundreds of vendors growing their businesses with 59Minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/Vendor/Register"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 ${
                isHoverPrimary 
                  ? "bg-amber-400 text-gray-900 shadow-lg transform scale-105" 
                  : "bg-amber-500 text-gray-900 shadow-md"
              }`}
              onMouseEnter={() => setIsHoverPrimary(true)}
              onMouseLeave={() => setIsHoverPrimary(false)}
            >
              Get Started Today
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/vendor/login"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 ${
                isHoverSecondary 
                  ? "bg-white text-gray-900 shadow-lg transform scale-105" 
                  : "bg-transparent border-2 border-white text-white shadow-md"
              }`}
              onMouseEnter={() => setIsHoverSecondary(true)}
              onMouseLeave={() => setIsHoverSecondary(false)}
            >
              Existing Vendor Login
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">59Minutes Vendor Portal</h3>
              <p className="text-sm max-w-md">
                The complete solution for print vendors to manage and grow their business.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-6 mb-4">
                <Link href="/vendor/terms" className="hover:text-amber-400 transition-colors">
                  Terms
                </Link>
                <Link href="/vendor/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy
                </Link>
                <Link href="/vendor/contact" className="hover:text-amber-400 transition-colors">
                  Support
                </Link>
              </div>
              <p className="text-xx text-white">
                © {new Date().getFullYear()} 59Minutes. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}