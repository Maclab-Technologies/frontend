"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProductDetail() {
  const { id } = useParams(); // Get the ID from URL params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch("/Products/products.json")
      .then((res) => res.json())
      .then((data) => {
        // Convert ID to a number if needed
        const foundProduct = data.find((p) => String(p.id) === String(id));
        setProduct(foundProduct);
      });
  }, [id]);

  if (!product) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6">
        <div className="w-full md:w-1/3">
          <Image
            src={product.images}
            alt={product.name}
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div className="w-full md:w-2/3 md:pl-6 text-left">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-bold text-blue-600">${product.price}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm text-gray-500">Color: {product.color}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
