'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAttempted = useRef(false);

  const fetchCategories = async () => {
    fetchAttempted.current = true;
    setIsLoading(true);

    try {

      const controller = new AbortController();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      setCategories(json.data || []);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchAttempted.current) {
      fetchCategories();
    }
  }, []);

  const retry = () => {
    fetchAttempted.current = false;
    setError(null);
    fetchCategories();
  };

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Explore Our Categories</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
          <p className="text-white mt-4 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium print categories designed to meet your specific needs.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-400">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/Pages/Categories/${encodeURIComponent(category.name)}`}
                className="group relative rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-1 bg-white flex flex-col"
              >
                <div className="h-56 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name || 'Category image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{category.name || 'Unnamed Category'}</h2>
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {category.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 rounded-xl transition-colors duration-300 pointer-events-none z-10"></div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/Products"
            className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition-colors text-black font-medium rounded-full"
          >
            View All Categories
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <section className="bg-white py-16 mt-12 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Check out our Latest Promotions!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
          </p>
          <button
            onClick={() => router.push('/Products')}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}
