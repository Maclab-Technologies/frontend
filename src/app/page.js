'use client';

import "../app/globals.css";
import Image from "next/image";
import brandguy from "../../public/images/brandguy.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WhatWeOffer from "../app/components/WhatWeOffer";
import { motion } from "framer-motion";
import Feedback from "../app/components/Feedback";
import products from "../../public/Products/products.json";

export default function Home() {
  const router = useRouter();

  // Get unique categories and count products in each
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const uniqueCategories = Object.keys(categoryCounts);

  // Split categories into popular and others (you can adjust this logic)
  const popularCategories = uniqueCategories.slice(0, 8); // First 8 as popular
  const otherCategories = uniqueCategories.slice(8); // Rest as other categories

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-16 md:py-24 md:min-h-screen">
        {/* Left Section: Image */}
        <motion.div
          className="hidden md:flex md:w-1/2 justify-center items-center p-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src={brandguy}
            alt="Delivery Person"
            className="max-w-md w-full rounded-lg shadow-xl"
            priority
          />
        </motion.div>

        {/* Right Section: Text */}
        <motion.div
          className="md:w-1/2 p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <br />
            <span className="text-yellow-500">
              59 Minutes Print – Nigeria's Fastest & Most Reliable Online Printing Service
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Need high-quality prints in record time? We print and deliver orders in as fast as
            59 minutes.
          </p>
          <motion.button
            onClick={() => router.push("/Auth/Register")}
            className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>

      {/* What We Offer Section */}
      <section>
        <WhatWeOffer />
      </section>

      {/* Popular Categories Section */}
      <section className="px-8 py-16 bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularCategories.map((category) => (
            <div 
              key={category}
              className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
            >
              <Link href={`/Pages/Categories/${encodeURIComponent(category)}`}>
                {/* Space reserved for future category image */}
                <div className="h-48 w-full bg-yellow-400 flex items-center justify-center">
                  <div className="text-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Image coming soon</p>
                  </div>
                </div>
                
                {/* Category Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
                    <p className="text-gray-200">{categoryCounts[category]} {categoryCounts[category] === 1 ? 'product' : 'products'}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Section */}
      <section className="bg-white py-16 mt-12 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Check out our Latest Promotions!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
          </p>
          <button
            onClick={() => router.push("/Products")}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Other Categories Section */}
      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Other Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherCategories.map((category) => (
            <div 
              key={category}
              className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
            >
              <Link href={`/Pages/Categories/${encodeURIComponent(category)}`}>
                {/* Space reserved for future category image */}
                <div className="h-48 w-full bg-yellow-400 flex items-center justify-center">
                  <div className="text-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Image coming soon</p>
                  </div>
                </div>
                
                {/* Category Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
                    <p className="text-gray-200">{categoryCounts[category]} {categoryCounts[category] === 1 ? 'product' : 'products'}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section>
        <Feedback />
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-black text-white px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Get High-Quality Prints Delivered in Record Time!
          </h2>
          <p className="text-gray-300">
            Need fast, top-quality prints for your business or event? We've got you
            covered! From corporate branding materials to event banners, we print and
            deliver with speed and precision.
          </p>
        </div>

        <div className="text-center mb-12">
          <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md">
            Why Choose Us?
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
          {[
            {
              icon: "🚚",
              title: "Lightning-Fast Delivery",
              description: "Get select prints in as fast as 59 minutes Anywhere in Nigeria."
            },
            {
              icon: "💰",
              title: "Affordable & Transparent Pricing",
              description: "No hidden charges. Get premium prints without breaking the bank."
            },
            {
              icon: "🏆",
              title: "Premium Quality Guaranteed",
              description: "Sharp, vibrant, and professional-grade prints for all your needs."
            },
            {
              icon: "📦",
              title: "Bulk & Custom Orders",
              description: "Whether you need one print or thousands, we handle it all seamlessly."
            },
            {
              icon: "🛒",
              title: "Hassle-Free Online Ordering",
              description: "Order from anywhere and get it delivered to your doorstep."
            },
            {
              icon: "🌱",
              title: "Eco-Friendly Printing",
              description: "We use sustainable materials and eco-friendly processes for a greener planet."
            }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
              <span className="text-yellow-500 text-5xl mb-4">{feature.icon}</span>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}