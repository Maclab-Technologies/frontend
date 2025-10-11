"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { get } from "@/app/_hooks/fetch-hook";

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  // Properly get both route params and query params
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("userToken");

      try {
        if (!reference) {
          setError("Invalid payment reference. Please contact support.");
          setIsLoading(false);
          return;
        }

        const response = await get(`/orders/order/${orderId}`, {
          token,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch order details");
        }

        const data = response.data.data;
        setOrderDetails(data);
        setUser(data.user);
        setAddress(data.shippingAddress);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in payment success page:", error);
        setError(
          error.message ||
            "An unexpected error occurred. Please contact support."
        );
        setIsLoading(false);
      }
    };

    // Only run on client-side
    if (typeof window !== "undefined" && orderId && reference) {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
    }

    return () => {
      // Any cleanup if needed
    };
  }, [orderId, reference]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleReturnToShop = () => {
    router.push("/products/");
  };

  const handlePrintingOptionSelect = (option) => {
    setSelectedOption(option);

    switch (option) {
      case "canvas":
        alert("Edit with Canvas feature is coming soon!");
        break;
      case "upload":
        router.push("/design-upload");
        break;
      case "designer":
        router.push("/hire-designer");
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-center text-lg text-gray-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-black text-white min-h-screen">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">
            Order Processing Error
          </h1>
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
      <h1 className="text-3xl font-bold mb-4 text-center">
        Payment Successful 🎉
      </h1>

      {orderDetails ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Order ID:</span>{" "}
              {orderId || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Reference:</span>{" "}
              {reference || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Date:</span>{" "}
              {new Date(orderDetails.createdAt).toLocaleString() || "N/A"}
            </p>
          </div>

          <div className="mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Name:</span>{" "}
              {user.fullName || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Email:</span>{" "}
              {user.email || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Phone:</span>{" "}
              {user.phone || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium text-gray-400">Address:</span>{" "}
              {`${address.street}, ${address.city || " "}, ${address.state || " "}` ||
                "N/A"}
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
                      <td className="py-3">{item.productId.name}</td>
                      <td className="text-center py-3">
                        {item.quantity}
                      </td>
                      <td className="text-right py-3">
                        ₦
                        {(
                          item.discountPrice * item.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <h2 className="text-xl font-bold mb-6">
                Total: ₦{orderDetails.total.toLocaleString() || "0"}
              </h2>
            </div>
          </div>

          {/* Printing Options Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Printing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Edit with Canvas */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === "canvas" ? "border-yellow-500 bg-gray-700" : "border-gray-600 hover:border-yellow-400"}`}
                onClick={() => handlePrintingOptionSelect("canvas")}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Edit with Canvas</h3>
                  <p className="text-sm text-gray-400">
                    Customize your design with our editor
                  </p>
                  <div className="mt-2 text-yellow-500 text-sm">
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Option 2: Upload your design */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === "upload" ? "border-yellow-500 bg-gray-700" : "border-gray-600 hover:border-yellow-400"}`}
                onClick={() => handlePrintingOptionSelect("upload")}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Upload Your Design</h3>
                  <p className="text-sm text-gray-400">
                    Upload your ready-to-print design files
                  </p>
                </div>
              </div>

              {/* Option 3: Hire a designer */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === "designer" ? "border-yellow-500 bg-gray-700" : "border-gray-600 hover:border-yellow-400"}`}
                onClick={() => handlePrintingOptionSelect("designer")}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Hire a Designer</h3>
                  <p className="text-sm text-gray-400">
                    Our professionals will create your design
                  </p>
                </div>
              </div>
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
            Could not retrieve order details. If you completed a payment, please
            contact support with your reference number.
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
