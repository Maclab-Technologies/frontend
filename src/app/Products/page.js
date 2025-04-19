"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiFilter, FiX, FiShoppingCart } from "react-icons/fi";
import { FaSortAmountDown, FaTag } from "react-icons/fa";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", vendor: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/Products/products.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search, category, and vendor
  let displayProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category ? product.category === filters.category : true) &&
      (filters.vendor ? product.vendor === filters.vendor : true)
    );
  });

  // Sort products based on selected sort order
  if (sortOrder === "price-low") {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-high") {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  } else if (sortOrder === "name-asc") {
    displayProducts = [...displayProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "name-desc") {
    displayProducts = [...displayProducts].sort((a, b) => b.name.localeCompare(a.name));
  }

  // Build unique arrays for filtering options
  const categories = [...new Set(products.map((product) => product.category))];
  const vendors = [
    ...new Set(products.map((product) => product.vendor).filter((vendor) => vendor !== "N/A")),
  ];

  const resetFilters = () => {
    setFilters({ search: "", category: "", vendor: "" });
    setSortOrder("default");
  };

    const handleAddToCart = () => {
      if (!product) return;
      
      if (!designOption) {
        toast.warning("Please select a design option first", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }
    }
  

  // Loading and error states with better styling
  if (loading) return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg">Loading products...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
      <div className="bg-red-900/40 p-6 rounded-lg border border-red-500 text-white max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Header Section */}
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-yellow-900 to-yellow-500 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-yellow-400">Products</span>
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Discover our premium collection of high-quality prints and merchandise, all delivered within 59 minutes
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 shadow-xl">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 p-2 w-full bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle Button (Mobile) */}
            <button 
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <FiX /> Hide Filters
                </>
              ) : (
                <>
                  <FiFilter /> Show Filters
                </>
              )}
            </button>
            
            {/* Desktop Filters */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-3">
              <div className="flex items-center">
                <label className="mr-2 text-yellow-500">
                  <FaTag className="inline mr-1" /> Category:
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-yellow-500">
                  <FaSortAmountDown className="inline mr-1" /> Sort:
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-yellow-500">Vendor:</label>
                <select
                  value={filters.vendor}
                  onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Vendors</option>
                  {vendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={resetFilters} 
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Mobile Filters (Expandable) */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-gray-800 rounded-md space-y-4">
              <div>
                <label className="block mb-1 text-yellow-500">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-yellow-500">Vendor:</label>
                <select
                  value={filters.vendor}
                  onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                  className="p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">All Vendors</option>
                  {vendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-yellow-500">Sort By:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
              
              <button 
                onClick={resetFilters} 
                className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white">
            <span className="font-bold">{displayProducts.length}</span> Products Found
          </h2>
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <h3 className="text-xl text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={resetFilters}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => {
              const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
              const mainImage = imagesArray[0] || "/fallback-image.png";

              return (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-yellow-500/20 hover:translate-y-[-5px]"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                    />
                    {product.stock < 5 && product.stock > 0 && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1">
                        Low Stock
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-md">OUT OF STOCK</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="bg-yellow-500 text-black font-bold rounded px-2 py-1 text-sm">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-4">
                      <p className="mb-1">Category: {product.category}</p>
                      {product.color && <p className="mb-1">Color: {product.color}</p>}
                      <p>Available: {product.stock} in stock</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/Products/${product.id}`} className="flex-1">
                        <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                          Details
                        </button>
                      </Link>
                      
                      {/* <button 
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                        className={`flex items-center justify-center px-4 py-2 rounded-md transition ${
                          product.stock === 0 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-yellow-500 text-black hover:bg-yellow-400'
                        }`}
                      >
                        <FiShoppingCart className="mr-1" /> Buy
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}