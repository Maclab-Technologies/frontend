"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import { clearCart } from "../../Redux/CartSlice"

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const PAYSTACK_PUBLIC_KEY = "pk_test_1b3a68df76c0e6286eea3c5bdb00596428d3ce7a";
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const amountInKobo = totalPrice > 0 ? totalPrice * 100 : 0;

  const handlePayment = () => {
    if (!email.trim() || !name.trim() || !address.trim()) {
      alert("Please fill in all billing details before proceeding.");
      return;
    }
    if (amountInKobo <= 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const config = {
      reference: new Date().getTime().toString(),
      email,
      amount: amountInKobo,
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: "NGN",
    };

    const onSuccess = (reference) => {
      console.log("Payment Success:", reference);

      // Save order details for receipt
      const orderDetails = {
        reference: reference.reference,
        name,
        email,
        address,
        items: cartItems,
        total: totalPrice,
        date: new Date().toLocaleString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
      }

      // Clear cart
      dispatch(clearCart());

      // Redirect to Payment Success Page with reference
      router.push(`/Payment-success?ref=${reference.reference}`);
    };

    const onClose = () => {
      alert("Transaction was closed. Please try again.");
    };

    const initializePayment = usePaystackPayment(config);
    initializePayment(onSuccess, onClose);
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Billing & Checkout</h1>

      {/* Billing Information */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 text-black rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 mb-3 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Shipping Address"
          className="w-full p-2 mb-3 text-black rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <p>{item.name} x {item.quantity}</p>
              <p>₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-red-400">Your cart is empty.</p>
        )}
        <hr className="my-2 border-gray-600" />
        <h3 className="text-xl font-bold">Total: ₦{totalPrice.toLocaleString()}</h3>
      </div>

      {/* Paystack Payment Button */}
      <button
        onClick={handlePayment}
        className={`px-6 py-3 rounded-md font-bold transition ${
          cartItems.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={cartItems.length === 0}
      >
        Pay with Paystack
      </button>
    </div>
  );
}
