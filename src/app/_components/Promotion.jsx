"use client";
import { useRouter } from "next/navigation";

const Promotion = () => {
  const router = useRouter();

  return (
    <section className="bg-white py-16 mt-12 rounded-lg">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Check out our Latest Promotions!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Don't miss out on exclusive offers and exciting discounts. Grab
          them while they last!
        </p>
        <button
          onClick={() => router.push("/products")}
          className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Promotion;