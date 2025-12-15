"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  FiArrowLeft, FiTag, FiCalendar, FiPercent, FiDollarSign, 
  FiHash, FiClock, FiEdit, FiCopy, FiTrash2 
} from "react-icons/fi";
import { promoService } from "@/app/_services/promoService";
import { toast } from "react-toastify";

export default function ViewPromoPage() {
  const router = useRouter();
  const params = useParams();
  const promoId = params.id;
  
  const [promo, setPromo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load promo data
  useEffect(() => {
    loadPromo();
  }, [promoId]);

  const loadPromo = async () => {
    try {
      setIsLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        router.push("/admin/login");
        return;
      }

      const response = await promoService.getPromoById(promoId, token);
      
      let promoData = response;
      
      if (response && response.data) {
        promoData = response.data;
      }
      
      if (promoData && promoData.data) {
        promoData = promoData.data;
      }
      
      if (!promoData) {
        throw new Error("Promo not found");
      }
      
      setPromo(promoData);
    } catch (error) {
      console.error("Error loading promo:", error);
      toast.error("Failed to load promo details");
      router.push("/admin/promos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete promo "${promo?.code}"? This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        router.push("/admin/login");
        return;
      }

      const response = await promoService.deletePromo(promoId, token);
      
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to delete promo");
      }
      
      toast.success("Promo deleted successfully");
      router.push("/admin/promos");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete promo");
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        router.push("/admin/login");
        return;
      }

      const timestamp = Date.now().toString().slice(-6);
      const baseCode = promo.code.replace(/_COPY_\d+$/, '').replace(/_DUPLICATE_\d+$/, '');
      const newCode = `${baseCode}_COPY_${timestamp}`;
      
      const newPromo = {
        code: newCode,
        description: `${promo.description} (Copy)`,
        discountType: promo.discountType || 'percentage',
        discountValue: Number(promo.discountValue) || 0,
        maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
        usageLimit: promo.usageLimit ? Number(promo.usageLimit) : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      const response = await promoService.createPromo(newPromo, token);
      
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to duplicate promo");
      }
      
      toast.success(`Promo duplicated as "${newCode}"`);
      router.push("/admin/promos");
    } catch (error) {
      console.error("Duplicate error:", error);
      toast.error(error.message || "Failed to duplicate promo");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusInfo = (expiresAt) => {
    if (!expiresAt) {
      return { status: "No Date", color: "text-gray-400", bg: "bg-gray-900/20", days: 0 };
    }
    
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      
      if (isNaN(expiry.getTime())) {
        return { status: "Invalid Date", color: "text-gray-400", bg: "bg-gray-900/20", days: 0 };
      }
      
      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (expiry < now) {
        return { status: "Expired", color: "text-red-400", bg: "bg-red-900/20", days: 0 };
      } else if (diffDays <= 7) {
        return { status: "Ending Soon", color: "text-yellow-400", bg: "bg-yellow-900/20", days: diffDays };
      } else {
        return { status: "Active", color: "text-green-400", bg: "bg-green-900/20", days: diffDays };
      }
    } catch {
      return { status: "Date Error", color: "text-gray-400", bg: "bg-gray-900/20", days: 0 };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading promo details...</p>
        </div>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="p-4 md:p-6 text-center">
        <h1 className="text-xl font-bold text-white mb-4">Promo Not Found</h1>
        <button
          onClick={() => router.push("/admin/promos")}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 justify-center"
        >
          <FiArrowLeft />
          Back to Promotions
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(promo.expiresAt);
  const isChristmasPromo = promo.code.includes("CHRISTMAS") || promo.code.includes("XMAS") || 
                           promo.description?.toLowerCase().includes("christmas");

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <button
            onClick={() => router.push("/admin/promos")}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
          >
            <FiArrowLeft />
            Back to Promotions
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
            Promo Code: {promo.code}
            {isChristmasPromo && (
              <span className="ml-3 text-lg">🎄</span>
            )}
          </h1>
          <p className="text-gray-400">
            Created on {formatDate(promo.createdAt)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => router.push(`/admin/promos/edit/${promoId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
          >
            <FiCopy /> Duplicate
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors ${
              isDeleting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 /> Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${statusInfo.bg} border-current/20`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-semibold ${statusInfo.color} flex items-center gap-2`}>
              <FiClock />
              {statusInfo.status}
              {statusInfo.days > 0 && ` - ${statusInfo.days} days remaining`}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Expires on {formatDate(promo.expiresAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Promo Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiTag /> Description
            </h3>
            <p className="text-gray-300">
              {promo.description || "No description provided"}
            </p>
          </div>

          {/* Discount Details */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4">Discount Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount Type</span>
                <span className="text-white font-medium flex items-center gap-2">
                  {promo.discountType === "percentage" ? (
                    <><FiPercent /> Percentage</>
                  ) : (
                    <><FiDollarSign /> Fixed Amount</>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount Value</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {promo.discountValue || 0}
                  {promo.discountType === "percentage" ? "%" : "$"}
                </span>
              </div>
              {promo.maxDiscount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Maximum Discount</span>
                  <span className="text-white font-medium">${promo.maxDiscount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Usage Limits */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiHash /> Usage Limits
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Usage Limit</span>
                <span className="text-white font-medium">
                  {promo.usageLimit || "Unlimited"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Used Count</span>
                <span className="text-white font-medium">
                  {promo.usedCount || 0} / {promo.usageLimit || "∞"}
                </span>
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiCalendar /> Validity Period
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Created Date</span>
                <span className="text-white">{formatDate(promo.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Updated Date</span>
                <span className="text-white">{formatDate(promo.updatedAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Expiry Date</span>
                <span className="text-white">{formatDate(promo.expiresAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code Display */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-4">Promo Code</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <code className="text-xl md:text-2xl font-mono font-bold text-yellow-400 bg-gray-900 px-4 py-3 rounded-lg flex-1">
            {promo.code}
          </code>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(promo.code);
                toast.success("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
            >
              <FiCopy /> Copy Code
            </button>
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <FiCopy /> Duplicate
            </button>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Customers can use this code at checkout to apply the discount
        </p>
      </div>
    </div>
  );
}