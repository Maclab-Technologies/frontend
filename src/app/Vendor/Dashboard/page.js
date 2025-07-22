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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./productform";
import { batchRequests } from "@/app/hooks/fetch-hook";
import Dashboard from "../Components/dashboard";
import AddProduct from "../Components/create-product";
import ManageProducts from "../Components/manage-product";
import Earnings from "../Components/earning";
import Withdraw from "../Components/withdraw";
import Payout from "../Components/payout";

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
  const [earnings, setEarnings] = useState({});
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

        // Using batchRequests for parallel API calls
        const result = await batchRequests([
          {
            url: `/products/vendor/${data.id}`,
            options: {
              // Fixed: was 'option', should be 'options'
              method: "GET",
              token,
              config: { showToast: false }, // Disable individual toasts
            },
          },
          {
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/vendors/earnings/${data.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            url: `/vendors/payouts/${data.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
        ]);

        // Destructure results (batchRequests returns array in same order)
        const [productsResult, ordersResult, earningsResult, payoutsResult] =
          result;

        // Handle products
        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        } else if (!productsResult._failed) {
          toast.error("Failed to fetch products");
        }

        // Handle orders
        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        } else if (!ordersResult._failed) {
          toast.error("Failed to fetch orders");
        }

        // Handle earnings
        if (earningsResult.success) {
          setEarnings(
            earningsResult.data?.data || {
              available: 0,
              total: 0,
              pending: 0,
            }
          );
        } else if (!earningsResult._failed) {
          toast.error("Failed to fetch earnings");
        }

        // Handle payouts
        if (payoutsResult.success) {
          setPayouts(payoutsResult.data?.data || []);
        } else if (!payoutsResult._failed) {
          toast.error("Failed to fetch payouts");
        }

        // Check if any critical requests failed
        const criticalFailures = result.filter((r) => r._failed).length;
        if (criticalFailures > 0) {
          toast.warning(
            `${criticalFailures} requests failed. Some data may be incomplete.`
          );
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

  // const handleLogout = async () => {
  //   try {
  //     localStorage.removeItem("vendor_token");
  //     localStorage.removeItem("vendor_data");
  //     toast.success("Logged out successfully");
  //     router.push("/Vendor/Login");
  //   } catch (error) {
  //     toast.error("Error signing out");
  //     console.error("Logout error:", error);
  //   }
  // };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const tabs ={
    <Dashboard 
      vendorData={vendorData}
      orders={orders}
      products={products}
      earnings={earnings}
    />
    <AddProduct />
    <ManageProducts />
    <Earnings />
    <Withdraw />
    <Payout />  
  }
  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={5000} />

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
                    {vendorData?.businessName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {vendorData?.businessEmail || "Guest@59minutesprints.com"}
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
