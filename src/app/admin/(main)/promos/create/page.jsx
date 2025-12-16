// app/(admin)/admin/promos/create/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiTag, FiCalendar, FiPercent, FiDollarSign, FiHash, FiInfo } from "react-icons/fi";
import { promoService } from "@/app/_services/promoService";
import { toast } from "react-toastify";

export default function CreatePromoPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  const token = localStorage.getItem('adminToken');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => {
    // Pre-fill with Christmas template if specified
    const currentYear = new Date().getFullYear();
    
    
    
    
    // Default empty form
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      maxDiscount: "",
      usageLimit: "",
      expiresAt: nextMonth.toISOString().split('T')[0],
    };
  });

  // Validate promo code in real-time
  const checkPromoCode = async () => {
    if (!formData.code || formData.code.length < 3) return;
    
    setIsChecking(true);
    try {
      const response = await promoService.validatePromoCode(formData.code, token) ;
      if (response.data?.isValid === false) {
        setErrors(prev => ({ ...prev, code: "Promo code already exists" }));
      } else {
        setErrors(prev => ({ ...prev, code: null }));
      }
    } catch (error) {
      // Silently handle error - validation endpoint might not exist yet
    } finally {
      setIsChecking(false);
    }
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      checkPromoCode();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.code]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = "Promo code is required";
    } else if (formData.code.length < 4) {
      newErrors.code = "Promo code must be at least 4 characters";
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

      const response = await promoService.createPromo(promoData, token);
      
      toast.success("Promo created successfully!");
      router.push("/admin/promos");
      
    } catch (error) {
      console.error("Error creating promo:", error);
      
      // Handle specific backend errors
      if (error.response?.data?.message?.includes("already exists")) {
        setErrors(prev => ({ ...prev, code: "Promo code already exists" }));
        toast.error("Promo code already exists");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create promo");
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
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

 

  const applyChristmasPreset = (value, days) => {
    const currentYear = new Date().getFullYear();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    setFormData({
      ...formData,
      discountValue: value,
      code: `CHRISTMAS${value}_${currentYear}`,
      description: `Christmas Special - ${value}% off on all orders`,
      expiresAt: expiryDate.toISOString().split('T')[0],
    });
  };

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
          {template === "christmas" ? (
            <span className="flex items-center gap-2">
              <span>🎄</span> Create Christmas Promotion
            </span>
          ) : "Create New Promotion"}
        </h1>
        <p className="text-gray-400">
          Fill in the details below to create a new promotional code
        </p>
      </div>

      {/* Christmas Presets */}
      {template === "christmas" && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-900/20 to-green-900/20 border border-red-800/30 rounded-lg">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FiInfo /> Quick Christmas Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {christmasPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyChristmasPreset(preset.value, preset.days)}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-white">{preset.label}</div>
                <div className="text-sm text-gray-400">Expires in {preset.days} days</div>
              </button>
            ))}
          </div>
        </div>
      )}

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
              <div className="relative">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className={`w-full bg-gray-700 border ${
                    errors.code ? "border-red-500" : "border-gray-600"
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="e.g., CHRISTMAS2024, WELCOME10"
                />
                {isChecking && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                  </div>
                )}
              </div>
              {errors.code && (
                <p className="mt-2 text-sm text-red-400">{errors.code}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Use uppercase letters, numbers, and underscores only
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
                placeholder="Describe your promotion..."
                rows="3"
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
                    className={`flex-1 py-3 rounded-lg border ${
                      formData.discountType === "percentage"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("discountType", "fixed")}
                    className={`flex-1 py-3 rounded-lg border ${
                      formData.discountType === "fixed"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
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
                    placeholder={formData.discountType === "percentage" ? "e.g., 15" : "e.g., 50"}
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
                    placeholder="e.g., 100"
                    min="0"
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
                  placeholder="e.g., 1000"
                  min="0"
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
              {isSubmitting ? "Creating..." : "Create Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}