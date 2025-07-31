"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../Redux/CartSlice";
import { get, post } from "@/app/hooks/fetch-hook";

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
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [vendorId, setVendorId] = useState("");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setIsLoadingOrder(true);
        const response = await get(`/orders/${orderId}`, {
          token,
        });

        if (!response.success) {
          setOrderError(data.message || "Failed to fetch order details");
        }
        const data = response.data.data;
        setOrderDetails(data);
        setFullName(data.user.fullName);
        setEmail(data.user.email);
        setPhone(data.user.phone);
        setVendorId(data.items.vendorId);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderError("An error occurred while fetching order details");
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, hasMounted]);

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

  const validateInput = () => {
    if (!fullName || !email || !phone || !street || !state || !city) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (!/^\d+$/.test(phone)) {
      setError("Phone number must contain only numbers");
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
          vendorId,
          customerDetails: {
            contactName: fullName,
            contactEmail: email,
            contactPhone: phone,
            street,
            city,
            state,
            country,
          },
        }),
        {
          token,
        }
      );

      const data = response.data;

      if (data.success) {
        dispatch(clearCart());
        window.location.href = "/Clients/Payment-success";
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert(
        "An error occurred while verifying your payment. Please contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!hasMounted || !validateInput() || isProcessing || !orderDetails)
      return;

    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: orderDetails.total * 100,
      currency: "NGN",
      reference: `ORDER_${orderId}_${Date.now()}`,
      callback: (response) => {
        verifyPayment(response.reference);
      },
      onClose: () => {
        if (!isProcessing) {
          alert("Payment was not completed");
        }
      },
    });

    handler.openIframe();
  };

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6">
        <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6">
        <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-6">Loading Order...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6">
        <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-6 text-red-500">Error</h1>
          <p className="text-red-400 mb-6">{orderError}</p>
          <button
            onClick={() => router.back()}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {/* Order ID Display */}
        <div className="bg-gray-900 p-3 rounded-lg mb-6 text-center">
          <p className="text-sm text-gray-400">
            Order ID:{" "}
            <span className="text-yellow-400 font-mono">{orderId}</span>
          </p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="123, Alen street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          {orderDetails?.items?.map((item, index) => (
            <div key={index} className="flex justify-between mb-2 text-sm">
              <span>
                {item.productId.name} (x{item.quantity})
              </span>
              <span>
                ₦
                {(
                  item.productId.discountPrice * item.quantity
                ).toLocaleString()}
              </span>
            </div>
          ))}
          <hr className="my-3 border-gray-700" />
          <p className="text-right font-bold text-lg">
            Total: ₦{orderDetails?.total?.toLocaleString() || 0}
          </p>
        </div>

        <button
          onClick={handlePaystackPayment}
          disabled={isProcessing || !orderDetails}
          className={`w-full mb-3 p-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition ${
            isProcessing || !orderDetails ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Pay with Paystack"}
        </button>

        <button
          disabled
          className="w-full p-3 bg-gray-800 text-gray-500 font-bold rounded-lg cursor-not-allowed"
        >
          Pay with Flutterwave (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default Checkout;
