'use client';

import "../app/globals.css";
import Image from "next/image";
import brandguy from "../../public/images/brandguy.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WhatWeOffer from "../app/components/WhatWeOffer";
import { motion } from "framer-motion";
import Feedback from "../app/components/Feedback";
import Carousel from "../app/components/Carousel"
import products from "../../public/Products/products.json";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (fetchAttempted.current) return;

    const fetchCategories = async () => {
      fetchAttempted.current = true;
      setIsLoading(true);

      try {
        const controller = new AbortController();
        // const timeoutId = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          signal: controller.signal,
        });

        // clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const json = await response.json();
        setCategories(json.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        if (error.name === "AbortError") {
          toast.error("Request timed out. Server may be slow to respond.");
        } else if (error.message.includes("Failed to fetch")) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error("Failed to load categories. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories(); // ✅ <-- this was missing
  }, []);


  // Count products in each category - moved this logic into a useMemo to avoid recalculation
  const categoryCounts = {};
  if (categories.length > 0) {
    categories.forEach(category => {
      if (!category || !category.id) return;

      // Match product category case-insensitively
      const count = products.filter(product =>
        product.category && (
          product.category.toLowerCase() === (category.name || '').toLowerCase() ||
          product.category.toLowerCase() === category.id.toLowerCase()
        )
      ).length;
      categoryCounts[category.id] = count;
    });
  }

  return (
    <div className="bg-black text-white min-h-screen">


      <Carousel />


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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

      {/* Popular Categories Section - Professionally Redesigned */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Explore Our Print Categories</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              High-quality printing solutions for all your business and personal needs, delivered fast.
            </p>
          </div>

          {/* Categories Display */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="bg-gray-800/50 text-center p-8 border border-red-500 rounded-lg max-w-lg mx-auto">
              <p className="text-red-400 mb-4">We couldn't load the categories at this time.</p>
              <button
                onClick={() => {
                  fetchAttempted.current = false;
                  setError(null);

                  const retryFetch = async () => {
                    try {
                      setIsLoading(true);
                      const controller = new AbortController();
                      const response = await fetch(`https://five9minutes-backend.onrender.com/api/category`, {
                        signal: controller.signal,
                      });

                      if (!response.ok) throw new Error("Failed to fetch");
                      const json = await response.json();
                      setCategories(json.data);
                      setError(null);
                    } catch (error) {
                      setError(error.message);
                      toast.error("Failed to reload. Please try again later.");
                    } finally {
                      setIsLoading(false);
                    }
                  };

                  retryFetch();
                }}
                className="px-5 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-all shadow-lg hover:shadow-yellow-500/30"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-400">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/Pages/Categories/${encodeURIComponent(category.name)}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative"
                >
                  {/* Popular Badge - showing for first 3 items (you can adjust logic as needed) */}
                  {index < 5 && (
                    <div className="absolute top-0 left-0 z-20">
                      <div className="bg-red-600 text-white text-xs font-bold px-4 py-1 transform rotate-0 origin-top-left flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        POPULAR
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name || 'Category image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}

                    {/* Category Count Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black font-semibold text-sm px-3 py-1 rounded-full shadow-md z-10">
                      {categoryCounts[category.name] || 0} {(categoryCounts[category.name] || 0) === 1 ? 'product' : 'products'}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                      {category.name || 'Unnamed Category'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {category.description || 'No description available'}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-yellow-600 font-medium text-sm group-hover:underline">
                        Browse Products
                      </span>
                      <svg className="w-5 h-5 text-yellow-600 transform group-hover:translate-x-1 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/Products"
              className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all text-black font-semibold rounded-md shadow-lg hover:shadow-yellow-500/40"
            >
              Explore All Print Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
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