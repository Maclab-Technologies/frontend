"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { updateQuantity, removeFromCart } from "../../Redux/CartSlice";
import { useRouter } from "next/navigation";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle updating the quantity of an item
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // Calculate total price based on items and their quantities
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle checkout navigation
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-800 p-4 rounded-lg"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-yellow-400">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <label className="mr-2">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 px-2 py-1 text-black rounded"
                    />
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-1 mt-2 rounded-md hover:bg-red-600"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h2 className="text-2xl font-bold">
              Total: ₦{totalPrice.toLocaleString()}
            </h2>
            <button
              className="bg-green-500 text-white px-6 py-3 mt-4 rounded-md hover:bg-green-600 transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
