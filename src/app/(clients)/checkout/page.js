"use client";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../utils/Redux/CartSlice';

const Checkout = () => {
  const cart = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); // New address state
  const [city, setCity] = useState(''); // New city state
  const [error, setError] = useState('');

  // Paystack script for payment
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Input Validation
  const validateInput = () => {
    if (!fullName || !email || !phone || !address || !city) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }

    if (!/^\d+$/.test(phone)) {
      setError('Phone number must contain only numbers');
      return false;
    }

    setError('');
    return true;
  };

  // Handle Paystack Payment
  const handlePaystackPayment = async () => {
    if (!validateInput()) return;

    const orderDetails = {
      fullName,
      email,
      phone,
      address,
      city,
      cartItems: cart,
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_1b3a68df76c0e6286eea3c5bdb00596428d3ce7a',
      email: orderDetails.email,
      amount: orderDetails.totalAmount * 100,
      currency: 'NGN',
      callback: (response) => {
        const paymentReference = response.reference;
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        dispatch(clearCart());
        window.location.href = '/payment-success'; // Redirect after success
      },
      onClose: () => {
        alert('Payment was not completed');
      },
    });

    handler.openIframe(); // Opens the payment iframe
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

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
            <div key={index} className="flex justify-between mb-2 text-sm">
              <span>{item.name} (x{item.quantity})</span>
              <span>₦{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-3 border-gray-700" />
          <p className="text-right font-bold text-lg">
            Total: ₦{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </p>
        </div>

        <button
          onClick={handlePaystackPayment}
          className="w-full mb-3 p-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
        >
          Pay with Paystack
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