"use client";

import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Carousel from "../_components/Carousel";
import Hero from "../_components/Hero";
import WhatWeOffer from "../_components/WhatWeOffer";
import CategoriesSection from "../_components/CategoriesSection";
import Promotion from "../_components/Promotion";
import Feedback from "../_components/Feedback";
import WhyChooseUs from "../_components/WhyChooseUs";

export default function Home() {
  const router = useRouter();

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
      
      <Hero />
      <WhatWeOffer />
      <CategoriesSection />
      <Promotion />
      <Feedback />
      <WhyChooseUs />
    </div>
  );
}