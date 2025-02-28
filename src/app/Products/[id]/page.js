"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch("/Products/products.json")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => String(p.id) === String(id));
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.images[0]); // Set initial image
        }
      })
      .catch((error) => console.error("Error fetching product:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-lg">Loading product details...</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Product not found</p>
      </div>
    );

  // Function to handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    };

    // Save to localStorage (for now, can be improved with Redux)
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show toast notification
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  return (
    <div className="container mx-auto p-6 bg-black">
      <ToastContainer /> {/* Toast Notification Container */}
      
      <div className="flex flex-col md:flex-row items-start bg-black shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        
        {/* Small Images - Display at Bottom on Mobile */}
        <div className="hidden md:flex flex-col space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {product.images.slice(0, 5).map((image, index) => (
            <button key={index} onClick={() => setSelectedImage(image)} className="w-full">
              <Image
                src={image}
                alt={`${product.name} - ${index + 1}`}
                width={120}
                height={120}
                className={`rounded-lg object-cover cursor-pointer block mx-auto ${
                  selectedImage === image ? "border-4 border-yellow-500" : ""
                }`}
              />
            </button>
          ))}
        </div>

        {/* Main Product Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={selectedImage}
            alt={product.name}
            width={350}
            height={350}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 md:pl-6 text-left">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-white mt-2">{product.description}</p>
          <p className="text-lg font-bold text-yellow-400 mt-2">₦{product.price}</p>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              className="bg-gray-300 text-black px-3 py-2 rounded-md hover:bg-gray-400 transition"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="text-lg font-semibold text-white">{quantity}</span>
            <button
              className="bg-gray-300 text-black px-3 py-2 rounded-md hover:bg-gray-400 transition"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex space-x-3">
            <button 
              className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-md hover:bg-yellow-500 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-gray-300 transition">
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
