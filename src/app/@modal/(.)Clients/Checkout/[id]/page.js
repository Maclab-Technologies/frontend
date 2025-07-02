"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutModal({ params }) {
  const router = useRouter();
  const { id } = params;
  const cart = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === "modal-backdrop") {
        router.back();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [router]);

  // Paystack script for payment
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Input Validation
  const validateInput = () => {
    if (!fullName || !email || !phone || !address || !city) {
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

  // Verify payment with backend
  const verifyPayment = async (reference, orderDetails) => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Payment verified successfully
        localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
        dispatch(clearCart());
        window.location.href = "/Clients/Payment-success";
      } else {
        // Payment verification failed
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

  // Handle Paystack Payment
  const handlePaystackPayment = async () => {
    if (!validateInput() || isProcessing) return;

    const orderDetails = {
      fullName,
      email,
      phone,
      address,
      city,
      cartItems: cart,
      totalAmount: cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    };

    const handler = window.PaystackPop?.setup({
      key:
        process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
        "pk_test_1b3a68df76c0e6286eea3c5bdb00596428d3ce7a",
      email: orderDetails.email,
      amount: orderDetails.totalAmount * 100,
      currency: "NGN",
      callback: (response) => {
        const paymentReference = response.reference;
        verifyPayment(paymentReference, orderDetails);
      },
      onClose: () => {
        if (!isProcessing) {
          alert("Payment was not completed");
        }
      },
    });

    handler.openIframe();
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-black text-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-800">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FiX size={24} />
        </button>

        {/* Checkout content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Checkout Order #{id}</h2>

          {/* You can place your checkout form here */}
          <div className="space-y-4">
            <form>
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
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <div className="bg-gray-900 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between mb-2 text-sm"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>₦{item.price * item.quantity}</span>
                  </div>
                ))}
                <hr className="my-3 border-gray-700" />
                <p className="text-right font-bold text-lg">
                  Total: ₦
                  {cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>

              <button
                onClick={handlePaystackPayment}
                disabled={isProcessing}
                className={`w-full mb-3 p-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition ${
                  isProcessing ? "opacity-70 cursor-not-allowed" : ""
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
