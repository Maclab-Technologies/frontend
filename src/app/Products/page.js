"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", vendor: "" });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch product data from public/Products/products.json
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
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category ? product.category === filters.category : true) &&
      (filters.vendor ? product.vendor === filters.vendor : true)
    );
  });

  // Build unique arrays for filtering options
  const categories = [...new Set(products.map((product) => product.category))];
  const vendors = [
    ...new Set(products.map((product) => product.vendor).filter((vendor) => vendor !== "N/A")),
  ];

  const resetFilters = () => {
    setFilters({ search: "", category: "", vendor: "" });
  };

  if (loading) return <div className="p-6 text-center">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{`Error: ${error}`}</div>;

  return (
    <div className="bg-black w-full min-h-screen p-6">
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg">
        <h1 className="text-3xl font-bold">All Products</h1>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border rounded w-full md:w-auto focus:ring-2 focus:ring-yellow-500"
        />
        <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
        <button 
          onClick={resetFilters} 
          className="p-2 border rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        {filteredProducts.map((product) => {
          // Ensure product.images is an array; if not, wrap it in an array.
          const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
          const mainImage = imagesArray[0] || "/fallback-image.png"; // Fallback image

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg flex gap-3 items-center m-2 p-3 transition-transform transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="w-full md:w-1/3">
                <Image
                  src={mainImage}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                  placeholder="blur" // Use blur-up while loading
                  blurDataURL="/placeholder.png" // Placeholder image to display while loading
                />
              </div>
              {/* Product Details */}
              <div className="w-full md:w-2/3 text-center">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-yellow-600 font-bold">₦{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <Link href={`/Products/${product.id}`}>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}