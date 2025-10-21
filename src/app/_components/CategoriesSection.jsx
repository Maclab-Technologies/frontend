"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
// import products from "../../public/Products/products.json";
import CategoryCard from "./CategoryCard";
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (fetchAttempted.current) return;

    const fetchCategories = async () => {
      fetchAttempted.current = true;
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server responded with ${response.status}: ${errorText}`
          );
        }

        const json = await response.json();
        setCategories(json.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

 
  const retryFetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      fetchAttempted.current = false;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );

      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      setCategories(json.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Explore Our Print Categories
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            High-quality printing solutions for all your business and
            personal needs, delivered fast.
          </p>
        </div>

        {/* Categories Display */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-gray-800/50 text-center p-8 border border-red-500 rounded-lg max-w-lg mx-auto">
            <p className="text-red-400 mb-4">
              We couldn't load the categories at this time.
            </p>
            <button
              onClick={retryFetch}
              className="px-5 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-all shadow-lg hover:shadow-yellow-500/30"
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-400">
              No categories available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.name} 
                category={category} 
                index={index}
                // productCount={category.productCount || 0}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all text-black font-semibold rounded-md shadow-lg hover:shadow-yellow-500/40"
          >
            Explore All Print Products
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};



export default CategoriesSection;