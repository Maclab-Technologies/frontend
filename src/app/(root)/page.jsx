import Carousel from "../_components/Carousel";
import WhatWeOffer from "../_components/WhatWeOffer";
import CategoriesSection from "../_components/CategoriesSection";
import Promotion from "../_components/Promotion";
import Feedback from "../_components/Feedback";
import RoleSelection from "../_components/RoleSelection";

export const metadata = {
  title: 'Welcome to 59PinutesPrint'
}
export default function Home() {

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
