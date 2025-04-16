'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import products from "../../../../public/Products/products.json";

export default function CategoriesPage() {
  const router = useRouter();
  
  // Get unique categories and count products in each
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const uniqueCategories = Object.keys(categoryCounts);

  return (
    <div className="bg-black min-h-screen p-6">
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueCategories.map((category) => (
          <div 
            key={category}
            className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
          >
            <Link href={`/Pages/Categories/${encodeURIComponent(category)}`}>
              {/* Space reserved for future category image */}
              <div className="h-48 w-full bg-yellow-400 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image coming soon</p>
                </div>
              </div>
              
              {/* Category Info Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
                  <p className="text-gray-200">{categoryCounts[category]} {categoryCounts[category] === 1 ? 'product' : 'products'}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Promotional Section */}
      <section className="bg-white py-16 mt-12 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Check out our Latest Promotions!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
          </p>
          <button
            onClick={() => router.push("/Products")}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}