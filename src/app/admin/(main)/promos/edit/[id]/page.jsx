"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft, FiTag, FiCalendar, FiPercent, FiDollarSign, FiHash } from "react-icons/fi";
import { promoService } from "@/app/_services/promoService";
import { toast } from "react-toastify";

export default function EditPromoPage() {
  const router = useRouter();
  const params = useParams();
  const promoId = params.id;
  
  // Add token retrieval like the rest of the code
  const token = localStorage.getItem('adminToken');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  // Load promo data
  useEffect(() => {
    loadPromo();
  }, [promoId]);

  const loadPromo = async () => {
    try {
      setIsLoading(true);
      
      // Add token parameter like the other services
      const response = await promoService.getPromoById(promoId, token);
      
      // Handle the response structure similar to getAllPromos
      let promo = response;
      
      // If response has a data property, use it
      if (response && response.data) {
        promo = response.data;
      }
      
      // Handle potential nested structure
      if (promo && promo.data) {
        promo = promo.data;
      }
      
      if (!promo) {
        throw new Error("Promo not found");
      }
      
      setFormData({
        code: promo.code || "",
        description: promo.description || "",
        discountType: promo.discountType || "percentage",
        discountValue: promo.discountValue || "",
        maxDiscount: promo.maxDiscount || "",
        usageLimit: promo.usageLimit || "",
        expiresAt: promo.expiresAt ? promo.expiresAt.split('T')[0] : "",
      });
    } catch (error) {
      console.error("Error loading promo:", error);
      toast.error("Failed to load promo details");
      router.push("/admin/promos");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = "Promo code is required";
    }
    
    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value is required";
    }
    
    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }
    
    if (!formData.expiresAt) {
      newErrors.expiresAt = "Expiry date is required";
    } else if (new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = "Expiry date must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const promoData = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        expiresAt: formData.expiresAt
      };

      // Add token parameter
      await promoService.updatePromo(promoId, promoData, token);
      
      toast.success("Promo updated successfully!");
      router.push("/admin/promos");
      
    } catch (error) {
      console.error("Error updating promo:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update promo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/promos")}
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
        >
          <FiArrowLeft />
          Back to Promotions
        </button>
        
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
          Edit Promotion: {formData.code}
        </h1>
        <p className="text-gray-400">
          Update the details of this promotional code
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <FiTag /> Promo Code *
                </div>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className={`w-full bg-gray-700 border ${
                  errors.code ? "border-red-500" : "border-gray-600"
                } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                disabled={isSubmitting}
              />
              {errors.code && (
                <p className="mt-2 text-sm text-red-400">{errors.code}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Promo code cannot be changed once created
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows="3"
                disabled={isSubmitting}
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FiPercent /> Discount Type *
                  </div>
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleChange("discountType", "percentage")}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-lg border ${
                      formData.discountType === "percentage"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("discountType", "fixed")}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-lg border ${
                      formData.discountType === "fixed"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Fixed Amount ($)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    {formData.discountType === "percentage" ? (
                      <FiPercent />
                    ) : (
                      <FiDollarSign />
                    )}
                    Discount Value *
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleChange("discountValue", e.target.value)}
                    className={`w-full bg-gray-700 border ${
                      errors.discountValue ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                    disabled={isSubmitting}
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : ""}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    {formData.discountType === "percentage" ? "%" : "$"}
                  </div>
                </div>
                {errors.discountValue && (
                  <p className="mt-2 text-sm text-red-400">{errors.discountValue}</p>
                )}
              </div>
            </div>

            {/* Max Discount & Usage Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Discount (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => handleChange("maxDiscount", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">$</div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Maximum discount amount (for percentage discounts)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FiHash /> Usage Limit (Optional)
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  min="0"
                  disabled={isSubmitting}
                />
                <p className="mt-2 text-sm text-gray-400">
                  Leave empty for unlimited usage
                </p>
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <FiCalendar /> Expiry Date *
                </div>
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => handleChange("expiresAt", e.target.value)}
                className={`w-full md:w-1/2 bg-gray-700 border ${
                  errors.expiresAt ? "border-red-500" : "border-gray-600"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
              {errors.expiresAt && (
                <p className="mt-2 text-sm text-red-400">{errors.expiresAt}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/promos")}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}