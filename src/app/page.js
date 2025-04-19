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
  
  // Define categories manually with image URLs
  const categories = [
    { 
      id: 'business-cards', 
      name: 'Business Cards', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Professional cards for networking and brand representation'
    },
    { 
      id: 'flyers', 
      name: 'Flyers', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Eye-catching promotional materials for events and marketing'
    },
    { 
      id: 'brochures', 
      name: 'Brochures', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Informative multi-page materials for detailed product or service information'
    },
    { 
      id: 'posters', 
      name: 'Posters', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Large format prints for advertising and decoration'
    },
    { 
      id: 'stickers', 
      name: 'Stickers', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Adhesive designs for branding and personalization'
    },
    { 
      id: 'invitation-cards', 
      name: 'Invitation Cards', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Elegant cards for special events and occasions'
    },
    { 
      id: 'stationery', 
      name: 'Stationery', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Professional office supplies for business communication'
    },
    { 
      id: 'banners', 
      name: 'Banners', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Large displays for events and promotions'
    },
    { 
      id: 'apparel', 
      name: 'Apparel', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Custom printed clothing for teams and brands'
    },
    { 
      id: 'merchandise', 
      name: 'Merchandise', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Branded products for marketing and gifts'
    }
  ];

  // Count products in each category
  const categoryCounts = {};
  categories.forEach(category => {
    // Match product category case-insensitively
    const count = products.filter(product => 
      product.category.toLowerCase() === category.name.toLowerCase() ||
      product.category.toLowerCase() === category.id.toLowerCase()
    ).length;
    categoryCounts[category.id] = count;
  });
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
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/Pages/Categories/${encodeURIComponent(category.id)}`}
                  className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
                >
                  {/* Category Image */}
                  <div className="h-48 w-full bg-gray-700 relative">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  
                  {/* Category Info Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity group-hover:bg-opacity-60">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                      <p className="text-gray-200 text-sm mt-1">{category.description}</p>
                      <p className="text-yellow-400 mt-2">
                        {categoryCounts[category.id] || 0} {(categoryCounts[category.id] || 0) === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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