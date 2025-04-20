'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import productData from "../../../../public/Products/products.json";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API URL - using an environment variable in client components requires special setup
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/category`);
        
        // Process the data
        setCategories(response.data);
        
        // Calculate category counts
        const counts = {};
        response.data.forEach(category => {
          // Match product category case-insensitively
          const count = productData.filter(product => 
            product.category?.toLowerCase() === category.name?.toLowerCase() ||
            product.category?.toString() === category._id?.toString()
          ).length;
          
          counts[category._id] = count;
        });
        
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-yellow-500 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
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
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category._id}
              href={`/Pages/Categories/${encodeURIComponent(category.name)}`}
              className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
            >
              {/* Category Image */}
              <div className="h-48 w-full bg-gray-700 relative">
                <Image
                  src={category.imageUrl || '/images/placeholder.png'}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </div>
              
              {/* Category Info Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity group-hover:bg-opacity-60">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                  <p className="text-gray-200 text-sm mt-1">{category.description || 'Explore our products in this category'}</p>
                  <p className="text-yellow-400 mt-2">
                    {categoryCounts[category._id] || 0} {(categoryCounts[category._id] || 0) === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No categories found</p>
        </div>
      )}

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