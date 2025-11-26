<<<<<<< HEAD
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { get } from '@/app/_hooks/fetch-hook';
import LoadingErrorHandler from '@/app/_components/LoadingErrorHandler';

export default function CategoryProductsPage() {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const fetchAttempted = useRef(false);
  
  const router = useRouter();
  const params = useParams();
  const categoryName = params.category;
=======
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { get } from "@/app/_hooks/fetch-hook";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) {
      notFound();
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      const identifier = category.replace("%20", " ");
      
      try {
        const res = await get(`/categories/${identifier}`);

        if (!res.success) {
          setError(true);
          return;
        }

        setProducts(res.data?.data || []);
      } catch (error) {
        console.error("Internal error: ", error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);
>>>>>>> b763550786928ca24102b0c6ad774ef1b4c6b437

  const fetchCategoryData = async () => {
    if (fetchAttempted.current) return;
    
    fetchAttempted.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch category details
      const categoryResponse = await get(`/categories/name/${decodeURIComponent(categoryName)}`);
      
      if (!categoryResponse.success) {
        throw new Error(`Failed to fetch category: ${categoryResponse.data?.message || 'Category not found'}`);
      }

      const categoryData = categoryResponse.data;
      setCategory(categoryData);

      // Fetch products for this category
      const productsResponse = await get(`/products?category=${decodeURIComponent(categoryName)}`);
      
      if (productsResponse.success) {
        setProducts(productsResponse.data || []);
      } else {
        console.warn('Could not fetch products:', productsResponse.data?.message);
        setProducts([]);
      }

    } catch (error) {
      console.error('Error fetching category data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (categoryName && !fetchAttempted.current) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const retry = () => {
    fetchAttempted.current = false;
    setError(null);
    fetchCategoryData();
  };

  const handleProductClick = (productSlug) => {
    router.push(`/products/${productSlug}`);
  };

  if (isLoading || error) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="container mx-auto py-10 px-4">
          <LoadingErrorHandler 
            loading={isLoading} 
            error={error} 
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  if (!category) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="container mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link
            href="/categories"
            className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
            <div className="text-sm text-gray-400">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {category.imageUrl && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {category.name}
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                {category.description || `Explore our premium ${category.name} collection`}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {category.productCount || products.length} Products
                </div>
                {category.tags && category.tags.map((tag, index) => (
                  <div key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto py-12 px-4">
        {isLoadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
              <p className="text-gray-400 mb-6">
                There are no products in this category yet. Check back soon!
              </p>
              <Link
                href="/categories"
                className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
              >
                Browse Other Categories
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="text-white">
                <span className="text-gray-400">Showing </span>
                <span className="font-semibold">{products.length}</span>
                <span className="text-gray-400"> of {products.length} products</span>
              </div>
              
              <div className="flex gap-4">
                <select className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:border-yellow-500 focus:outline-none">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  onClick={() => handleProductClick(product.slug || product._id)}
                  className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {product.imageUrl || product.images?.[0] ? (
                      <Image
                        src={product.imageUrl || product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.shortDescription || product.description || 'No description available'}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-yellow-500 font-bold text-lg">
                        {product.price ? `$${product.price}` : 'Price on request'}
                      </div>
                      
                      {product.isPopular && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Product Features */}
                    {product.features && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related Categories */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Explore Related Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Business Cards', 'Flyers', 'Brochures', 'Posters'].map((relatedCategory) => (
              <Link
                key={relatedCategory}
                href={`/categories/${encodeURIComponent(relatedCategory)}`}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors group"
              >
                <div className="text-yellow-500 text-lg font-semibold group-hover:text-yellow-400 transition-colors">
                  {relatedCategory}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
=======
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Loading products for this category.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the products for this category. Please try again
            later.
          </p>
          <div className="flex justify-center">
            <Link
              href="/categories"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 py-16 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black capitalize mb-4">
              {category.replace("%20", " ")}
            </h1>
            <div className="h-1 w-20 bg-black mb-6"></div>
            <p className="text-gray-800 max-w-xl mx-auto">
              Explore our selection of high-quality {category.replace("%20", " ").toLowerCase()}{" "}
              products, designed to meet your every need with premium
              quality and fast delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {products.length}{" "}
            {products.length === 1 ? "Product" : "Products"} Found
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imagesArray = Array.isArray(product.images)
              ? product.images
              : [product.images];
            const mainImage = imagesArray[0] || "/fallback-image.png";
            const formattedPrice =
              typeof product.price === "string"
                ? product.price.replace(/\D/g, "")
                : product.price;
            const price = !isNaN(formattedPrice)
              ? parseFloat(formattedPrice).toLocaleString()
              : "0";

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                passHref
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative cursor-pointer">
                  <div className="w-full h-64 relative overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.png";
                      }}
                    />
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Vendor: {product.vendor || "Unknown"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span>Stock: {product.stock || 0}</span>
                    </div>
                    <div className="mt-auto pt-4">
                      <p className="text-xl font-bold text-yellow-600">
                        ₦{price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">
              No products found in this category.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
>>>>>>> b763550786928ca24102b0c6ad774ef1b4c6b437
    </div>
  );
}