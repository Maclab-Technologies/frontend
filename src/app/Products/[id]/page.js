"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Palette,
  Edit,
  Upload,
  Box,
  Paintbrush,
  Building,
  Tag,
  X,
  FileUp,
  MessageCircle,
} from "lucide-react";

// Helper function to normalize MongoDB documents
const normalizeMongoId = (item) => {
  if (!item) return null;
  const normalized = { ...item };

  // Ensure _id is converted to string if it exists
  if (normalized._id && typeof normalized._id === "object") {
    normalized._id = normalized._id.toString();
  }

  // Add id property if it doesn't exist
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id.toString();
  }

  return normalized;
};

const DESIGN_OPTIONS = {
  CANVA: "Edit_with_Canva",
  HIRE: "Hire",
  UPLOAD: "Upload",
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [designOption, setDesignOption] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    if (!id) {
      router.push("/Products");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details.");
        }

        const result = await response.json();
        console.log("Full response:", result);

        const productData = result.data;
        if (!productData) {
          toast.error("Product not found!");
          return router.push("/Products");
        }

        const normalizedProduct = normalizeMongoId(productData);
        setQuantity(normalizedProduct.minOrder);
        setProduct(normalizedProduct);
        setSelectedImage(normalizedProduct.images?.[0] || null);
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error(error.message || "Failed to fetch product details.");
        router.push("/Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  useEffect(() => {
    if (selectedImage) {
      setImageLoading(true);
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      productImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [productImages]);

  const handleDesignOptionSelect = useCallback((option) => {
    console.log(option);
    setDesignOption(option);
    // Clear images when switching options
    if (option !== DESIGN_OPTIONS.UPLOAD) {
      setProductImages([]);
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    // Revoke previous URLs to prevent memory leaks
    productImages.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setProductImages(newImages);
  };

  const removeImage = (index) => {
    const imageToRemove = productImages[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const newImages = productImages.filter((_, i) => i !== index);
    setProductImages(newImages);
  };

  const handleHireDesigner = () => {
    const phoneNumber = "+2341234567890";
    const message = `Hello! I'd like to hire a graphic designer for my product: ${product?.name || "Custom Product"}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleQuantityChange = (action) => {
    setQuantity((prev) =>
      action === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleThumbnailSelect = (img) => {
    setImageLoading(true);
    setSelectedImage(img);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!designOption) {
      toast.warning("Please select a design option first", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setProcessingAction(true);

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: selectedImage || product.images?.[0],
        quantity,
        designOption,
        uploadedImages:
          designOption === DESIGN_OPTIONS.UPLOAD ? productImages : [],
      };
      const cleanedImages = productImages.map((img) => ({
        preview: img.preview,
        name: img.name,
        size: img.size,
      }));

      cartItem.uploadedImages = cleanedImages;
      
      let existingCart = [];

      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart = Array.isArray(cartData) ? cartData : [];

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id && item.designOption === designOption
      );

      if (existingItemIndex !== -1) {
        // If item exists with same design option, update quantity and image if needed
        existingCart[existingItemIndex].quantity += quantity;

        if (designOption === DESIGN_OPTIONS.UPLOAD) {
          existingCart[existingItemIndex].uploadedImages = productImages;
        }
      } else {
        // New item
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      // Save current design info (optional preview data)
      const designInfo = {
        productId: product.id,
        productName: product.name,
        productImage: selectedImage || product.images?.[0],
        minOrder: quantity,
        price: product.price,
        discountPrice: product.discountPrice,
        designOption,
        uploadedImages:
          designOption === DESIGN_OPTIONS.UPLOAD ? productImages : [],
      };

      localStorage.setItem("currentDesignInfo", JSON.stringify(designInfo));

      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });

      // Reset form after successful addition
      setQuantity(product.minOrder);
      setDesignOption("");
      setProductImages([]);
    } catch (error) {
      console.error("Error processing cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Product not found.</p>
          <button
            onClick={() => router.push("/Products")}
            className="bg-yellow-400 text-black px-6 py-2 rounded-md hover:bg-yellow-500 transition"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }
  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <ToastContainer />

      <div className="container mx-auto pt-6 px-4">
        <button
          onClick={() => router.push("/Products")}
          className="flex items-center text-gray-400 hover:text-yellow-400 transition mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-6 md:p-8">
              <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product?.name || "Product Image"}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Box size={48} className="mx-auto mb-2" />
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product?.images && product.images.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImage === img
                          ? "border-yellow-400"
                          : "border-transparent"
                      } transition-all hover:opacity-80`}
                      onClick={() => handleThumbnailSelect(img)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 p-6 md:p-8 lg:border-l border-gray-700">
              {/* Category */}
              <div className="mb-2 text-yellow-400 text-sm font-medium flex items-center">
                <Tag size={14} className="mr-1" />
                {product.category?.name || "Uncategorized"}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {product?.name || "Product Name"}
              </h1>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                  ₦{currentPrice?.toLocaleString()}
                </div>
                {originalPrice && (
                  <div className="text-sm text-red-400 line-through">
                    ₦{originalPrice.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6 text-gray-300">
                {product?.description || "No description available."}
              </div>

              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-8">
                {product?.material && (
                  <div className="flex items-center">
                    <Box size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-400 mr-2">Material:</span>
                    <span className="text-white">{product.material}</span>
                  </div>
                )}
                {product?.color && (
                  <div className="flex items-center">
                    <Paintbrush size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-400 mr-2">Color:</span>
                    <span className="text-white">{product.color}</span>
                  </div>
                )}
                {product.vendor?.businessName && (
                  <div className="flex items-center">
                    <Building size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-400 mr-2">Vendor:</span>
                    <span className="text-white">
                      {product.vendor.businessName}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Box size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-400 mr-2">minOrder:</span>
                  <span
                    className={
                      product.minOrder > 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {product.minOrder > 0 ? `${product.minOrder}` : "1"}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    className="bg-gray-700 p-2 rounded-l-md hover:bg-gray-600 transition disabled:opacity-50"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= (product.minOrder || 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>

                  <input
                    type="number"
                    min={product.minOrder || 1}
                    value={quantity}
                    onChange={(e) => {
                      const newValue =
                        parseInt(e.target.value) || product.minOrder;
                      setQuantity(Math.max(newValue, product.minOrder));
                    }}
                    className="bg-gray-900 text-center text-white py-2 px-4 text-lg font-medium w-20 border-t border-b border-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />

                  <button
                    className="bg-gray-700 p-2 rounded-r-md hover:bg-gray-600 transition disabled:opacity-50"
                    onClick={() => handleQuantityChange("increase")}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Design Options */}
              <div className="mb-8">
                <h2 className="text-white text-lg font-medium mb-3">
                  Choose Design Option:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Edit with Canva */}
                  <button
                    onClick={() =>
                      handleDesignOptionSelect(DESIGN_OPTIONS.CANVA)
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === DESIGN_OPTIONS.CANVA
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    } opacity-50 cursor-not-allowed`}
                    disabled
                  >
                    <Edit size={24} className="mb-2" />
                    <span className="block text-sm font-medium">
                      Edit with Canva
                      <br />
                      <span className="text-xs">Coming soon...</span>
                    </span>
                  </button>

                  {/* Hire Designer */}
                  <button
                    onClick={() =>
                      handleDesignOptionSelect(DESIGN_OPTIONS.HIRE)
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === DESIGN_OPTIONS.HIRE
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <Palette size={24} className="mb-2" />
                    <span className="block text-sm font-medium">
                      Hire Designer
                    </span>
                  </button>

                  {/* Upload Design */}
                  <button
                    onClick={() =>
                      handleDesignOptionSelect(DESIGN_OPTIONS.UPLOAD)
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === DESIGN_OPTIONS.UPLOAD
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <Upload size={24} className="mb-2" />
                    <span className="block text-sm font-medium">
                      Upload Design
                    </span>
                  </button>
                </div>

                {/* Upload Design Section */}
                {designOption === DESIGN_OPTIONS.UPLOAD && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Images (Max 5)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gray-500 transition">
                      <div className="space-y-1 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-300 focus-within:outline-none"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5 files (10MB max each)
                        </p>
                        {productImages.length > 0 && (
                          <p className="text-sm text-green-400">
                            {productImages.length} image
                            {productImages.length !== 1 ? "s" : ""} selected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preview uploaded images */}
                    {productImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {productImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-md"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Hire Designer Section */}
                {designOption === DESIGN_OPTIONS.HIRE && (
                  <div className="mt-6 p-6 bg-gray-700 rounded-lg">
                    <h3 className="text-white text-lg font-medium mb-2">
                      Hire a Professional Designer
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Our designers will create custom artwork for your product.
                      You'll receive proofs within 24 hours for review.
                    </p>
                    <button
                      onClick={handleHireDesigner}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition w-full"
                    >
                      <MessageCircle size={20} />
                      Contact Designer via WhatsApp
                    </button>
                    <div className="mt-4 text-sm text-gray-400 space-y-1">
                      <p>• Starting from ₦5,000 per design</p>
                      <p>• 2 free revisions included</p>
                      <p>• 24-48 hour turnaround</p>
                    </div>
                  </div>
                )}

                {/* Canva Editor Section */}
                {designOption === DESIGN_OPTIONS.CANVA && (
                  <div className="mt-6 p-6 bg-gray-700 rounded-lg text-center">
                    <h3 className="text-white text-lg font-medium mb-2">
                      Canva Editor
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Our integrated Canva editor will be available soon. You'll
                      be able to create professional designs directly on our
                      platform.
                    </p>
                    <button
                      disabled
                      className="bg-gray-600 text-gray-400 px-6 py-3 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${
                  processingAction || quantity < product.minOrder
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
                onClick={handleAddToCart}
                disabled={processingAction || quantity < product.minOrder}
              >
                {processingAction ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : quantity < product.minOrder ? (
                  <>Can't order less that {product.minOrder} </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2" size={20} />
                    Add to Cart & Proceed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
