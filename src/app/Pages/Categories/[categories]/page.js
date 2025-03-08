"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CategoryPage() {
  const { category } = useParams(); // Get the dynamic category param from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    fetch("/Products/products.json")
      .then((res) => res.json())
      .then((data) => {
        // Filter products matching the category (case-insensitive)
        const filtered = data.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">
          Category: {category}
        </h1>
        {products.length === 0 ? (
          <p className="text-white text-center">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
                <div className="bg-yellow-500 p-4 rounded-t-lg flex justify-center">
                  <Image
                    src={Array.isArray(product.images) ? product.images[0] : product.images}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-contain rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-yellow-600 font-bold mt-2">₦{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Material: {product.material}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <Link href={`/Products/${product.id}`} passHref>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    View Product
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
