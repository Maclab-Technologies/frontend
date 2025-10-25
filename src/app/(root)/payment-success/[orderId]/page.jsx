"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { get } from "@/app/_hooks/fetch-hook";
import { toast } from "react-toastify";
import { 
  CheckCircle, 
  Download, 
  Upload, 
  Users, 
  Printer, 
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  // Properly get both route params and query params
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("userToken");

      try {
        if (!reference) {
          setError("Invalid payment reference. Please contact support.");
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
      } catch (error) {
        console.error("Error in payment success page:", error);
        setError(
          error.message ||
            "An unexpected error occurred. Please contact support."
        );
      }
    };

    // Only run on client-side
    if (typeof window !== "undefined" && orderId && reference) {
      fetchOrderDetails();
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
        toast.warning("Edit with Canvas feature is coming soon!");
        break;
      case "upload":
        router.push(`/upload-design?orderid=${orderId}&ref=${reference}`);
        break;
      case "designer":
        router.push("/hire-designer");
        break;
      default:
        break;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Processing Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleReturnToShop}
            className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-700 text-lg">
            Thank you for your order. Your payment has been confirmed.
          </p>
        </div>

        {orderDetails ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Order Summary */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
                Order Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-yellow-600 font-bold">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-green-600 font-bold">{reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-800">
                      {new Date(orderDetails.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-800">{user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-800">{user.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-800">
                      {`${address.street}, ${address.city}, ${address.state}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Items Purchased</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.productId.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-yellow-600 font-bold">
                      ₦{(item.discountPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-yellow-600">
                  ₦{orderDetails.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Printing Options */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Download className="h-6 w-6 text-yellow-600" />
                Next Steps - Design Options
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Edit with Canvas */}
                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedOption === "canvas" 
                      ? "border-yellow-500 bg-yellow-50 shadow-lg" 
                      : "border-gray-200 hover:border-yellow-400 hover:shadow-md"
                  }`}
                  onClick={() => handlePrintingOptionSelect("canvas")}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-yellow-600"
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
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">Edit with Canvas</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Customize your design with our easy-to-use editor
                    </p>
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                      Coming Soon
                    </div>
                  </div>
                </div>

                {/* Option 2: Upload your design */}
                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedOption === "upload" 
                      ? "border-yellow-500 bg-yellow-50 shadow-lg" 
                      : "border-gray-200 hover:border-yellow-400 hover:shadow-md"
                  }`}
                  onClick={() => handlePrintingOptionSelect("upload")}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">Upload Your Design</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Upload your ready-to-print design files
                    </p>
                    <div className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                      Available Now
                    </div>
                  </div>
                </div>

                {/* Option 3: Hire a designer */}
                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedOption === "designer" 
                      ? "border-yellow-500 bg-yellow-50 shadow-lg" 
                      : "border-gray-200 hover:border-yellow-400 hover:shadow-md"
                  }`}
                  onClick={() => handlePrintingOptionSelect("designer")}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">Hire a Designer</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Our professionals will create your perfect design
                    </p>
                    <div className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                      Available Now
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Printer className="h-5 w-5" />
                  Print Receipt
                </button>
                <button
                  onClick={handleReturnToShop}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Could not retrieve order details. If you completed a payment, please
              contact support with your reference number.
            </p>
            <button
              onClick={handleReturnToShop}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Return to Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}