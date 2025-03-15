"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [reference, setReference] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      setReference(ref);

      const storedOrder = localStorage.getItem("lastOrder");
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderDetails(parsedOrder);
        } catch (error) {
          console.error("Error parsing order details:", error);
        }
        // Clear localStorage after fetching
        localStorage.removeItem("lastOrder");
      }
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful 🎉</h1>

      {orderDetails ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-lg mb-2">Order Reference: {reference || "N/A"}</p>
          <p className="text-lg mb-2">Name: {orderDetails?.name || "N/A"}</p>
          <p className="text-lg mb-2">Email: {orderDetails?.email || "N/A"}</p>
          <p className="text-lg mb-2">Shipping Address: {orderDetails?.address || "N/A"}</p>
          <p className="text-lg mb-4">Date: {orderDetails?.date || "N/A"}</p>

          <h2 className="text-2xl font-semibold mb-4">Items Purchased:</h2>
          <ul className="mb-4">
            {orderDetails.items.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                {item.name} x {item.quantity} - ₦{(item.price * item.quantity).toLocaleString()}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mb-6">
            Total: ₦{orderDetails?.total?.toLocaleString() || "0"}
          </h2>

          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition"
          >
            Print Receipt 🖨️
          </button>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-400">Loading order details...</p>
      )}
    </div>
  );
}
