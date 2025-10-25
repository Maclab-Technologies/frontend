"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../utils/Redux/CartSlice";
import { get, post } from "@/app/_hooks/fetch-hook";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShoppingBag
} from "lucide-react";

const Checkout = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const orderId = params.id;

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    console.log("Order ID from params:", orderId);
    if (!hasMounted || !orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setIsLoadingOrder(true);
        const response = await get(`/orders/order/${orderId}`, {
          token,
        });

        if (!response.success) {
          setOrderError(response.message || "Failed to fetch order details");
        }
        const data = response.data.data;
        setOrderDetails(data);
        setFullName(data.user.fullName);
        setEmail(data.user.email);
        setPhone(data.user.phone);
        localStorage.setItem("orderDetails", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderError("An error occurred while fetching order details");
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, hasMounted, token]);

  useEffect(() => {
    if (!hasMounted) return;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [hasMounted]);

  // Phone number input handler - prevents any formatting and keeps pure numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove ALL non-numeric characters including spaces
    const numericValue = value.replace(/\D/g, '');
    setPhone(numericValue);
  };

  // Prevent any formatting on paste
  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Remove all non-numeric characters from pasted content
    const numericValue = pastedText.replace(/\D/g, '');
    setPhone(numericValue);
  };

  const validateInput = () => {
    if (!fullName || !email || !phone || !street || !state || !city) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!/^\d+$/.test(phone) || phone.length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits)");
      return false;
    }

    setError("");
    return true;
  };

  const verifyPayment = async (reference) => {
    if (!hasMounted) return;

    try {
      setIsProcessing(true);
      const response = await post(
        `/payments/verify`,
        JSON.stringify({
          reference,
          orderId,
          customerDetails: {
            contactName: fullName,
            contactEmail: email,
            contactPhone: phone, // This will be in format 08146438621
            street,
            city,
            state,
          },
        }),
        {
          token,
        }
      );

      console.log(response);

      const data = response.data;

      if (data.success) {
        toast.success('Payment successful!');
        dispatch(clearCart());
        window.location.href = `/payment-success/${orderId}?reference=${reference}`;
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(
        "An error occurred while verifying your payment. Please contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!hasMounted || !validateInput() || isProcessing || !orderDetails) return;

    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: orderDetails.total * 100,
      currency: "NGN",
      reference: `ORDER_${orderId}_${Date.now()}`,
      callback: (response) => {
        console.log(response);
        verifyPayment(response.reference);
      },
      onClose: () => {
        if (!isProcessing) {
          toast.info("Payment was not completed");
        }
      },
    });

    handler.openIframe();
  };

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
    "Yobe", "Zamfara"
  ];

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Order Details</h1>
          <p className="text-gray-600">Preparing your checkout experience...</p>
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{orderError}</p>
          <button
            onClick={() => router.back()}
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors bg-white rounded-xl px-4 py-3 hover:bg-gray-50 shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-700 mt-1">Complete your purchase</p>
          </div>
          
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              {/* Order ID */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center border border-yellow-200">
                <p className="text-sm text-gray-700">
                  Order ID: <span className="text-yellow-600 font-mono font-bold">{orderId}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-600" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="" className="text-gray-500">Select State</option>
                        {nigerianStates.map((stateOption) => (
                          <option key={stateOption} value={stateOption} className="text-gray-800">
                            {stateOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g., 08146438621)"
                      value={phone}
                      onChange={handlePhoneChange}
                      onPaste={handlePhonePaste}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={11}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {phone.length}/11
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 -mt-2">
                    Enter numbers only (no spaces or special characters)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-yellow-600" />
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {orderDetails?.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-700 text-xs font-bold">x{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm truncate">
                        {item.productId?.name || "Product"}
                      </p>
                      <p className="text-yellow-600 text-sm font-bold">
                        ₦{(item.productId?.discountPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-gray-700 mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{orderDetails?.total?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700 mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-yellow-600">₦{orderDetails?.total?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePaystackPayment}
                  disabled={isProcessing || !orderDetails}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isProcessing || !orderDetails
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-lg transform hover:scale-105"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay with Paystack
                    </>
                  )}
                </button>

                <button
                  disabled
                  className="w-full py-3 px-6 rounded-xl bg-gray-100 text-gray-400 font-bold border border-gray-300 cursor-not-allowed transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    Flutterwave (Soon)
                  </span>
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Secure payment • 256-bit SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;