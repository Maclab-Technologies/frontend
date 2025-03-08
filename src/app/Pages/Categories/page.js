"use client";

import { useRouter } from "next/navigation";

const popularCategories = [
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
];

const otherCategories = [
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
];

export default function CategoriesPage() {
  const router = useRouter();

  const handleCategoryClick = (category) => {
    // Navigate to the dynamic category route
    router.push(`/Pages/Categories/${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-yellow-500 h-50 text-black font-semibold p-4 rounded-lg text-center hover:bg-yellow-600 transition cursor-pointer"
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-gray-700 h-50 text-white font-semibold p-4 rounded-lg text-center hover:bg-gray-600 transition cursor-pointer"
              >
                {category}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
