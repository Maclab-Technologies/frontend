"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiFilter, FiX, FiShoppingCart, FiRefreshCw } from "react-icons/fi";
import { FaSortAmountDown, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

// Utility function to validate product data
const validateProduct = (product) => {
  if (!product) return null;
  
  return {
    _id: product._id || Math.random().toString(36).substring(2, 9),
    id: product._id || Math.random().toString(36).substring(2, 9),
    name: product.name || "Unnamed Product",
    description: product.description || "",
    price: product.price || 0,
    category: product.category || "Uncategorized",
    vendor: product.vendor || "Unknown",
    images: Array.isArray(product.images) ? product.images : 
            product.image ? [product.image] : 
            ["/fallback-image.png"],
    stock: typeof product.stock === 'number' ? product.stock : 0,
    status: product.status || "unknown",
    // Add other necessary fields with defaults
    ...product
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", vendor: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache key constant
  const cacheKey = 'products-cache';

  // Fetch products with caching
  const fetchProducts = useCallback(async () => {
    try {
      const now = Date.now();
      const cachedData = localStorage.getItem(cacheKey);
      const cacheExpiry = localStorage.getItem(`${cacheKey}-expiry`);

      // Use cache if valid
      if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
        const parsedData = JSON.parse(cachedData);
        setProducts(parsedData);
        setLoading(false);
        return;
      }

      const response = await fetch(`https://five9minutes-backend.onrender.com/api/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Validate and normalize products data
      const productArray = Array.isArray(responseData?.data?.products) 
        ? responseData.data.products.map(validateProduct).filter(Boolean)
        : [];
      
      console.log('Fetched products:', productArray);
      setProducts(productArray);
      
      // Cache handling
      localStorage.setItem(cacheKey, JSON.stringify(productArray));
      localStorage.setItem(`${cacheKey}-expiry`, String(now + 300000));
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProducts([]); // Ensure products is always an array
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((searchValue) => {
      setFilters(prev => ({ ...prev, search: searchValue }));
    }, 300),
    []
  );

  useEffect(() => {
    fetchProducts();
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [fetchProducts, debouncedSearch]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter((product) => {
      if (!product) return false;
      
      const matchesSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
                          product.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesVendor = !filters.vendor || product.vendor === filters.vendor;
      
      return matchesSearch && matchesCategory && matchesVendor;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    
    switch (sortOrder) {
      case "price-low":
        return productsToSort.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return productsToSort.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":
        return productsToSort.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return productsToSort.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortOrder]);

  // Unique categories and vendors
  const [categories, vendors] = useMemo(() => {
    if (!Array.isArray(products)) return [[], []];
    
    const uniqueCategories = [...new Set(
      products
        .filter(p => p?.category)
        .map(p => p.category)
        .filter(Boolean)
    )];
    
    const uniqueVendors = [...new Set(
      products
        .filter(p => p?.vendor)
        .map(p => p.vendor)
        .filter(Boolean)
    )];
    
    return [uniqueCategories, uniqueVendors];
  }, [products]);

  const resetFilters = () => {
    setFilters({ search: "", category: "", vendor: "" });
    setSortOrder("default");
    toast.info("Filters reset", { position: "top-center", autoClose: 1500 });
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    
    toast.success(`Added ${product.name} to cart`, {
      position: "top-center",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}-expiry`);
    fetchProducts();
  }, [fetchProducts]);

  if (loading && !isRefreshing) return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* ... keep your existing loading skeleton ... */}
    </div>
  );
  
  if (error) return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
      {/* ... keep your existing error display ... */}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* ... keep your existing header section ... */}

      {/* ... keep your existing search and filter bar ... */}

      {/* Results Count */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white">
            Showing <span className="font-bold">{sortedProducts.length}</span> of <span className="font-bold">{products.length}</span> Products
          </h2>
          
          {isRefreshing && (
            <div className="flex items-center gap-2 text-yellow-400">
              <FiRefreshCw className="animate-spin" />
              <span>Refreshing data...</span>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
            <h3 className="text-xl text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={resetFilters}
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition"
              >
                Clear Filters
              </button>
              <button 
                onClick={refreshData}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition flex items-center gap-1"
              >
                <FiRefreshCw /> Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              if (!product) return null;
              
              const mainImage = product.images?.[0] || "/fallback-image.png";

              return (
                <div
                  key={product._id || product.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-yellow-500/20 hover:translate-y-[-5px] group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <Image
                      src={mainImage}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      // onError={(e) => {
                      //   e.currentTarget.src = "/fallback-image.png";
                      // }}
                    />
                    {product.stock < 5 && product.stock > 0 && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1">
                        Only {product.stock} left!
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
                      <span className="bg-yellow-500 text-black font-bold rounded px-2 py-1 text-sm whitespace-nowrap">
                        ₦{(product.price || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-4 space-y-1">
                      <p className="truncate">Category: {product.category}</p>
                      <p className={product.stock > 5 ? "text-green-400" : product.stock > 0 ? "text-orange-400" : "text-red-400"}>
                        {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        href={`/products/${product._id || product.id}`} 
                        className="flex-1 transition hover:opacity-90"
                        passHref
                      >
                        <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                          Details
                        </button>
                      </Link>
                      
                      <button 
                        disabled={product.stock === 0}
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center justify-center px-4 py-2 rounded-md transition ${
                          product.stock === 0 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-yellow-500 text-black hover:bg-yellow-400'
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <FiShoppingCart className="mr-1" /> Buy
                      </button>
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