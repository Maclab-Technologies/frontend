"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [reference, setReference] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setReference(searchParams.get("ref"));

      const storedOrder = localStorage.getItem("lastOrder");
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderDetails(parsedOrder);
        } catch (error) {
          console.error("Error parsing order details:", error);
        }
        // Clear order details after loading
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
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      {orderDetails ? (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-lg">Order Reference: {reference || "N/A"}</p>
          <p className="text-lg">Name: {orderDetails?.name || "N/A"}</p>
          <p className="text-lg">Email: {orderDetails?.email || "N/A"}</p>
          <p className="text-lg">Shipping Address: {orderDetails?.address || "N/A"}</p>
          <p className="text-lg">Date: {orderDetails?.date || "N/A"}</p>

          {orderDetails.items && orderDetails.items.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mt-4">Items Purchased:</h2>
              <ul>
                {orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    {item.name} x {item.quantity} - ₦{(item.price * item.quantity).toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No items found.</p>
          )}

          <h2 className="text-xl font-bold mt-4">
            Total: ₦{orderDetails?.total?.toLocaleString() || "0"}
          </h2>
          
          <button
            onClick={handlePrint}
            className="mt-4 px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Print Receipt
          </button>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
}
