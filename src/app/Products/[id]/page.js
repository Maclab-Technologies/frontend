"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  Tag
} from "lucide-react";

// Helper function to normalize MongoDB documents
const normalizeMongoId = (item) => {
  if (!item) return null;
  const normalized = { ...item };
  
  // Ensure _id is converted to string if it exists
  if (normalized._id && typeof normalized._id === 'object') {
    normalized._id = normalized._id.toString();
  }
  
  // Add id property if it doesn't exist
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id.toString();
  }
  
  return normalized;
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [designOption, setDesignOption] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/Products");
      return;
    }
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product details.");
        }
  
        const data = await res.data.json();

        console.log(data)
        if (Array.isArray(data)) {
          const foundProduct = data.find((p) => p.id === id || p._id === id);
          if (foundProduct) {
            const normalizedProduct = normalizeMongoId(foundProduct);
            setProduct(normalizedProduct);
            setSelectedImage(normalizedProduct.images?.[0]);
          } else {
            toast.error("Product not found!");
            router.push("/Products");
          }
        } else if (data && typeof data === 'object') {
          // Normalize MongoDB document
          const normalizedProduct = normalizeMongoId(data.data || data);
          setProduct(normalizedProduct);
          setSelectedImage(normalizedProduct.images?.[0]);
        } else {
          toast.error("Invalid product data received");
          router.push("/Products");
        }
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

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleThumbnailSelect = (img) => {
    setImageLoading(true);
    setSelectedImage(img);
  };

  const handleDesignOptionSelect = (option) => {
    setDesignOption(option);
  };

  const getDesignRoute = (option) => {
    switch(option) {
      case "Hire Graphics Designer":
        return "/Pages/Hire-designer";
      case "Edit with Canva":
        return "/Pages/edit-canvas";
      case "Upload Your Own Design":
        return "/Pages/Upload-design";
      default:
        return null;
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!designOption) {
      toast.warning("Please select a design option first", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setProcessingAction(true);

    try {
      const cartItem = {
        id: product.id || (product._id?.toString()),
        name: product.name,
        price: product.price,
        image: selectedImage || product.images?.[0],
        quantity,
        designOption,
      };

      let existingCart = [];
      
      try {
        existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      } catch (e) {
        console.error("Error parsing cart data:", e);
        existingCart = [];
      }

      const existingItemIndex = existingCart.findIndex((item) => 
        (item.id === product.id || item.id === product._id?.toString()) && item.designOption === designOption
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event("cartUpdated"));
      }
      
      const designInfo = {
        productId: product.id || product._id?.toString(),
        productName: product.name,
        productImage: selectedImage || product.images?.[0],
        quantity: quantity,
        price: product.price,
        designOption: designOption
      };
      
      localStorage.setItem("currentDesignInfo", JSON.stringify(designInfo));

      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });

      const designRoute = getDesignRoute(designOption);
      if (designRoute) {
        setTimeout(() => {
          router.push(designRoute);
        }, 500);
      } else {
        setProcessingAction(false);
      }
    } catch (error) {
      console.error("Error processing cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
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
            
            <div className="lg:w-1/2 p-6 md:p-8">
              <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <Image 
                  src={selectedImage || (product?.images?.[0] || "/fallback-image.png")} 
                  alt={product?.name || "Product Image"} 
                  width={600} 
                  height={600}
                  className="object-contain w-full h-full"
                  onLoad={() => setImageLoading(false)}
                  priority
                />
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3">
                {product?.images?.map((img, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === img ? 'border-yellow-400' : 'border-transparent'
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
            </div>

            <div className="lg:w-1/2 p-6 md:p-8 lg:border-l border-gray-700">
              <div className="mb-2 text-yellow-400 text-sm font-medium flex items-center">
                <Tag size={14} className="mr-1" />
                {product?.category || "Uncategorized"}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {product?.name || "Product Name"}
              </h1>
              
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                ₦{parseInt(product?.price || 0).toLocaleString()}
              </div>
              
              <div className="mb-6 text-gray-300">
                {product?.description || "No description available."}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-8">
                <div className="flex items-center">
                  <Box size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-400 mr-2">Material:</span>
                  <span className="text-white">{product?.material || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Paintbrush size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-400 mr-2">Color:</span>
                  <span className="text-white">{product?.color || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Building size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-400 mr-2">Vendor:</span>
                  <span className="text-white">{product?.vendor || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-400 mr-2">Ownership:</span>
                  <span className="text-white">{product?.ownership || "N/A"}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-700 p-2 rounded-l-md hover:bg-gray-600 transition" 
                    onClick={() => handleQuantityChange("decrease")}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="bg-gray-900 text-center text-white py-2 px-6 text-lg font-medium">
                    {quantity}
                  </div>
                  <button 
                    className="bg-gray-700 p-2 rounded-r-md hover:bg-gray-600 transition" 
                    onClick={() => handleQuantityChange("increase")}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-white text-lg font-medium mb-3">Choose Design Option:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDesignOptionSelect("Hire Graphics Designer")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === "Hire Graphics Designer" 
                        ? "bg-yellow-400 text-black" 
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <Palette size={24} className="mb-2" />
                    <span className="block text-sm font-medium">Hire Designer</span>
                  </button>

                  <button
                    onClick={() => handleDesignOptionSelect("Edit with Canva")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === "Edit with Canva" 
                        ? "bg-yellow-400 text-black" 
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <Edit size={24} className="mb-2" />
                    <span className="block text-sm font-medium">Edit with Canva</span>
                  </button>

                  <button
                    onClick={() => handleDesignOptionSelect("Upload Your Own Design")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition ${
                      designOption === "Upload Your Own Design" 
                        ? "bg-yellow-400 text-black" 
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <Upload size={24} className="mb-2" />
                    <span className="block text-sm font-medium">Upload Design</span>
                  </button>
                </div>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${
                  processingAction || product.stock <= 0
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
                onClick={handleAddToCart}
                disabled={processingAction || product.stock <= 0}
              >
                {processingAction ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : product.stock <= 0 ? (
                  <>Out of Stock</>
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