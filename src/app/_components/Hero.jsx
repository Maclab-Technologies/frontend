"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import brandguy from "../../../public/images/brandguy.png";

const Hero = () => {
  const router = useRouter();

  return (
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
            59 Minutes Print – Nigeria's Fastest & Most Reliable Online
            Printing Service
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          Need high-quality prints in record time? We print and deliver
          orders in as fast as 59 minutes.
        </p>
        <motion.button
          onClick={() => router.push("/register")}
          className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;