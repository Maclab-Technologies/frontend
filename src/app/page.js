"use client";

import "../app/globals.css";
import Image from "next/image";
import brandguy from "../../public/images/brandguy.png";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-screen">
        {/* Left Section: Image */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center p-8">
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
          <button  onClick={() => router.push("/Auth/Register")} className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-semibold">
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
              className="bg-[#726002] hover:bg-yellow-600 text-center py-16 rounded-lg text-black font-semibold text-lg flex items-center justify-center shadow-lg"
              style={{ height: "250px" }}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Advert Categories Section*/}
      <section className="bg-white h-[300px] flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Check out our Latest Promotions!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Shop Now
          </button>
        </div>
      </section>

      {/* Other Categries */}
      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
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
          ].map((category) => (
            <div
              key={category}
              className="bg-[#726002] hover:bg-yellow-600 text-center py-16 rounded-lg text-black font-semibold text-lg flex items-center justify-center shadow-lg"
              style={{ height: "250px" }}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="bg-black text-white px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Feedback Section */}
          <div>
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2 rounded-md mb-8">Feedback</h2>
            <form className="space-y-6">
              {/* First Name and Last Name Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Firstname</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2  rounded-lg text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Lastname</label>
                  <input
                    type="text"
                    placeholder="Last Name "
                    className="w-full px-4 py-2  rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2  rounded-lg text-white"
                />
              </div>

              {/* Label Text Area */}
              <div>
                <label className="block mb-2 font-semibold">Message</label>
                <textarea
                  placeholder="Message"
                  className="w-full px-4 py-2  rounded-lg text-white h-32"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600"
              >
                Send Feedback
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2  mb-8">FAQ</h2>
            <div className="space-y-4">
              <p>Figma ipsum component variant main layer.</p>
              <p>Pen draft text object clip mask flows main prototype component.</p>
              <p>Undo hand fig jam asset text opacity horizontal effect.</p>
              <p>Resizing duplicate arrow scrolling arrow.</p>
              <p>Move thumbnail union flatten component team resizing vector.</p>
              <p>Scale frame vertical link layout clip inspect library.</p>
              <p>Align component polygon bullet flows flow's font device line.</p>
            </div>
          </div>
        </div>
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
