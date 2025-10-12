"use clinet";

import { useState, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import ProductForm from "./productform";
import { toast } from "react-toastify";
import { VendorAuthContext } from "../_provider/useVendorProvider";
import { post } from "../../_hooks/fetch-hook";


export default function CreateProduct({
  products, setProducts
}) {
    const { vendorToken, authVendor } = useContext(VendorAuthContext);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key === "color") {
          const colors = Array.isArray(productData[key])
            ? productData[key]
            : productData[key].split(",").map((c) => c.trim());
          formData.append(key, JSON.stringify(colors));
        } else if (key === "images") {
          productData.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key !== "existingImages") {
          formData.append(key, productData[key]);
        }
      });

      const response = await post(
        `/products/create/${authVendor.id}`,
        formData,
        {
          token: vendorToken,
        }
      );

      if (response.success) {
        setProducts((prev) => [...prev, response.data]);
        toast.success("Product created successfully!");
        setShowProductForm(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          minimum
          quantity
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
