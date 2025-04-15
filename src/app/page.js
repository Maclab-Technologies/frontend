"use client";

import "../app/globals.css";
import Image from "next/image";
import brandguy from "../../public/images/brandguy.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WhatWeOffer from "../app/components/WhatWeOffer";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Feedback from "../app/components/Feedback"

export default function Home() {
  const router = useRouter();

  // Categories data to avoid repetition
  const popularCategories = [
    "Bags",
    "Banners & Large Format",
    "Brochures",
    "Business Cards",
    "Calendars",
    "Campaign Materials",
    "Caps & Hats",
    "Clothing & Apparel",
    "Frames & Wall Arts",
    "Flyers & Handbills",
    "ID Cards",
    "Labels",
  ];

  const otherCategories = [
    "Flyers & Handbills",
    "Frames & Wall Arts",
    "Greeting Cards",
    "ID Cards",
    "Labels",
    "Letterhead",
    "Mugs",
    "Notepads and Jotters",
    "Posters",
    "Presentation Folders",
    "Promotional Items",
    "Stickers",
    "Umbrella",
    "Wedding Stationery",
  ];




  // Category component to avoid duplication
  const CategoryItem = ({ name }) => (
    <Link
      href={`/categories/${name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
      className="bg-yellow-400 hover:bg-yellow-600 text-center py-8 rounded-lg text-black font-semibold text-lg flex items-center justify-center shadow-lg transition-colors duration-300 h-48"
    >
      {name}
    </Link>
  );
  

  return (
    <div className="bg-black text-white min-h-screen">
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

      <section>

        <WhatWeOffer />

      </section>

      {/* Popular Categories Section */}
      <section className="px-8 py-16 bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularCategories.map((category) => (
            <CategoryItem key={category} name={category} />
          ))}
        </div>
      </section>

      {/* Advert Categories Section */}
      <section className="bg-white py-16">
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

      {/* Other Categories */}
      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {otherCategories.map((category) => (
            <CategoryItem key={category} name={category} />
          ))}
        </div>
      </section>


<section>
  <Feedback />
</section>
      

      {/* Why You Choose Us Section */}
      <section className="bg-black text-white px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Get High-Quality Prints Delivered in Record Time!
          </h2>
          <p className="text-gray-300">
            Need fast, top-quality prints for your business or event? We’ve got you
            covered! From corporate branding materials to event banners, we print and
            deliver with speed and precision. With our 59-minute express service
            available in select cities, you never have to miss a deadline again!
          </p>
        </div>

        {/* "Why Choose Us?" Button */}
        <div className="text-center mb-12">
          <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md">
            Why Choose Us?
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
          {/* Lightning-Fast Delivery */}
          <div className=" flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">🚚</span>
            <h3 className="font-bold text-lg mb-2">Lightning-Fast Delivery</h3>
            <p className="text-gray-300">
              Get select prints in as fast as 59 minutes Anywhere in Nigeria .
            </p>
          </div>

          {/* Affordable & Transparent Pricing */}
          <div className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">💰</span>
            <h3 className="font-bold text-lg mb-2">Affordable & Transparent Pricing</h3>
            <p className="text-gray-300">
              No hidden charges. Get premium prints without breaking the bank.
            </p>
          </div>

          {/* Premium Quality Guaranteed */}
          <div className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">🏆</span>
            <h3 className="font-bold text-lg mb-2">Premium Quality Guaranteed</h3>
            <p className="text-gray-300">
              Sharp, vibrant, and professional-grade prints for all your needs.
            </p>
          </div>

          {/* Bulk & Custom Orders */}
          <div className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">📦</span>
            <h3 className="font-bold text-lg mb-2">Bulk & Custom Orders</h3>
            <p className="text-gray-300">
              Whether you need one print or thousands, we handle it all seamlessly.
            </p>
          </div>

          {/* Hassle-Free Online Ordering */}
          <div className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">🛒</span>
            <h3 className="font-bold text-lg mb-2">Hassle-Free Online Ordering</h3>
            <p className="text-gray-300">
              Order from anywhere and get it delivered to your doorstep.
            </p>
          </div>

          {/* Eco-Friendly Printing */}
          <div className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6">
            <span className="text-yellow-500 text-5xl mb-4">🌱</span>
            <h3 className="font-bold text-lg mb-2">Eco-Friendly Printing</h3>
            <p className="text-gray-300">
              We use sustainable materials and eco-friendly processes for a greener planet.
            </p>
          </div>
        </div>
      </section>



    </div>
  );
}
