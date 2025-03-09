"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrder = localStorage.getItem("lastOrder");
      if (storedOrder) {
        setOrderDetails(JSON.parse(storedOrder));
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      {orderDetails ? (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-lg">Order Reference: {reference}</p>
          <p className="text-lg">Name: {orderDetails.name}</p>
          <p className="text-lg">Email: {orderDetails.email}</p>
          <p className="text-lg">Shipping Address: {orderDetails.address}</p>
          <p className="text-lg">Date: {orderDetails.date}</p>
          <h2 className="text-2xl font-semibold mt-4">Items Purchased:</h2>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                {item.name} x {item.quantity} - ₦{(item.price * item.quantity).toLocaleString()}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mt-4">Total: ₦{orderDetails.total.toLocaleString()}</h2>
          <button
            onClick={handlePrint}
            className="mt-4 px-6 py-2 bg-blue-500 rounded hover:bg-blue-600"
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
