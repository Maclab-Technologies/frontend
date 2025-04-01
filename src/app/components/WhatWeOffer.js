import { motion } from "framer-motion";
import { FaPaintBrush, FaFileUpload, FaShoppingCart, FaPrint } from "react-icons/fa";

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
  return (
    <section className="py-20 bg-gray-900 text-white">
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

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-gray-400 text-sm text-center">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeOffer;
