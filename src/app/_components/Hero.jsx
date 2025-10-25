"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import brandguy from "../../../public/images/brandguy.png";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between py-12 md:py-16 bg-black">
      {/* Left Section: Image */}
      <motion.div
        className="hidden md:flex md:w-1/2 justify-center p-6"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={brandguy}
          alt="Delivery Person"
          className="max-w-sm w-full rounded-lg"
          priority
        />
      </motion.div>

      {/* Right Section: Text */}
      <motion.div
        className="md:w-1/2 p-6 text-center md:text-left"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Welcome to{" "}
          <span className="text-yellow-400">59 Minutes Print</span>
        </h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Nigeria's fastest and most reliable online printing service. 
          We specialize in high-quality prints with lightning-fast delivery - 
          get your orders printed and delivered in just 59 minutes!
        </p>
        
        <p className="mt-3 text-gray-400 text-sm">
          Whether you're a business looking to sell printing services or a customer 
          needing quick prints, we've got you covered with our seamless platform.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={() => router.push("/vendor/register")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-black font-semibold transition-colors flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started as Vendor
          </motion.button>
          
          <motion.button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg font-semibold transition-colors flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started as Customer
          </motion.button>
        </div>

        <p className="mt-4 text-white text-xs">
          Join thousands of vendors and customers already using our platform
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;