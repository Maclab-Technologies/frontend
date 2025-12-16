"use client"

import { motion } from "framer-motion";
import { FaPaintBrush, FaFileUpload, FaShoppingCart, FaPrint } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const services = [
  {
    title: "Custom Design Services",
    icon: <FaPaintBrush className="text-yellow-400 text-5xl" />,
    description: "Hire professional designers to bring your ideas to life with precision and creativity.",
  },
  {
    title: "Upload & Edit Designs",
    icon: <FaFileUpload className="text-yellow-400 text-5xl" />,
    description: "Easily upload your artwork or customize it with our online editor before printing.",
  },
  {
    title: "Seamless Ordering",
    icon: <FaShoppingCart className="text-yellow-400 text-5xl" />,
    description: "Place orders quickly and track progress in real-time from your dashboard.",
  },
  {
    title: "High-Quality Printing",
    icon: <FaPrint className="text-yellow-400 text-5xl" />,
    description: "We ensure top-notch printing quality with fast turnaround times.",
  },
];

const WhatWeOffer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-16 bg-gray-900 text-white overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold mb-6 text-yellow-400">What We Offer</h2>
        <p className="text-gray-300 mb-12 text-lg">
          Experience the best online printing service with fast, high-quality results.
        </p>
      </motion.div>

      {/* Mobile Slider */}
      <div className="md:hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {services.map((service, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <motion.div
                    className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-2xl min-h-[300px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-center text-white">{service.title}</h3>
                    <p className="text-white text-sm text-center leading-relaxed">{service.description}</p>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors z-10"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors z-10"
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-2xl min-h-[280px]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-center text-white">{service.title}</h3>
              <p className="text-white text-sm text-center leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden text-center mt-6">
        <p className="text-gray-400 text-sm">Swipe or use arrows to navigate</p>
      </div>
    </section>
  );
};

export default WhatWeOffer;