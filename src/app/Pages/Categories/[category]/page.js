// Pages/Categories/[categories]/page.js 

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Convert URL parameter to display format (e.g., "business-cards" -> "Business Cards")
  const prettyCategory = category
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/Products/products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        const filtered = data.filter(item => {
          const itemCategory = item.category.toLowerCase().replace(/\s+/g, '-');
          return itemCategory === category.toLowerCase();
        });
        
        setProducts(filtered);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 text-center">
          {prettyCategory}
        </h1>

        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-300 text-xl mb-4">
              No products found in this category.
            </p>
            <Link 
              href="/categories" 
              className="text-yellow-400 hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white text-black rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover:scale-105"
              >
                <div className="bg-yellow-100 p-4 flex justify-center h-48">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={220}
                      height={220}
                      className="rounded-lg object-contain h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold line-clamp-1">{product.name}</h2>
                  <p className="text-gray-600 mt-1 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  <p className="text-yellow-600 font-bold mt-2">
                    ₦{product.price.toLocaleString()}
                  </p>
                  <Link 
                    href={`/Products/${product.id}`} 
                    className="block mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}