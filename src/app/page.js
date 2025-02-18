"use client";

import "../app/globals.css";
import Image from "next/image";
import brandguy from "../../public/images/brandguy.png";



export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-screen">
        {/* Left Section: Image */}
        <div className="md:w-1/2 flex justify-center items-center p-8">
          <Image
            src={brandguy}
            alt="Delivery Person"
            className="max-w-md w-full rounded-lg"
            priority
          />
        </div>

        {/* Right Section: Text */}
        <div className="md:w-1/2 p-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            Welcome to <br />
            <span className="text-yellow-500">
              59 Minutes Print – Nigeria’s Fastest & Most Reliable Online Printing Service
            </span>
          </h1>
          <p className="mt-4 text-lg">
            Need high-quality prints in record time? We print and deliver orders in as fast as
            59 minutes.
          </p>
          <button className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-semibold">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Popular Categories Section */}

      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 [#726002] ">
          {[
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
          ].map((category) => (
            <div
              key={category}
              className="bg-yellow-700 hover:bg-yellow-600 text-center py-12 rounded-lg text-black font-semibold text-lg"
              style={{ height: "200px" }}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Advert Categories Section*/}
      <section>
        
      </section>

    </div>
  );
}
