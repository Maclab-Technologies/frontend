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
  FiHeart,
  FiEye,
} from "react-icons/fi";
import { FaSortAmountDown, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";

// Skeleton Loading Components
const ProductCardSkeleton = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse border border-gray-700">
    {/* Image Skeleton */}
    <div className="relative h-48 overflow-hidden bg-gray-700">
      <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
    </div>

    {/* Content Skeleton */}
    <div className="p-4">
      {/* Category Skeleton */}
      <div className="mb-3">
        <div className="h-4 w-24 bg-gray-700 rounded-full"></div>
      </div>

      {/* Title Skeleton */}
      <div className="mb-3">
        <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>
        <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
      </div>

      {/* Price Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-20 bg-gray-700 rounded"></div>
        <div className="h-5 w-16 bg-gray-700 rounded"></div>
      </div>

      {/* Min Order Skeleton */}
      <div className="h-3 w-32 bg-gray-700 rounded mb-4"></div>

      {/* Button Skeletons */}
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg"></div>
        <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const FilterSkeleton = () => (
  <div className="mt-4 p-4 bg-gray-700 rounded-md border border-gray-600 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 w-32 bg-gray-600 rounded"></div>
      <div className="h-4 w-20 bg-gray-600 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="h-4 w-24 bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-600 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-24 bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

// Utility function to validate product data
const validateProduct = (product) => {
  if (!product) return null;

  const productId = product.id || "unknown-id";

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
  const [wishlist, setWishlist] = useState(new Set());

  const cacheKey = "products-cache";

  const fetchProducts = useCallback(async () => {
    try {
      const now = Date.now();
      let cachedData;
      let cacheExpiry;

      if (typeof window !== "undefined") {
        try {
          cachedData = localStorage.getItem(cacheKey);
          cacheExpiry = localStorage.getItem(`${cacheKey}-expiry`);
        } catch (e) {
          console.error("Error accessing localStorage:", e);
        }
      }

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

      if (productArray.length > 0) {
        setProducts(productArray);
        setError(null);

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(productArray));
            localStorage.setItem(`${cacheKey}-expiry`, String(now + 300000));
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
      if (products.length === 0) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [products.length]);

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
      if (debouncedSearch && typeof debouncedSearch.cancel === "function") {
        debouncedSearch.cancel();
      }
    };
  }, [fetchProducts, debouncedSearch]);

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

    try {
      const cartItem = {
        vendorId: product.vendor?.id || product.vendor,
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "/fallback-image.png",
        quantity: product.minOrder || 1,
      };

      let existingCart = [];
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart = Array.isArray(cartData) ? cartData : [];

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += product.minOrder || 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      toast.success(`Added ${product.name} to cart`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast.info("Removed from wishlist");
      } else {
        newWishlist.add(productId);
        toast.success("Added to wishlist");
      }
      return newWishlist;
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

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Skeleton loading for initial load
  if (loading && !isRefreshing) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
        {/* Header Skeleton */}
        <header className="bg-gray-800 shadow-md py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="h-7 w-48 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Search and Filter Skeleton */}
        <div className="bg-gray-800 border-t border-gray-700 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow h-10 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <FilterSkeleton />
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Product Grid Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
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
  }

  // Main content with skeleton loading for refreshing
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
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

          {/* Expanded Filters - Show skeleton when refreshing */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md border border-gray-600">
              {isRefreshing ? (
                <FilterSkeleton />
              ) : (
                <>
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
                </>
              )}
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

        {/* Product Grid with Skeleton Loading for Refresh */}
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
            {/* Show skeletons when refreshing, otherwise show products */}
            {isRefreshing
              ? Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              : sortedProducts.map((product) => {
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
                  const isWishlisted = wishlist.has(productId);

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
                      className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-yellow-500/25 hover:translate-y-[-8px] group border border-gray-700"
                    >
                      {/* Product Image with Overlay */}
                      <div className="relative h-48 overflow-hidden bg-gray-900">
                        <Image
                          src={mainImage}
                          alt={productName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        />
                        
                        {/* Discount Badge */}
                        {productDiscountPercent > 0 && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                            -{productDiscountPercent}% OFF
                          </div>
                        )}

                        {/* Action Buttons Overlay */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => toggleWishlist(productId)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                              isWishlisted 
                                ? 'bg-red-500 text-white' 
                                : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                          >
                            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                          <Link href={`/products/${productId}`}>
                            <button className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all duration-300">
                              <FiEye className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>

                        {/* Vendor Tag */}
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {product.vendor}
                          </span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        {/* Category */}
                        <div className="mb-2">
                          <span className="text-yellow-400 text-xs font-medium uppercase tracking-wide">
                            {productCategory}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {productName}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-yellow-400">
                            ₦{productDiscountPrice?.toLocaleString()}
                          </span>
                          {productDiscountPrice < productPrice && (
                            <span className="text-gray-400 text-sm line-through">
                              ₦{productPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Min Order */}
                        <div className="text-xs text-gray-400 mb-4">
                          Min. order: {productMinOrder} units
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2"
                          >
                            <FiShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>

                          {/* View Details Button */}
                          <Link href={`/products/${productId}`} className="flex-1">
                            <button className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-gray-600 hover:border-gray-500 flex items-center justify-center gap-2">
                              <FiEye className="w-5 h-5" />
                              View
                            </button>
                          </Link>
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