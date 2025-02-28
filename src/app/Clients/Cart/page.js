"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg">
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-lg" />
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-yellow-400">₦{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded-md hover:bg-red-600"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
