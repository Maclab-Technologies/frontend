"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Box,
  Paintbrush,
  Building,
  Tag,
  Star,
  Heart,
  Share2,
} from "lucide-react";
import LoadingErrorHandler from "@/app/_components/LoadingErrorHandler";
import { get } from "@/app/_hooks/fetch-hook";

// Helper function to normalize MongoDB documents

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!id) {
    router.push("/products");
    return;
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await get(`/products/${id}`);

        const result = await response.data.data;

        const productData = result;
        if (!productData) {
          toast.error("Product not found!");
        }
        const minOrder = productData.minOrder || 1;
        setProduct(productData);
        setQuantity(minOrder);
        setSelectedImage(productData.images?.[0] || null);
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error(error.message || "Failed to fetch product details.");

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // useEffect(() => {
  //   if (selectedImage) {
  //     setImageLoading(true);
  //   }
  // }, [selectedImage]);

  const handleQuantityChange = (action) => {
    const minOrder = product?.minOrder || 1;
    setQuantity((prev) => {
      if (action === "increase") {
        return prev + 1;
      } else {
        return Math.max(minOrder, prev - 1);
      }
    });
  };

  const handleThumbnailSelect = (img) => {
    setImageLoading(true);
    setSelectedImage(img);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setProcessingAction(true);

    try {
      const cartItem = {
        vendorId: product.vendor.id,
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: selectedImage || product.images?.[0],
        quantity,
      };

      let existingCart = [];

      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart = Array.isArray(cartData) ? cartData : [];

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // New item
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });

      // Reset form after successful addition
      setQuantity(product.minOrder);
    } catch (error) {
      console.error("Error processing cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out this product: ${product?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  if (loading) {
    return (
      <LoadingErrorHandler loading={loading} />
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box size={32} className="text-red-400" />
          </div>
          <p className="text-white text-xl font-medium mb-2">
            Product not found
          </p>
          <p className="text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <buttonnot
            onClick={() => router.push("/products")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105"
          >
            Browse Products
          </buttonnot>
        </div>
      </div>
    );
  }

  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">

      {/* Navigation */}
      <div className="container mx-auto pt-8 px-4">
        <button
          onClick={() => router.push("/products")}
          className="group flex items-center text-gray-400 hover:text-yellow-400 transition-all duration-300 mb-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-2 mr-3 group-hover:bg-yellow-400/20 transition-all duration-300">
            <ArrowLeft
              size={18}
              className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-300"
            />
          </div>
          <span className="font-medium">Back to Products</span>
        </button>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex flex-col xl:flex-row">
            {/* Image Section */}
            <div className="xl:w-3/5 p-8 lg:p-12">
              <div className="relative aspect-square bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl overflow-hidden border border-gray-700/30">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-yellow-400/30 rounded-full animate-spin"></div>
                      <div className="absolute top-2 left-2 w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product?.name || "Product Image"}
                    width={700}
                    height={700}
                    className="object-contain w-full h-full p-6"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Box size={40} />
                      </div>
                      <p className="text-lg">No image available</p>
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product?.images && product.images.length > 1 && (
                <div className="mt-8 grid grid-cols-4 lg:grid-cols-6 gap-4">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                        selectedImage === img
                          ? "border-yellow-400 shadow-lg shadow-yellow-400/25"
                          : "border-gray-600/50 hover:border-gray-500"
                      }`}
                      onClick={() => handleThumbnailSelect(img)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="xl:w-2/5 p-8 lg:p-12 xl:border-l border-gray-700/50">
              {/* Category & Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
                  <Tag size={16} className="mr-2" />
                  {product.category?.name || "Uncategorized"}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isWishlisted
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-red-400"
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-yellow-400 transition-all duration-300"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                {product?.name || "Product Name"}
              </h1>

              {/* Rating (Mock) */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-1 mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  (4.2) • 127 reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    ₦{currentPrice?.toLocaleString()}
                  </div>
                  {originalPrice && (
                    <div className="text-xl text-gray-500 line-through">
                      ₦{originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                {originalPrice && (
                  <div className="text-green-400 text-sm font-medium">
                    You save ₦{(originalPrice - currentPrice).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-3">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {product?.description || "No description available."}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {product?.material && (
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center">
                        <Box size={18} className="text-yellow-400 mr-3" />
                        <span className="text-gray-300">Material</span>
                      </div>
                      <span className="text-white font-medium">
                        {product.material}
                      </span>
                    </div>
                  )}
                  {product?.color && (
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center">
                        <Paintbrush
                          size={18}
                          className="text-yellow-400 mr-3"
                        />
                        <span className="text-gray-300">Color</span>
                      </div>
                      <span className="text-white font-medium">
                        {product.color}
                      </span>
                    </div>
                  )}
                  {product.vendor?.businessName && (
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center">
                        <Building size={18} className="text-yellow-400 mr-3" />
                        <span className="text-gray-300">Vendor</span>
                      </div>
                      <span className="text-white font-medium">
                        {product.vendor.businessName}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center">
                      <Box size={18} className="text-yellow-400 mr-3" />
                      <span className="text-gray-300">Min Order</span>
                    </div>
                    <span
                      className={`font-medium ${
                        product.minOrder > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.minOrder > 0
                        ? `${product.minOrder} units`
                        : "1 unit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-white text-lg font-semibold mb-4">
                  Quantity
                </label>
                <div className="flex items-center bg-gray-700/50 rounded-2xl p-2 w-fit">
                  <button
                    className="p-3 rounded-xl hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= (product.minOrder || 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} className="text-yellow-400" />
                  </button>

                  <input
                    type="number"
                    min={product?.minOrder || 1}
                    value={quantity}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      const minOrder = product?.minOrder || 1;
                      if (!isNaN(newValue) && newValue >= minOrder) {
                        setQuantity(newValue);
                      } else if (e.target.value === "") {
                        // Allow empty input temporarily
                        setQuantity("");
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure we have a valid number when input loses focus
                      const newValue = parseInt(e.target.value);
                      const minOrder = product?.minOrder || 1;
                      if (isNaN(newValue) || newValue < minOrder) {
                        setQuantity(minOrder);
                      }
                    }}
                    className="bg-transparent text-center text-white py-3 px-6 text-xl font-bold w-24 focus:outline-none"
                  />

                  <button
                    className="p-3 rounded-xl hover:bg-gray-600/50 transition-all duration-300"
                    onClick={() => handleQuantityChange("increase")}
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} className="text-yellow-400" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 ${
                  processingAction || quantity < product.minOrder
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed hover:scale-100"
                    : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400 shadow-lg shadow-yellow-400/25"
                }`}
                onClick={handleAddToCart}
                disabled={processingAction || quantity < product.minOrder}
              >
                {processingAction ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </>
                ) : quantity < product.minOrder ? (
                  <>Can't order less than {product.minOrder} units</>
                ) : (
                  <>
                    <ShoppingCart className="mr-3" size={22} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-yellow-400 text-sm font-semibold">
                    Free Shipping
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    On orders over ₦50,000
                  </div>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-yellow-400 text-sm font-semibold">
                    Fast Delivery
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    2-5 business days
                  </div>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-yellow-400 text-sm font-semibold">
                    Secure Payment
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    100% protected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
