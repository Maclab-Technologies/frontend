// Updated Vendor Dashboard with reusable product form and fixed delete modal
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaPlus,
  FaMoneyBillWave,
  FaWallet,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaFileDownload,
  FaFileUpload,
  FaCheck,
  FaClock,
  FaTrash,
  FaEdit,
  FaDollarSign,
} from "react-icons/fa";
import { auth } from "../../utils/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./productform";
// // Reusable Product Form Component
// const ProductForm = ({
//   product = null,
//   onSubmit,
//   onCancel,
//   isSubmitting = false,
// }) => {
//   const [productName, setProductName] = useState(product?.name || "");
//   const [productDescription, setProductDescription] = useState(
//     product?.description || ""
//   );
//   const [productPrice, setProductPrice] = useState(product?.price || "");
//   const [discountPercent, setDiscountPercentage] = useState(
//     product?.discountPercent || ""
//   );
//   const [ discountPrice, setDiscountPrice ] = useState(product?.discountPrice || "")
//   const [category, setCategory] = useState(product?.category || "");
//   const [stock, setStock] = useState(product?.stock || "");
//   const [productMaterial, setProductMaterial] = useState(
//     product?.material || ""
//   );
//   const [selectedColors, setSelectedColors] = useState(product?.color || []);
//   const [productImages, setProductImages] = useState([]);
//   const [existingImages, setExistingImages] = useState(product?.images || []);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length + productImages.length > 5) {
//       toast.error("You can only upload up to 5 images.");
//       return;
//     }

//     const validImages = files.filter((file) =>
//       ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
//     );

//     if (validImages.length !== files.length) {
//       toast.warning(
//         "Some files were not valid image formats and were skipped."
//       );
//     }

//     setProductImages((prev) => [...prev, ...validImages]);
//   };

//   const handleRemoveImage = (index, isExisting = false) => {
//     if (isExisting) {
//       setExistingImages(existingImages.filter((_, i) => i !== index));
//     } else {
//       setProductImages(productImages.filter((_, i) => i !== index));
//     }
//   };

//   const handleColorToggle = (color) => {
//     if (selectedColors.includes(color)) {
//       setSelectedColors(selectedColors.filter((c) => c !== color));
//     } else {
//       setSelectedColors([...selectedColors, color]);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       !productName ||
//       !productDescription ||
//       !productPrice ||
//       !productMaterial ||
//       selectedColors.length === 0
//     ) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const productData = {
//       name: productName,
//       description: productDescription,
//       price: parseFloat(productPrice),
//       discountPercent: parseFloat(discountPercent) || 0,
//       category,
//       stock: parseInt(stock) || 0,
//       material: productMaterial,
//       color: selectedColors,
//       images: productImages,
//       existingImages,
//     };

//     onSubmit(productData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Product name and category */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Product Name
//           </label>
//           <input
//             type="text"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             placeholder="e.g. Business Cards"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Category
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             required
//           >
//             <option value="">Select Category</option>
//             <option value="Apparel">Apparel</option>
//             <option value="Banners">Banners</option>
//             <option value="Brochures">Brochures</option>
//             <option value="Business Cards">Business Cards</option>
//             <option value="Flyers">Flyers</option>
//             <option value="Invitation Cards">Invitation Cards</option>
//             <option value="Merchandise">Merchandise</option>
//             <option value="Posters">Posters</option>
//             <option value="Stationery">Stationery</option>
//             <option value="Stickers">Stickers</option>
//             <option value="shirt design">shirt design</option>
//           </select>
//         </div>
//       </div>

//       {/* Product description */}
//       <div>
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Description
//           </label>
//           <textarea
//             value={productDescription}
//             onChange={(e) => setProductDescription(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             placeholder="Product description"
//             required
//             rows={6}
//           ></textarea>
//         </div>
//       </div>

