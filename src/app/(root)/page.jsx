"use client";

import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion"; // Import motion from framer-motion
import Image from "next/image"; // Import Image from next/image

// Components
import Carousel from "../_components/Carousel";
import Hero from "../_components/Hero";
import WhatWeOffer from "../_components/WhatWeOffer";
import CategoriesSection from "../_components/CategoriesSection";
import Promotion from "../_components/Promotion";
import Feedback from "../_components/Feedback";
import RoleSelection from "../_components/RoleSelection";
import products from "../../../public/Products/products.json";
import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Import Link

// You'll need to import or define the brandguy image
// import brandguy from "../../../public/images/brandguy.jpg"; // Uncomment and adjust path

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchAttempted = useRef(false);

  // You'll need to implement the data fetching logic or remove it if not needed
  useEffect(() => {
    // Your data fetching logic here
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Carousel />

      {/* What We Offer Section */}
      <section>
        <WhatWeOffer />
      </section>

      <CategoriesSection />

      {/* Promotion Section */}
      <section>
        <Promotion />
      </section>
      <RoleSelection />
      {/* Feedback Section */}
      <section>
        <Feedback />
      </section>
    </div>
  );
}
