"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [designOption, setDesignOption] = useState(null);

  useEffect(() => {
    if (!id) {
      router.push("/Products");
      return;
    }

    fetch("/Products/products.json")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.images[0]);
        } else {
          router.push("/Products");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch product details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      designOption,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 text-white bg-black min-h-screen">
      <ToastContainer />

      <div className="flex flex-col md:flex-row gap-12 max-w-7xl mx-auto p-10 rounded-lg bg-black shadow-md">

        {/* Left Side: Product Images */}
        <div className="md:w-1/2 flex flex-col items-center">
          <Image src={selectedImage} alt={product?.name} width={450} height={450} className="rounded-xl" />

          <div className="flex gap-4 mt-6 overflow-x-auto">
            {product?.images?.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className={`rounded-lg cursor-pointer ${selectedImage === img ? 'border-2 border-yellow-400' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 space-y-6">

          <h1 className="text-5xl font-bold">{product?.name}</h1>
          <p className="text-white text-lg">{product?.description}</p>
          <p className="text-yellow-400 text-3xl font-semibold">₦{product?.price}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <p>📂 Category: <span className="text-white font-medium">{product?.category}</span></p>
            <p>📝 Material: <span className="text-white font-medium">{product?.material}</span></p>
            <p>🎨 Color: <span className="text-white font-medium">{product?.color}</span></p>
            <p>🏭 Vendor: <span className="text-white font-medium">{product?.vendor}</span></p>
            <p>🛡️ Ownership: <span className="text-white font-medium">{product?.ownership}</span></p>
          </div>

          {/* Quantity Control */}
          <div className="flex items-center gap-6">
            <button className="bg-gray-800 px-5 py-2 rounded-md" onClick={() => handleQuantityChange("decrease")}>-</button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button className="bg-gray-800 px-5 py-2 rounded-md" onClick={() => handleQuantityChange("increase")}>+</button>
          </div>

          {/* Design Options */}
          <h2 className="text-lg font-semibold">Choose Design Option:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 🎨 Hire Designer */}
            <button
              onClick={() => {
                setDesignOption("Hire Graphics Designer");
                router.push("/Pages/Hire-designer");
              }}
              className={`flex items-center gap-3 bg-gray-800 px-6 py-5 rounded-lg text-lg ${
                designOption === "Hire Graphics Designer" ? "bg-yellow-400 text-black" : ""
              }`}
            >
              🎨 Hire Graphics Designer
            </button>

            {/* ✏️ Edit with Canva */}
            <button
              onClick={() => {
                setDesignOption("Edit with Canva");
                router.push("/Pages/edit-canvas");
              }}
              className={`flex items-center gap-3 bg-gray-800 px-6 py-5 rounded-lg text-lg ${
                designOption === "Edit with Canva" ? "bg-yellow-400 text-black" : ""
              }`}
            >
              ✏️ Edit with Canva
            </button>

            {/* 📤 Upload Design */}
            <button
              utton
              onClick={() => {
                setDesignOption("Upload Your Own Design");
                router.push("/pages/upload-design");
              }}
              className={`flex items-center gap-3 bg-gray-800 px-6 py-5 rounded-lg text-lg ${
                designOption === "Upload Your Own Design" ? "bg-yellow-400 text-black" : ""
              }`}
            >
              📤 Upload Design
            </button>
          </div>

          {/* Add to Cart */}
          <button
            className="bg-yellow-400 text-black px-8 py-4 rounded-md font-bold w-full hover:bg-yellow-500"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button
            className="mt-4 bg-white text-black px-8 py-2 rounded-md w-full hover:bg-gray-300"
            onClick={() => router.push("/Products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
