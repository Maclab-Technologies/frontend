
"use client";

import { useState, useEffect, useContext } from "react";
import LoadingMiddleware from "@/app/_components/loading";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import ProductForm from "./productform";
import { VendorAuthContext } from "../_provider/useVendorProvider";
import { toast } from "react-toastify";

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
export default function ManageProducts({
  products, setProducts
}) {
    const { vendorToken } = useContext(VendorAuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProduct = async ( productData) => {
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

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white relative">
      <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>

      {loading && <LoadingMiddleware />}
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
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">
                      ₦{product.discountPrice?.toLocaleString()}
                    </p>
                    <p className="text-sm line-through text-red-400">
                      ₦{product.price?.toLocaleString()}
                    </p>
                  </div>
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
                  <span>Min Order: {product.minOrder}</span>
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
  );
}
