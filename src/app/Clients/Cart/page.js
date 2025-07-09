"use client";

import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  updateQuantity,
  removeFromCart,
  setCart,
  clearCart,
} from "../../Redux/CartSlice";
import { useRouter } from "next/navigation";
import { FiTrash, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/hooks/useAuth";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { isLoggedIn, authUser } = useContext(AuthContext);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        dispatch(setCart(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart");
        dispatch(setCart([]));
      }
      setIsLoading(false);
    };

    if (typeof window !== "undefined") {
      loadCart();
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasMounted && !isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoading, hasMounted]);

  const handleQuantityChange = (id, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );
    if (confirmClear) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  };

  const handleCheckout = async () => {
    if (!hasMounted) return;

    if (!isLoggedIn) {
      toast.warning("Please sign in to proceed to checkout");
      safeNavigate("/Clients/Auth/Login");
      return;
    }

    try {
      if (cartItems.length === 0) {
        toast.error(
          "Your cart is empty. Please add items before proceeding to checkout."
        );
        return;
      }

      setIsProcessingCheckout(true);

      const orderData = {
        items: cartItems.map((item) => ({
          vendorId: item.vendorId,
          productId: item.id,
          name: item.name,
          price: item.price,
          discountPrice: item.discountPrice,
          quantity: item.quantity,
          image: item.image,
          uploadedImages: item.uploadedImages
            ?.map((img) => (typeof img === "string" ? img : img.preview))
            .filter(Boolean),
        })),
        totalAmount: cartItems.reduce(
          (acc, item) =>
            acc + (item.discountPrice || item.price) * item.quantity,
          0
        ),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      toast.success("Order placed successfully!");

      // Clear cart only after successful order creation
      // dispatch(clearCart());
      // localStorage.removeItem("cart");

      // Use window.location for more reliable redirect
      window.location.href = `/Clients/Checkout/${order.data.id}`;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong while placing your order");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const safeNavigate = (path) => {
    if (!hasMounted) return;
    router.push(path);
  };

  const handleContinueShopping = () => {
    safeNavigate("/Products");
  };

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.price || 0) * (item.quantity || 0),
    0
  );
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price || 0);
  };

  if (!hasMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <FiShoppingCart className="text-yellow-400" /> Cart ({cartItems.length} item{cartItems.length > 0 && 's'})
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
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
              <div
                key={item.id}
                className="bg-gray-800 p-5 rounded-lg flex flex-col md:flex-row gap-5"
              >
                {/* Main Product Image and Uploaded Designs */}
                <div className="flex flex-col gap-3 min-w-[120px]">
                  {/* Main product image */}
                  <div className="relative aspect-square">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name || "Product"}
                      fill
                      className="rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* Uploaded designs */}
                  {item.uploadedImages?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.uploadedImages.map((img, index) => (
                        <div key={index} className="relative w-16 h-16">
                          <Image
                            src={
                              typeof img === "string"
                                ? img
                                : img?.preview || "/placeholder.jpg"
                            }
                            alt={`Design ${index + 1}`}
                            fill
                            className="rounded-md border border-gray-700 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow gap-2">
                  <h2 className="text-xl font-semibold">
                    {item.name || "Unknown Product"}
                  </h2>

                  {/* Price Display */}
                  <div className="mb-4">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                      ₦
                      {(item.discountPrice || item.price || 0).toLocaleString()}
                    </div>
                    {item.discountPrice && item.price && (
                      <div className="text-sm text-red-400 line-through">
                        ₦{item.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, (item.quantity || 1) - 1)
                      }
                      className="bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                      disabled={(item.quantity || 1) <= 1}
                      aria-label={`Decrease ${item.name || "item"} quantity`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity || 1}
                      min="1"
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        );
                        handleQuantityChange(item.id, value);
                      }}
                      className="w-16 text-center bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      aria-label={`Quantity for ${item.name || "item"}`}
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, (item.quantity || 1) + 1)
                      }
                      className="bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition"
                      aria-label={`Increase ${item.name || "item"} quantity`}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 mt-4 flex items-center gap-2 hover:text-red-400 transition"
                    aria-label={`Remove ${item.name || "item"} from cart`}
                  >
                    <FiTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Total: {formatCurrency(totalPrice)}
              </h2>
              {cartItems.some((item) => item.discountPrice) && (
                <p className="text-sm text-gray-400">
                  You saved:{" "}
                  {formatCurrency(
                    cartItems.reduce(
                      (acc, item) =>
                        acc +
                        (item.discountPrice && item.price
                          ? (item.price - item.discountPrice) *
                            (item.quantity || 0)
                          : 0),
                      0
                    )
                  )}
                </p>
              )}
            </div>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition duration-300"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
                className={`bg-yellow-400 text-black px-8 py-3 rounded-md hover:bg-yellow-500 transition duration-300 w-full md:w-auto ${
                  isProcessingCheckout ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isProcessingCheckout
                  ? "Processing..."
                  : "Proceed to Checkout 🚀"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
