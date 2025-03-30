"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";
import { updateQuantity, removeFromCart, setCart, clearCart } from "../../Redux/CartSlice"; 
import { useRouter } from "next/navigation";
import { FiTrash, FiShoppingCart } from "react-icons/fi";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Load Cart from localStorage when page loads
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCart(savedCart));
    setIsLoading(false);
  }, [dispatch]);

  // Save to localStorage when cart updates
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      // Dispatch an event to notify Navbar about cart update
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cartItems, isLoading]);

  const handleQuantityChange = (id, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (confirmClear) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before proceeding to checkout.");
      return;
    }
    router.push("/Clients/Checkout");
  };

  const handleContinueShopping = () => {
    router.push("/Products");
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <FiShoppingCart className="text-yellow-400" /> Cart ({totalItems} items)
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-6">Your cart is empty 😢.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-yellow-400 text-black px-8 py-3 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Continue Shopping 🛍️
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-gray-800 p-5 rounded-lg">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="ml-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-yellow-400 mb-2">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                      className="bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1} // Disable if quantity is 1
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-14 text-center bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      aria-label={`Quantity for ${item.name}`}
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                      className="bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 mt-4 flex items-center gap-2 hover:text-red-400 transition"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <FiTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6 gap-4">
            <h2 className="text-2xl font-bold">Total: {formatCurrency(totalPrice)}</h2>
            <div className="flex gap-4">
              <button
                onClick={handleClearCart} // Clear cart button
                className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition duration-300"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-yellow-400 text-black px-8 py-3 rounded-md hover:bg-yellow-500 transition duration-300 w-full md:w-auto text-center"
              >
                Proceed to Checkout 🚀
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}