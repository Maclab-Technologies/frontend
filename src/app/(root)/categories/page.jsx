'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { get } from '@/app/_hooks/fetch-hook';
import LoadingErrorHandler from '@/app/_components/LoadingErrorHandler';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchAttempted = useRef(false);
  const router = useRouter();

  const fetchCategories = async () => {
    fetchAttempted.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await get("/categories");

      console.log('API Response:', response);

      if (!response.success) {
        const errorText = response.data?.message || 'Unknown error';
        throw new Error(`Failed to fetch categories: ${errorText}`);
      }

      let categoriesData = [];
      
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      } else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      } else {
        console.warn('Unexpected API response structure:', response);
        categoriesData = [];
      }

      console.log('Extracted categories:', categoriesData);
      setCategories(categoriesData);

    } catch (error) {
      console.error('Error fetching categories:', error);
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
    fetchCategories();
  };

  const handleShopNow = () => {
    router.push('/products');
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe rendering of categories
  const renderCategories = () => {
    if (!Array.isArray(filteredCategories) || filteredCategories.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-gray-800/30 rounded-2xl p-12 max-w-md mx-auto border border-gray-700/50">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No Categories Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No categories available at the moment'}
            </p>
            <button
              onClick={retry}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
            >
              Refresh Categories
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCategories.map((category, index) => {
          if (!category || typeof category !== 'object') {
            console.warn('Invalid category data:', category);
            return null;
          }

          const productCount = category.productCount || category.count || 0;
          const categoryName = category.name || 'Unnamed Category';
          const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));

          return (
            <Link
              key={category._id || category.id || categoryName || `category-${index}`}
              href={`/categories/${categorySlug}`}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700/50 hover:border-yellow-500/30"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                {category.imageUrl || category.image ? (
                  <Image
                    src={category.imageUrl || category.image}
                    alt={categoryName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback when no image or image fails to load */}
                <div 
                  className={`w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ${category.imageUrl || category.image ? 'hidden' : 'flex'}`}
                >
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Product Count Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-sm px-4 py-2 rounded-full shadow-lg z-20 backdrop-blur-sm">
                  {productCount} {productCount === 1 ? "item" : "items"}
                </div>

                {/* Popular Badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 backdrop-blur-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    TRENDING
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative p-6 z-10">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-1">
                  {categoryName}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {category.description || 'Explore our premium collection of quality products and services.'}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold text-sm group-hover:underline transition-all">
                    Browse Collection
                  </span>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:bg-yellow-400 transition-all duration-300">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-500 pointer-events-none"></div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-8">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-yellow-400 font-semibold text-sm">Premium Print Categories</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Our
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"> Collections</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore our carefully curated selection of premium print categories, designed to bring your ideas to life with exceptional quality.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all duration-300"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured <span className="text-yellow-400">Categories</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Browse through our specialized categories to find exactly what you need for your next project
            </p>
          </div>

          {isLoading || error ? (
            <LoadingErrorHandler 
              loading={isLoading} 
              error={error} 
              onRetry={retry}
            />
          ) : (
            renderCategories()
          )}

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-gray-300 mb-8 text-lg">
                Explore our complete product catalog and find everything you need in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-2xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1"
                >
                  View All Products
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  onClick={handleShopNow}
                  className="inline-flex items-center px-8 py-4 bg-gray-700/50 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-gray-600/50 border border-gray-600/50 transition-all duration-300"
                >
                  Latest Offers
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}