"use client";

import {
  FiTag,
  FiCalendar,
  FiCheck,
  FiX,
  FiEdit,
  FiEye,
  FiTrash2,
  FiCopy,
  FiPercent,
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
  FiPlus,
} from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { promoService } from "@/app/_services/promoService";
import { toast } from "react-toastify";

const DEFAULT_PROMO = {
  _id: '',
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  maxDiscount: null,
  usageLimit: null,
  expiresAt: '',
  createdAt: '',
  updatedAt: ''
};

export default function PromosTable() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // RESPONSIVE HANDLING: Debounced resize listener
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();
    
    // Debounced resize handler for performance
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // DATA LOADING
  const loadPromos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        router.push("/admin/login");
        return;
      }
      
      const response = await promoService.getAllPromos(token);
      
      let promosData = [];
      
      // Handle different response structures
      if (response) {
        if (Array.isArray(response)) {
          promosData = response;
        } else if (response.data && Array.isArray(response.data)) {
          promosData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          promosData = response.data.data;
        } else if (Array.isArray(response.data)) {
          promosData = response.data;
        }
      }
      
      const validatedPromos = promosData.map(promo => ({
        ...DEFAULT_PROMO,
        ...promo,
        code: promo.code || 'UNKNOWN_CODE',
        discountValue: Number(promo.discountValue) || 0,
        expiresAt: promo.expiresAt || new Date().toISOString()
      }));
      
      setPromos(validatedPromos);
      
      if (validatedPromos.length === 0) {
        toast.info("No promotions found. Create your first one!");
      }
      
    } catch (err) {
      console.error("Load promos error:", err);
      
      let errorMessage = "Failed to load promotions";
      let errorType = "network";
      
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          errorMessage = "Session expired. Please login again.";
          errorType = "auth";
        } else if (status === 403) {
          errorMessage = "You don't have permission to view promotions.";
          errorType = "permission";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
          errorType = "server";
        }
      } else if (err.message?.includes('Network')) {
        errorMessage = "Network error. Check your connection.";
        errorType = "network";
      }
      
      setError({ message: errorMessage, type: errorType });
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // EFFECT: Load promos on mount
  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  // DELETE HANDLER - Fixed version
  const handleDelete = useCallback(async (id, code) => {
    if (!confirm(`Are you sure you want to delete promo "${code}"?\nThis action cannot be undone.`)) {
      return;
    }
    
    setDeleteLoading(id);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        router.push("/admin/login");
        return;
      }
      
      const response = await promoService.deletePromo(id, token);
      
      // Check if delete was successful
      if (response && (response.success === true || response.message)) {
        // Remove from local state immediately for better UX
        setPromos(prev => prev.filter(promo => promo._id !== id));
        
        toast.success(`Promo "${code}" deleted successfully`);
        
        // Refresh the list after a short delay
        setTimeout(() => {
          loadPromos();
        }, 100);
      } else {
        throw new Error("Delete failed - no success response");
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      
      // Reload the list to get current state
      loadPromos();
      
      let errorMsg = err.message || "Failed to delete promo";
      if (err.message?.includes("not found")) {
        errorMsg = "Promo not found or already deleted";
        // Still remove from local state if it was already deleted
        setPromos(prev => prev.filter(promo => promo._id !== id));
      }
      
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(null);
    }
  }, [loadPromos, router]);

  // DUPLICATE HANDLER
  const handleDuplicate = useCallback(async (promo) => {
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
      
      if (!newPromo.code || newPromo.code.length < 3) {
        throw new Error("Invalid promo code generated");
      }
      
      const response = await promoService.createPromo(newPromo, token);
      
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to duplicate promo");
      }
      
      toast.success(`Promo duplicated as "${newCode}"`);
      loadPromos();
      
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error(err.message || "Failed to duplicate promo");
    }
  }, [loadPromos, router]);

  // STATUS BADGE
  const getStatusBadge = useCallback((expiresAt) => {
    if (!expiresAt) {
      return (
        <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-gray-100 text-gray-800">
          <FiInfo className="mr-1" /> No Date
        </span>
      );
    }
    
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      
      if (isNaN(expiry.getTime())) {
        return (
          <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-gray-100 text-gray-800">
            <FiAlertCircle className="mr-1" /> Invalid Date
          </span>
        );
      }
      
      if (expiry < now) {
        return (
          <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-red-100 text-red-800">
            <FiX className="mr-1" /> Expired
          </span>
        );
      }
      
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 7) {
        return (
          <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-yellow-100 text-yellow-800">
            ⏳ Ending Soon ({daysLeft}d)
          </span>
        );
      }
      
      return (
        <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-green-100 text-green-800">
          <FiCheck className="mr-1" /> Active ({daysLeft}d)
        </span>
      );
    } catch {
      return (
        <span className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-gray-100 text-gray-800">
          <FiAlertCircle className="mr-1" /> Date Error
        </span>
      );
    }
  }, []);

  // DATE FORMATTING
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  }, []);

  // DAYS LEFT CALCULATION
  const getDaysLeft = useCallback((expiresAt) => {
    if (!expiresAt) return 0;
    
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      if (isNaN(expiry.getTime())) return 0;
      
      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 0;
    }
  }, []);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
        <p className="text-gray-400">Loading promotions...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <FiAlertCircle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {error.type === 'auth' ? 'Authentication Required' : 
           error.type === 'network' ? 'Connection Error' : 
           'Unable to Load Promotions'}
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{error.message}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => loadPromos()}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2 transition-colors"
          >
            <FiRefreshCw /> Try Again
          </button>
          <button
            onClick={() => router.push("/admin/promos/create")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-colors"
          >
            <FiPlus /> Create Promo
          </button>
          {error.type === 'auth' && (
            <button
              onClick={() => router.push('/admin/login')}
              className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  // ZERO-STATE HANDLING
  if (promos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
          <FiTag className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Promotions Yet</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Create promotional codes to offer discounts, run campaigns, and boost sales.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => router.push("/admin/promos/create")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FiPlus /> Create Your First Promo
          </button>
          <button
            onClick={loadPromos}
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="p-4">
        {/* Mobile Header with Create Button */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => router.push("/admin/promos/create")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 w-full"
          >
            <FiPlus /> Create New Promo
          </button>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {promos.length} promotion{promos.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={loadPromos}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
        
        {promos.map((promo) => (
          <div
            key={promo._id || `promo-${Math.random()}`}
            className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="text-yellow-500 font-mono font-bold">
                  {promo.code || 'UNKNOWN'}
                </div>
                <div className="text-white font-medium flex items-center mt-1">
                  <FiTag className="mr-2 text-gray-400" />
                  <span className="truncate">{promo.description || 'No description'}</span>
                </div>
              </div>
              <div className="text-right ml-2">
                {getStatusBadge(promo.expiresAt)}
                <div className="text-xs text-gray-400 mt-1">
                  {promo.usageLimit ? `Limit: ${promo.usageLimit}` : 'No limit'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center text-gray-300">
                {promo.discountType === 'percentage' ? (
                  <FiPercent className="mr-2" />
                ) : (
                  <FiDollarSign className="mr-2" />
                )}
                {promo.discountValue || 0}
                {promo.discountType === 'percentage' ? '%' : ''}
              </div>
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-2" />
                {formatDate(promo.expiresAt)}
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-3">
              {getDaysLeft(promo.expiresAt)} days left
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
              <button 
                onClick={() => router.push(`/admin/promos/${promo._id}`)}
                className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1 transition-colors"
                disabled={!promo._id}
              >
                <FiEye /> View
              </button>
              <button 
                onClick={() => router.push(`/admin/promos/edit/${promo._id}`)}
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1 transition-colors"
                disabled={!promo._id}
              >
                <FiEdit /> Edit
              </button>
              <button 
                onClick={() => handleDuplicate(promo)}
                className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-1 transition-colors"
              >
                <FiCopy /> Copy
              </button>
              <button 
                onClick={() => handleDelete(promo._id, promo.code)}
                disabled={deleteLoading === promo._id}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading === promo._id ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500 mr-1"></div>
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
        ))}
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="overflow-x-auto">
      {/* Desktop Header with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-700 bg-gray-800 gap-4">
        <div className="flex-1">
          <button
            onClick={() => router.push("/admin/promos/create")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2.5 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2"
          >
            <FiPlus /> Create New Promotion
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {promos.length} promotion{promos.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={loadPromos}
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw /> Refresh List
          </button>
        </div>
      </div>
      
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Promo Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Expires
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Usage Limit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {promos.map((promo) => (
            <tr key={promo._id} className="hover:bg-gray-750 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-yellow-500 font-mono">
                  {promo.code}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-100 max-w-xs">
                <div className="flex items-center">
                  <FiTag className="mr-2 flex-shrink-0" />
                  <span className="truncate">{promo.description || 'No description'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center text-gray-100">
                  {promo.discountType === 'percentage' ? (
                    <FiPercent className="mr-1" />
                  ) : (
                    <FiDollarSign className="mr-1" />
                  )}
                  <span className="font-bold">
                    {promo.discountValue || 0}
                    {promo.discountType === 'percentage' ? '%' : ''}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" /> {formatDate(promo.expiresAt)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getDaysLeft(promo.expiresAt)} days left
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(promo.expiresAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {promo.usageLimit || 'Unlimited'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => router.push(`/admin/promos/${promo._id}`)}
                    className="text-yellow-500 hover:text-yellow-400 p-1 transition-colors"
                    title="View details"
                  >
                    <FiEye />
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/promos/edit/${promo._id}`)}
                    className="text-blue-500 hover:text-blue-400 p-1 transition-colors"
                    title="Edit promo"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDuplicate(promo)}
                    className="text-purple-500 hover:text-purple-400 p-1 transition-colors"
                    title="Duplicate promo"
                  >
                    <FiCopy />
                  </button>
                  <button 
                    onClick={() => handleDelete(promo._id, promo.code)}
                    disabled={deleteLoading === promo._id}
                    className="text-red-500 hover:text-red-400 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete promo"
                  >
                    {deleteLoading === promo._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <FiTrash2 />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}