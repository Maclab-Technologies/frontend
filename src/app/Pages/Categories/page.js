"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Category UI component
const CategoryItem = ({ name, count }) => (
  <Link
    href={`/Category/${name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
    className="bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-center p-6 rounded-xl text-black font-bold text-lg flex flex-col items-center justify-center shadow-lg transition-all duration-300 h-48 hover:scale-105"
  >
    <span className="text-2xl capitalize">{name}</span>
    {count > 0 && (
      <span className="mt-2 bg-black text-yellow-400 text-sm px-3 py-1 rounded-full">
        {count} products
      </span>
    )}
  </Link>
);

export default function CategoriesPage() {
  const [popularCategories, setPopularCategories] = useState([]);
  const [otherCategories, setOtherCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch products data
        const response = await fetch('/Products/products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Count products per category
        const categoryCount = {};
        data.forEach((item) => {
          const cat = item.category?.trim();
          if (cat) {
            const normalizedCat = cat.toLowerCase();
            categoryCount[normalizedCat] = (categoryCount[normalizedCat] || 0) + 1;
          }
        });

        // Convert to array and sort by product count
        const sortedCategories = Object.entries(categoryCount)
          .map(([name, count]) => ({
            name: name.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            count
          }))
          .sort((a, b) => b.count - a.count);

        // Split into popular (top 8) and other categories
        const top = sortedCategories.slice(0, 8);
        const rest = sortedCategories.slice(8);
        
        setPopularCategories(top);
        setOtherCategories(rest);
      } catch (err) {
        console.error("Error loading categories:", err);
        // Fallback to some default categories if fetch fails
        setPopularCategories([
          { name: "Business Cards", count: 2 },
          { name: "Flyers", count: 1 },
          { name: "Brochures", count: 1 },
          { name: "Posters", count: 1 }
        ]);
        setOtherCategories([
          { name: "Stickers", count: 1 },
          { name: "Invitation Cards", count: 2 },
          { name: "Stationery", count: 2 },
          { name: "Banners", count: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Our Product Categories
        </h1>

        {/* Popular Categories Section */}
        <section className="px-8 py-16 bg-gradient-to-b from-black to-gray-900 rounded-xl mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <CategoryItem 
                key={category.name} 
                name={category.name} 
                count={category.count} 
              />
            ))}
          </div>
        </section>

        {/* Promo Section */}
        <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16 rounded-xl mb-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-black mb-4">
              Check out our Latest Promotions!
            </h2>
            <p className="text-lg text-black mb-8">
              Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
            </p>
            <button
              onClick={() => router.push("/Products")}
              className="px-8 py-3 bg-black text-yellow-500 font-bold rounded-full hover:bg-gray-900 transition duration-300 shadow-lg hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* Other Categories */}
        <section className="px-8 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">
            All Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...popularCategories, ...otherCategories].map((category) => (
              <CategoryItem 
                key={category.name} 
                name={category.name} 
                count={category.count} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}