//       {/* Product price, discount, and min order */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Price (₦)
//           </label>
//           <input
//             type="number"
//             value={productPrice}
//             onChange={(e) => setProductPrice(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             placeholder="Price in Naira"
//             min="0"
//             step="0.01"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Discount (%)
//           </label>
//           <input
//             type="number"
//             value={discountPercent}
//             onChange={(e) => setDiscountPercentage(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             placeholder="0"
//             min="0"
//             max="100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Stock Quantity
//           </label>
//           <div className="flex gap-2">
//             <select
//               value={stock}
//               onChange={(e) => setStock(e.target.value)}
//               className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             >
//               <option value="">Select quantity</option>
//               <option value="10">10</option>
//               <option value="50">50</option>
//               <option value="100">100</option>
//               <option value="500">500</option>
//               <option value="1000">1000</option>
//             </select>
//             <input
//               type="number"
//               min="1"
//               value={stock}
//               onChange={(e) => setStock(e.target.value)}
//               className="w-32 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Custom quantity"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Product material and color */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-1">
//             Material
//           </label>
//           <input
//             type="text"
//             value={productMaterial}
//             onChange={(e) => setProductMaterial(e.target.value)}
//             className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             placeholder="e.g. Glossy Paper, Matte, etc."
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Available Colors
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {[
//               "Red",
//               "Blue",
//               "Green",
//               "Black",
//               "White",
//               "Yellow",
//               "Full Color",
//             ].map((color) => (
//               <button
//                 key={color}
//                 type="button"
//                 onClick={() => handleColorToggle(color)}
//                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
//                   ${
//                     selectedColors.includes(color)
//                       ? "bg-yellow-500 text-black"
//                       : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
//                   }`}
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Upload pictures */}
//       <div>
//         <label className="block text-sm font-medium text-gray-300 mb-1">
//           Upload Images (Max 5)
//         </label>
//         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
//           <div className="space-y-1 text-center">
//             <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
//             <div className="flex text-sm text-gray-400">
//               <label
//                 htmlFor="file-upload"
//                 className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-300 focus-within:outline-none"
//               >
//                 <span>Upload files</span>
//                 <input
//                   id="file-upload"
//                   name="file-upload"
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   className="sr-only"
//                   onChange={handleImageUpload}
//                 />
//               </label>
//               <p className="pl-1">or drag and drop</p>
//             </div>
//             <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5 files</p>
//             {(productImages.length > 0 || existingImages.length > 0) && (
//               <p className="text-sm text-green-400">
//                 {productImages.length + existingImages.length} images selected
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Image previews */}
//       <div className="flex flex-wrap gap-2 mt-4">
//         {existingImages.map((image, index) => (
//           <div key={`existing-${index}`} className="relative">
//             <img
//               src={image}
//               alt={`existing-${index}`}
//               className="w-24 h-24 object-cover rounded-md border border-gray-400"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveImage(index, true)}
//               className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//         {productImages.map((file, index) => (
//           <div key={`new-${index}`} className="relative">
//             <img
//               src={URL.createObjectURL(file)}
//               alt={`upload-${index}`}
//               className="w-24 h-24 object-cover rounded-md border border-gray-400"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveImage(index)}
//               className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors disabled:opacity-70"
//         >
//           {isSubmitting ? (
//             <span className="flex items-center justify-center">
//               <svg
//                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               {product ? "Updating..." : "Creating..."}
//             </span>
//           ) : (
//             <span>{product ? "Update Product" : "Create Product"}</span>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// Delete Confirmation Modal
const DeleteConfirmationModal = ({
  product,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete this product?
          </p>
          {product && (
            <div className="bg-gray-900 p-3 rounded border border-gray-700">
              <p className="font-semibold text-white">{product.name}</p>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-yellow-400 font-bold">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          )}
          <p className="text-red-400 text-sm mt-3">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors disabled:opacity-70"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // State for bank details in Withdraw tab
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    available: 0,
    total: 0,
    pending: 0,
  });
  const [payouts, setPayouts] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [vendorToken, setVendorToken] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data and initial content
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem("vendor_token");
        const data = JSON.parse(localStorage.getItem("vendor_data"));

        if (!token || !data) {
          router.push("/Vendor/Login");
          return;
        }

        setVendorToken(token);
        setVendorData(data);

        // Fetch vendor products
        const vendorProductsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/vendor/${data.id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!vendorProductsResponse.ok) {
          toast.error("Failed to fetch products");
        }

        const vendorProductsData = await vendorProductsResponse.json();
        console.log(vendorProductsData);
        setProducts(vendorProductsData?.data || []);

        // Fetch vendor orders
        const vendorOrdersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/vendor/${data.id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (vendorOrdersResponse.ok) {
          const vendorOrdersData = await vendorOrdersResponse.json();
          setOrders(vendorOrdersData?.data || []);
        }

        // Fetch vendor earnings
        const vendorEarningsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors/earnings/${data.id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (vendorEarningsResponse.ok) {
          const vendorEarningsData = await vendorEarningsResponse.json();
          setEarnings(
            vendorEarningsData?.data || {
              available: 0,
              total: 0,
              pending: 0,
            }
          );
        }

        // Fetch vendor payouts
        const vendorPayoutsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors/payouts/${data.id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (vendorPayoutsResponse.ok) {
          const vendorPayoutsData = await vendorPayoutsResponse.json();
          setPayouts(vendorPayoutsData?.data || []);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("vendor_token");
      localStorage.removeItem("vendor_data");
      toast.success("Logged out successfully");
      router.push("/Vendor/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key === "color") {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === "images") {
          productData.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key !== "existingImages") {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/create/${vendorData.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const responseData = await response.json();
      setProducts((prev) => [...prev, responseData.data]);
      toast.success("Product created successfully!");
      setShowProductForm(false);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key === "color") {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === "images") {
          productData.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key === "existingImages") {
          formData.append("existingImages", JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/edit/${productToEdit.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const responseData = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productToEdit.id ? responseData.data : p))
      );
      toast.success("Product updated successfully!");
      setShowProductForm(false);
      setProductToEdit(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${vendorToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowProductForm(true);
  };

  const handleCancelEdit = () => {
    setShowProductForm(false);
    setProductToEdit(null);
  };

  const handleSubmitWithdrawal = (e) => {
    e.preventDefault();

    if (!bankName || !accountNumber || !accountName || !withdrawAmount) {
      toast.error("Please fill all bank details");
      return;
    }

    if (parseFloat(withdrawAmount) > earnings.available) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    // In a real app, this would send a request to the backend
    const newPayout = {
      id: `PYT-00${payouts.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      amount: `₦${parseFloat(withdrawAmount).toLocaleString()}`,
      status: "Pending",
      txnId: `TXN${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setPayouts([newPayout, ...payouts]);
    setEarnings({
      ...earnings,
      available: earnings.available - parseFloat(withdrawAmount),
      pending: earnings.pending + parseFloat(withdrawAmount),
    });

    toast.success("Withdrawal request submitted");
    setWithdrawAmount("");
  };

  const handleDesignLinkSubmit = (orderId, link) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, designLink: link, status: "In Review" }
          : order
      )
    );
    toast.success("Design link submitted for review");
  };

  // Tab components
  const tabs = {
    "Dashboard": (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-yellow-400">
              {vendorData?.name || "Vendor"}
            </span>
          </h1>
          <p className="text-gray-300 mb-6">
            Quick overview of your products and orders
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBoxOpen className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Products</p>
                  <p className="text-xl font-bold text-white">
                    {products.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaClipboardList className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Orders</p>
                  <p className="text-xl font-bold text-white">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaMoneyBillWave className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Available Balance</p>
                  <p className="text-xl font-bold text-white">
                    ₦{earnings.available.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <p
                  className={`font-bold ${
                    order.status === "Completed"
                      ? "text-green-400"
                      : order.status === "Processing"
                        ? "text-blue-400"
                        : order.status === "In Review"
                          ? "text-purple-400"
                          : "text-yellow-400"
                  }`}
                >
                  {order.status}
                </p>
                <p className="text-sm">{order.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    "Orders": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white text-white`}
            >
              All
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-yellow-400 text-yellow-400`}
            >
              Pending
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-purple-400 text-purple-400`}
            >
              In Review
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-opacity-20 hover:bg-opacity-30 bg-green-400 text-green-400`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.clientName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "In Review"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.total}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {order.files.map((file, index) => (
                        <button
                          key={index}
                          className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaFileDownload className="mr-1" />
                          <span className="truncate max-w-xs">{file}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.status === "Pending" ||
                    order.status === "Processing" ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Enter design link"
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-48 mr-2"
                          defaultValue={order.designLink}
                        />
                        <button
                          onClick={() =>
                            handleDesignLinkSubmit(
                              order.id,
                              document.querySelector(
                                `input[placeholder="Enter design link"]`
                              ).value
                            )
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-3 rounded text-xs"
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-green-400 flex items-center">
                          <FaCheck className="mr-1" /> Design Submitted
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),

    "Create Product": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Product</h1>
          <button
            onClick={() => setShowProductForm(true)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
          >
            <FaPlus className="mr-1 inline" /> Create Product
          </button>
        </div>

        {products.length === 0 && !showProductForm && (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">
              You haven't created any products yet
            </p>
            <button
              onClick={() => setShowProductForm(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
            >
              Create Your First Product
            </button>
          </div>
        )}

        {showProductForm && (
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setShowProductForm(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    ),

    "Manage Products": (
      <div className="bg-gray-800 rounded-lg p-6 text-white relative">
        <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">
              No products available. Create your first product!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="w-full h-48 bg-gray-800">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="font-bold text-yellow-400">
                      ₦{product.discountPrice?.toLocaleString()}
                      <br />
                      <s style={{ fontSize: "12px", color: "red" }}>
                        ₦{product.price.toLocaleString()}
                      </s>
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.color &&
                      product.color.map((color, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-700 text-xs rounded-full"
                        >
                          {color}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>Material: {product.material}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && productToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <ProductForm
                product={productToEdit}
                onSubmit={handleUpdateProduct}
                onCancel={handleCancelEdit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmationModal
            product={productToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    ),

    "Earnings": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Your Earnings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Available Balance</h3>
              <FaMoneyBillWave className="text-green-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              ₦{earnings.available.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">Ready to withdraw</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Total Earnings</h3>
              <FaDollarSign className="text-yellow-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              ₦{earnings.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">Lifetime earnings</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Pending</h3>
              <FaClock className="text-blue-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              ₦{earnings.pending.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">Processing withdrawals</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Commission Rate</span>
              <span className="text-sm font-medium">80%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              You receive 80% of each sale, 20% goes to platform fee
            </p>
          </div>

          <h3 className="font-medium mb-3">Monthly Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    June 2023
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">12</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦48,000
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                    ₦38,400
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    May 2023
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">15</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦65,000
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                    ₦52,000
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    April 2023
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">8</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₦32,000
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                    ₦25,600
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),

    "Withdraw": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-sm text-gray-400">Available Balance</span>
              <h2 className="text-3xl font-bold text-green-400">
                ₦{earnings.available.toLocaleString()}
              </h2>
            </div>

            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Minimum Withdrawal</span>
              <p className="text-lg font-medium">₦5,000</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter account holder name"
                />
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="5000"
                  max={earnings.available}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter amount to withdraw"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum withdrawal: ₦5,000 | Available: ₦
                  {earnings.available.toLocaleString()}
                </p>
              </div>

              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
                <h3 className="font-medium mb-2">Withdrawal Notes</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Withdrawals are processed within 24-48 hours</li>
                  <li>• All bank details must be accurate</li>
                  <li>• 80% commission is paid on all sales</li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
                >
                  Request Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payouts.slice(0, 3).map((payout, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {payout.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {payout.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payout.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),

    "Payouts Received": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Payouts History</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Total Payouts</p>
              <p className="text-2xl font-bold">
                ₦
                {payouts
                  .filter((p) => p.status === "Paid")
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold">
                ₦
                {payouts
                  .filter(
                    (p) =>
                      p.status === "Paid" &&
                      new Date(p.date).getMonth() === new Date().getMonth()
                  )
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                ₦
                {payouts
                  .filter((p) => p.status === "Pending")
                  .reduce(
                    (sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, "")),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payouts.map((payout, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {payout.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {payout.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {payout.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payout.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {payout.txnId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {payout.status === "Paid" && (
                      <button className="text-blue-400 hover:text-blue-300 flex items-center">
                        <FaFileDownload className="mr-1" /> Download
                      </button>
                    )}
                    {payout.status === "Pending" && (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Top Navigation Bar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden mr-4 text-white focus:outline-none"
              >
                {mobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <h1 className="text-xl font-bold">
                <span className="text-yellow-400">59Minutes</span>Print
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm hover:text-yellow-400 transition"
              >
                <FaSignOutAlt className="mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside
            className={`
            fixed inset-y-0 left-0 z-40 
            w-64 bg-gray-800 shadow-lg 
            transform transition-transform duration-300 ease-in-out rounded
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64
            mt-14 lg:mt-0
          `}
          >
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-1 right-2">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
                  <FaUser className="text-yellow-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">
                    {vendorData?.name || "Vendor"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {vendorData?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
              <button
                onClick={() => {
                  setActiveTab("Dashboard");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Dashboard"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHome />
                </span>
                <span className="text-left">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Orders");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Orders"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaClipboardList />
                </span>
                <span className="text-left">Orders</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Create Product");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Create Product"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaPlus />
                </span>
                <span className="text-left">Create Product</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Manage Products");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Manage Products"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaBoxOpen />
                </span>
                <span className="text-left">Manage Products</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Earnings");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Earnings"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaMoneyBillWave />
                </span>
                <span className="text-left">Earnings</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Withdraw");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Withdraw"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaWallet />
                </span>
                <span className="text-left">Withdraw</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("Payouts Received");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "Payouts Received"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHistory />
                </span>
                <span className="text-left">Payouts Received</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-4 flex lg:hidden items-center">
              {mobileNavOpen && (
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center text-sm text-yellow-400 mr-4"
                >
                  <FaTimes className="mr-1" /> Close Menu
                </button>
              )}
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            </div>

            {tabs[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}
