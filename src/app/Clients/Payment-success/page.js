"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const [reference, setReference] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = () => {
      setIsLoading(true);
      
      try {
        // Get reference from URL
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("reference") || urlParams.get("ref");

        
        if (!ref) {
          setError("Invalid payment reference. Please contact support.");
          setIsLoading(false);
          return;
        }
        
        setReference(ref);

        // Get order details from localStorage
        const storedOrder = localStorage.getItem("lastOrder");
        
        if (!storedOrder) {
          setError("Order details not found. Please contact support.");
          setIsLoading(false);
          return;
        }

        try {
          const parsedOrder = JSON.parse(storedOrder);
          
          // Validate that the reference matches
          if (parsedOrder.reference !== ref) {
            console.warn("Reference mismatch:", parsedOrder.reference, ref);
            setError("Order reference mismatch. Please contact support.");
            setIsLoading(false);
            return;
          }
          
          setOrderDetails(parsedOrder);
          
          // Clear localStorage after successful fetch
          localStorage.removeItem("lastOrder");
        } catch (parseError) {
          console.error("Error parsing order details:", parseError);
          setError("Unable to process order information. Please contact support.");
        }
      } catch (error) {
        console.error("Error in payment success page:", error);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only run on client-side
    if (typeof window !== "undefined") {
      fetchOrderDetails();
    }
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleReturnToShop = () => {
    router.push("/Clients/Products/");  // Redirect to homepage or shop page
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-center text-lg text-gray-400">Loading order details...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6 bg-black text-white min-h-screen">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Order Processing Error</h1>
          <p className="text-lg mb-6">{error}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleReturnToShop}
              className="px-6 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition"
            >
              Return to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful 🎉</h1>

      {orderDetails ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Order Reference:</span> {reference || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Date:</span> {orderDetails?.date || "N/A"}
            </p>
          </div>
          
          <div className="mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Name:</span> {orderDetails?.name || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Email:</span> {orderDetails?.email || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Shipping Address:</span> {orderDetails?.address || "N/A"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Items Purchased:</h2>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3">{item.name}</td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3">₦{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <h2 className="text-xl font-bold mb-6">
                Total: ₦{orderDetails?.total?.toLocaleString() || "0"}
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition"
            >
              Print Receipt 🖨️
            </button>
            <button
              onClick={handleReturnToShop}
              className="px-6 py-2 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">
            Could not retrieve order details. If you completed a payment, please contact support with your reference number.
          </p>
          <button
            onClick={handleReturnToShop}
            className="px-6 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition"
          >
            Return to Shop
          </button>
        </div>
      )}
    </div>
  );
}