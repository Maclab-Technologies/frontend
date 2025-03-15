"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import { clearCart } from "../../Redux/CartSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const PAYSTACK_PUBLIC_KEY = "pk_test_1b3a68df76c0e6286eea3c5bdb00596428d3ce7a";
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const amountInKobo = totalPrice > 0 ? totalPrice * 100 : 0;

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !address.trim()) {
      alert("Please fill in all billing details.");
      return false;
    }
    if (amountInKobo <= 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return false;
    }
    return true;
  };

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amountInKobo,
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  };

  const handlePaystackPayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    console.log("Payment Success:", reference);

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

    dispatch(clearCart());
    setOrderPlaced(true);

    setEmail("");
    setName("");
    setAddress("");

    router.push(`/Clients/Payment-success?ref=${reference.reference}`);
  };

  const onClose = () => {
    alert("Transaction was closed. Please try again.");
  };

  useEffect(() => {
    if (orderPlaced) {
      dispatch(clearCart());
    }
  }, [orderPlaced, dispatch]);

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Billing & Checkout</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-3 text-black rounded-md border-none focus:ring-2 focus:ring-yellow-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-3 text-black rounded-md border-none focus:ring-2 focus:ring-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Shipping Address"
          className="w-full p-3 mb-3 text-black rounded-md border-none focus:ring-2 focus:ring-yellow-400"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
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
        <hr className="my-4 border-gray-600" />
        <h3 className="text-xl font-bold">Total: ₦{totalPrice.toLocaleString()}</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => {
            if (validateForm()) {
              handlePaystackPayment(onSuccess, onClose);
            }
          }}
          className="w-full md:w-1/2 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-bold transition shadow-lg"
        >
          Pay with Paystack
        </button>
        <button
          onClick={() => alert("Flutterwave integration pending...")}
          className="w-full md:w-1/2 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-bold transition shadow-lg"
        >
          Pay with Flutterwave
        </button>
      </div>
    </div>
  );
}
