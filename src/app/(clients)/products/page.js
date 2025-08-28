"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiShoppingCart,
  FiRefreshCw,
} from "react-icons/fi";
import { FaSortAmountDown, FaTag } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";

// Utility function to validate product data
const validateProduct = (product) => {
  if (!product) return null;

  // Ensure product has a valid ID
  const productId = product.id || "unknown-id";

  // Handle category which might be an object or string
  const category =
    typeof product.category === "object" && product.category
      ? String(product.category.name || "Uncategorized")
      : String(product.category || "Uncategorized");
  const vendor =
    typeof product.vendor === "object" && product.vendor
      ? String(product.vendor.businessName || "Unknown vendor")
      : String(product.vendor || "unknown vendor");
  return {
    _id: productId,
    id: productId,
    name: String(product.name || "Unnamed Product"),
    description: String(product.description || ""),
    price: typeof product.price === "number" ? product.price : 0,
    category: category,
    vendor: vendor,
    images: Array.isArray(product.images)
      ? product.images.filter((img) => typeof img === "string")
      : typeof product.image === "string"
        ? [product.image]
        : ["/fallback-image.png"],
    minOrder: typeof product.minOrder === "number" ? product.minOrder : 1,
    status: String(product.status || "unknown"),
    discountPrice: Number(product.discountPrice || 0),
    discountPercent: Number(product.discountPercent || 0),
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    vendor: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache key constant
  const cacheKey = "products-cache";

  // Fetch products with caching
  const fetchProducts = useCallback(async () => {
    try {
      const now = Date.now();
      let cachedData;
      let cacheExpiry;

      // Safely check localStorage (it may not be available in SSR)
      if (typeof window !== "undefined") {
        try {
          cachedData = localStorage.getItem(cacheKey);
          cacheExpiry = localStorage.getItem(`${cacheKey}-expiry`);
        } catch (e) {
          console.error("Error accessing localStorage:", e);
        }
      }

      // Use cache if valid
      if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setProducts(parsedData);
            setLoading(false);
            return;
          }
        } catch (cacheError) {
          console.error("Cache parsing error:", cacheError);
          // Continue to fetch fresh data
        }
      }

      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

      const response = await fetch(`${baseUrl}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      // Validate and normalize products data
      let productArray = [];

      if (
        responseData?.data?.products &&
        Array.isArray(responseData.data.products)
      ) {
        productArray = responseData.data.products
          .map(validateProduct)
          .filter(Boolean);
      } else if (Array.isArray(responseData)) {
        productArray = responseData.map(validateProduct).filter(Boolean);
      } else if (
        responseData?.products &&
        Array.isArray(responseData.products)
      ) {
        productArray = responseData.products
          .map(validateProduct)
          .filter(Boolean);
      }

      // Only update state if we got valid data
      if (productArray.length > 0) {
        setProducts(productArray);
        setError(null);

        // Cache handling (safely)
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(productArray));
            localStorage.setItem(`${cacheKey}-expiry`, String(now + 300000)); // 5 minutes
          } catch (storageError) {
            console.error("localStorage error:", storageError);
          }
        }
      } else {
        throw new Error("No product data found in response");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load products");
      // Don't clear products if we already have some cached
      if (products.length === 0) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [products.length]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setFilters((prev) => ({ ...prev, search: searchValue }));
      }, 300),
    []
  );

  useEffect(() => {
    fetchProducts();

    return () => {
      // Clean up the debounced function
      if (debouncedSearch && typeof debouncedSearch.cancel === "function") {
        debouncedSearch.cancel();
      }
    };
  }, [fetchProducts, debouncedSearch]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      if (!product) return false;

      const searchTerm = filters.search.toLowerCase();
      const name = String(product.name || "").toLowerCase();
      const description = String(product.description || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.includes(searchTerm);

      const matchesCategory =
        !filters.category || product.category === filters.category;

      const matchesVendor =
        !filters.vendor || product.vendor === filters.vendor;

      return matchesSearch && matchesCategory && matchesVendor;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return [];

    const productsToSort = [...filteredProducts];

    switch (sortOrder) {
      case "price-low":
        return productsToSort.sort(
          (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
        );
      case "price-high":
        return productsToSort.sort(
          (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
        );
      case "name-asc":
        return productsToSort.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""))
        );
      case "name-desc":
        return productsToSort.sort((a, b) =>
          String(b.name || "").localeCompare(String(a.name || ""))
        );
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortOrder]);

  // Unique categories and vendors
  const [categories, vendors] = useMemo(() => {
    if (!Array.isArray(products)) return [[], []];

    const uniqueCategories = [
      ...new Set(
        products
          .filter((p) => p && p.category && typeof p.category === "string")
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ];

    const uniqueVendors = [
      ...new Set(
        products
          .filter((p) => p && p.vendor && typeof p.vendor === "string")
          .map((p) => p.vendor)
          .filter(Boolean)
      ),
    ];

    return [uniqueCategories, uniqueVendors];
  }, [products]);

  const resetFilters = () => {
    setFilters({ search: "", category: "", vendor: "" });
    setSortOrder("default");
    toast.info("Filters reset", { position: "top-center", autoClose: 1500 });
  };

  const handleAddToCart = (product) => {
    if (!product) return;

    toast.success(`Added ${product.name} to cart`, {
      position: "top-center",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}-expiry`);
      } catch (e) {
        console.error("Error clearing localStorage:", e);
      }
    }
    fetchProducts();
  }, [fetchProducts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Client-side error handling for images
  const handleImageError = (e) => {
    e.currentTarget.src = "/fallback-image.png";
  };

  if (loading && !isRefreshing)
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
          <div className="text-center mt-4 text-yellow-500">
            Loading products...
          </div>
        </div>
      </div>
    );

  if (error && products.length === 0)
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            No product found!
          </h2>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="bg-yellow-500 text-black px-4 py-3 rounded-md hover:bg-yellow-400 transition w-full flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Something went wrong
          </h2>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="bg-yellow-500 text-black px-4 py-3 rounded-md hover:bg-yellow-400 transition w-full flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <ToastContainer position="top-center" />

      {/* Header Section */}
      <header className="bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
            <div className="flex gap-3">
              <button
                onClick={refreshData}
                className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition flex items-center gap-1"
                disabled={isRefreshing}
              >
                <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-yellow-500"
                onChange={handleSearchChange}
                defaultValue={filters.search}
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FiFilter /> Filters
              {(filters.category || filters.vendor) && (
                <span className="bg-yellow-500 text-black text-xs rounded-full px-2 py-0.5">
                  {(filters.category ? 1 : 0) + (filters.vendor ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-yellow-500 pr-10"
              >
                <option value="default">Default Sort</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <FaSortAmountDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md border border-gray-600 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium">Filter Options</h3>
                <button
                  onClick={resetFilters}
                  className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                >
                  <FiX /> Reset All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="appearance-none w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">All Categories</option>
                      {categories &&
                        categories.map((category) => (
                          <option key={category} value={category}>
                            {String(category)}
                          </option>
                        ))}
                    </select>
                    <FaTag className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Vendor Filter */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Vendor
                  </label>
                  <select
                    value={filters.vendor}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        vendor: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">All Vendors</option>
                    {vendors &&
                      vendors.map((vendor) => (
                        <option key={vendor} value={vendor}>
                          {String(vendor)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white">
            Showing{" "}
            <span className="font-bold">
              {Array.isArray(sortedProducts) ? sortedProducts.length : 0}
            </span>{" "}
            of{" "}
            <span className="font-bold">
              {Array.isArray(products) ? products.length : 0}
            </span>{" "}
            Products
          </h2>

          {isRefreshing && (
            <div className="flex items-center gap-2 text-yellow-400">
              <FiRefreshCw className="animate-spin" />
              <span>Refreshing data...</span>
            </div>
          )}

          {error && products.length > 0 && (
            <div className="text-red-400 flex items-center gap-2">
              <span>Error: {error}</span>
              <button
                onClick={refreshData}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-400"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {!Array.isArray(sortedProducts) || sortedProducts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
            <h3 className="text-xl text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
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

              const productId = String(product.id);
              const productName = String(product.name || "Unnamed Product");
              const productCategory = String(
                product.category || "Uncategorized"
              );
              const productMinOrder = Number(product.minOrder) || 0;
              const productPrice = Number(product.price) || 0;
              const productDiscountPrice = Number(product.discountPrice) || 0;
              const productDiscountPercent = Number(product.discountPercent);

              // Safely determine the main image
              let mainImage = "/fallback-image.png";
              if (
                Array.isArray(product.images) &&
                product.images.length > 0 &&
                typeof product.images[0] === "string"
              ) {
                mainImage = product.images[0];
              }

              return (
                <div
                  key={productId}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-yellow-500/20 hover:translate-y-[-5px] group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <Image
                      src={mainImage}
                      alt={productName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      onError={handleImageError}
                    />
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1">
                        -{productDiscountPercent}%
                      </div>
                    {/* {productMinOrder === 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-md">
                          OUT OF STOCK
                        </span>
                      </div>
                    )} */}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {productName}
                      </h3>
                      <span className="bg-yellow-500 text-black font-bold rounded px-2 py-1 text-sm whitespace-nowrap">
                        ₦{productDiscountPrice?.toLocaleString()}
                        <br />
                        <s style={{ fontSize: "12px", color: "red" }}>
                          ₦{productPrice.toLocaleString()}
                        </s>
                      </span>
                    </div>

                    <div className="text-sm text-gray-400 mb-4 space-y-1">
                      <p className="truncate">Category: {productCategory}</p>
                      <p className="truncate">Min order: {productMinOrder}</p>
                      
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/Products/${productId}`}
                        className="flex-1 transition hover:opacity-90"
                        passHref
                      >
                        <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
                          Details
                        </button>
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={"flex items-center justify-center px-4 py-2 rounded-md transition bg-yellow-500 text-black hover:bg-yellow-400"}
                        aria-label={`Add ${productName} to cart`}
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
