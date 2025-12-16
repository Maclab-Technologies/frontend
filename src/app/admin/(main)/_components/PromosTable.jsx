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
  FiClock,
} from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { promoService } from "@/app/_services/promoService";
import { toast } from "react-toastify";

// Constants
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

// Custom debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function PromosTable() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const resizeTimeoutRef = useRef(null);

  // Optimized responsive handling with custom debounce
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();
    
    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Memoized token getter
  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken');
  }, []);

  // Optimized data loading with error boundary
  const loadPromos = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setRefreshing(forceRefresh);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await promoService.getAllPromos(token, forceRefresh);
      const promosData = promoService.extractPromosData(response);
      
      const validatedPromos = promosData.map(promo => ({
        ...DEFAULT_PROMO,
        ...promo,
        code: promo.code || 'UNKNOWN_CODE',
        discountValue: Number(promo.discountValue) || 0,
        expiresAt: promo.expiresAt || new Date().toISOString()
      }));
      
      setPromos(validatedPromos);
      
      if (validatedPromos.length === 0 && !forceRefresh) {
        toast.info("No promotions found. Create your first one!");
      }
      
    } catch (err) {
      console.error("Load promos error:", err);
      handleLoadError(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [getToken]);

  // Error handling function
  const handleLoadError = useCallback((err) => {
    let errorMessage = "Failed to load promotions";
    let errorType = "network";
    
    if (err.message?.includes('Authentication')) {
      errorMessage = "Session expired. Please login again.";
      errorType = "auth";
      setTimeout(() => router.push("/admin/login"), 500);
    } else if (err.message?.includes('permission')) {
      errorMessage = "You don't have permission to view promotions.";
      errorType = "permission";
    } else if (err.message?.includes('Server error')) {
      errorMessage = "Server error. Please try again later.";
      errorType = "server";
    } else if (err.message?.includes('Network')) {
      errorMessage = "Network error. Check your connection.";
      errorType = "network";
    }
    
    setError({ message: errorMessage, type: errorType });
    
    // Only show toast for non-auth errors
    if (errorType !== 'auth') {
      toast.error(errorMessage);
    }
  }, [router]);

  // Load data on mount
  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  // Optimized delete handler with proper state management
  const handleDelete = useCallback(async (id, code) => {
    if (!confirm(`Are you sure you want to delete promo "${code}"?\nThis action cannot be undone.`)) {
      return;
    }
    
    setDeleteLoading(id);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      
      // Optimistic UI update
      const deletedPromo = promos.find(p => p._id === id);
      setPromos(prev => prev.filter(promo => promo._id !== id));
      
      const response = await promoService.deletePromo(id, token);
      
      if (response.success) {
        toast.success(`Promo "${code}" deleted successfully`);
        
        // Refresh cache and reload data
        promoService.clearCache();
        setTimeout(() => loadPromos(true), 300);
      } else {
        throw new Error(response.message || "Delete failed");
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      
      // Revert optimistic update on error
      setTimeout(() => loadPromos(true), 100);
      
      let errorMsg = err.message || "Failed to delete promo";
      if (err.message?.includes("not found")) {
        errorMsg = "Promo was already deleted";
      }
      
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(null);
    }
  }, [getToken, loadPromos, promos]);

  // Optimized duplicate handler
  const handleDuplicate = useCallback(async (promo) => {
    try {
      const token = getToken();
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
      loadPromos(true); // Force refresh to get updated list
      
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error(err.message || "Failed to duplicate promo");
    }
  }, [getToken, loadPromos, router]);

  // Memoized helper functions
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

  // Memoized promo statistics
  const promoStats = useMemo(() => {
    const now = new Date();
    return {
      total: promos.length,
      active: promos.filter(p => {
        try {
          const expiry = new Date(p.expiresAt);
          return !isNaN(expiry.getTime()) && expiry > now;
        } catch {
          return false;
        }
      }).length,
      expired: promos.filter(p => {
        try {
          const expiry = new Date(p.expiresAt);
          return !isNaN(expiry.getTime()) && expiry <= now;
        } catch {
          return false;
        }
      }).length,
      expiringSoon: promos.filter(p => {
        try {
          const expiry = new Date(p.expiresAt);
          const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
          return !isNaN(expiry.getTime()) && expiry > now && daysLeft <= 7;
        } catch {
          return false;
        }
      }).length,
    };
  }, [promos]);

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
        <p className="text-gray-400">Loading promotions...</p>
      </div>
    );
  }

  // Error state
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
            onClick={() => loadPromos(true)}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2 transition-colors"
            disabled={refreshing}
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiRefreshCw />
            )}
            Try Again
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

  // Zero state handling
  if (promos.length === 0 && !refreshing) {
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
            onClick={() => loadPromos(true)}
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FiRefreshCw />
            )}
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="p-4">
        {/* Refresh indicator */}
        {refreshing && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse z-50" />
        )}
        
        {/* Mobile Header with Create Button */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => router.push("/admin/promos/create")}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 w-full"
          >
            <FiPlus /> Create New Promo
          </button>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center mb-2">
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-gray-300">Total</div>
              <div className="text-xl font-bold text-white">{promoStats.total}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-green-400">Active</div>
              <div className="text-xl font-bold text-white">{promoStats.active}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-red-400">Expired</div>
              <div className="text-xl font-bold text-white">{promoStats.expired}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {promos.length} promotion{promos.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => loadPromos(true)}
              disabled={refreshing}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <FiRefreshCw />
              )}
              Refresh
            </button>
          </div>
        </div>
        
        {/* Mobile Promo Cards */}
        {promos.map((promo) => (
          <div
            key={promo._id || `promo-${Math.random()}`}
            className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="text-yellow-500 font-mono font-bold text-lg">
                  {promo.code || 'UNKNOWN'}
                </div>
                <div className="text-white font-medium flex items-center mt-1">
                  <FiTag className="mr-2 text-gray-400 flex-shrink-0" />
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
                  <FiPercent className="mr-2 flex-shrink-0" />
                ) : (
                  <FiDollarSign className="mr-2 flex-shrink-0" />
                )}
                <span className="font-bold">
                  {promo.discountValue || 0}
                  {promo.discountType === 'percentage' ? '%' : ''}
                </span>
                {promo.maxDiscount && promo.discountType === 'percentage' && (
                  <span className="text-xs text-gray-500 ml-1">(max ${promo.maxDiscount})</span>
                )}
              </div>
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-2 flex-shrink-0" />
                {formatDate(promo.expiresAt)}
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-3 flex items-center">
              <FiClock className="mr-1" />
              {getDaysLeft(promo.expiresAt)} days left
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
              <button 
                onClick={() => router.push(`/admin/promos/${promo._id}`)}
                className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1 transition-colors px-2 py-1"
                disabled={!promo._id}
                title="View details"
              >
                <FiEye /> View
              </button>
              <button 
                onClick={() => router.push(`/admin/promos/edit/${promo._id}`)}
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1 transition-colors px-2 py-1"
                disabled={!promo._id}
                title="Edit promo"
              >
                <FiEdit /> Edit
              </button>
              <button 
                onClick={() => handleDuplicate(promo)}
                className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-1 transition-colors px-2 py-1"
                title="Duplicate promo"
              >
                <FiCopy /> Copy
              </button>
              <button 
                onClick={() => handleDelete(promo._id, promo.code)}
                disabled={deleteLoading === promo._id}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete promo"
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
    <div className="relative">
      {/* Refresh indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse z-50" />
      )}
      
      <div className="overflow-x-auto">
        {/* Desktop Header with Create Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-700 bg-gray-800 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push("/admin/promos/create")}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2"
              >
                <FiPlus /> Create New Promotion
              </button>
              
              {/* Stats */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="text-sm">
                  <div className="text-gray-400">Total</div>
                  <div className="text-xl font-bold text-white">{promoStats.total}</div>
                </div>
                <div className="text-sm">
                  <div className="text-green-400">Active</div>
                  <div className="text-xl font-bold text-white">{promoStats.active}</div>
                </div>
                <div className="text-sm">
                  <div className="text-yellow-400">Expiring Soon</div>
                  <div className="text-xl font-bold text-white">{promoStats.expiringSoon}</div>
                </div>
                <div className="text-sm">
                  <div className="text-red-400">Expired</div>
                  <div className="text-xl font-bold text-white">{promoStats.expired}</div>
                </div>
              </div>
            </div>
            
            {/* Mobile Stats for Medium Screens */}
            <div className="lg:hidden grid grid-cols-4 gap-2 mb-4">
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-gray-300 text-xs">Total</div>
                <div className="text-lg font-bold text-white">{promoStats.total}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-green-400 text-xs">Active</div>
                <div className="text-lg font-bold text-white">{promoStats.active}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-yellow-400 text-xs">Soon</div>
                <div className="text-lg font-bold text-white">{promoStats.expiringSoon}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-red-400 text-xs">Expired</div>
                <div className="text-lg font-bold text-white">{promoStats.expired}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden md:block">
              Showing {promos.length} promotion{promos.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => loadPromos(true)}
              disabled={refreshing}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <FiRefreshCw /> Refresh List
                </>
              )}
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
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-yellow-500 font-mono">
                      {promo.code}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {formatDate(promo.createdAt)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-100 max-w-xs">
                  <div className="flex items-center">
                    <FiTag className="mr-2 flex-shrink-0" />
                    <span className="truncate">{promo.description || 'No description'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col">
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
                    {promo.maxDiscount && promo.discountType === 'percentage' && (
                      <div className="text-xs text-gray-400 mt-1">
                        Max: ${promo.maxDiscount}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-100">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" /> {formatDate(promo.expiresAt)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" />
                    {getDaysLeft(promo.expiresAt)} days left
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(promo.expiresAt)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-100">
                  <div className="flex flex-col">
                    <span>{promo.usageLimit || 'Unlimited'}</span>
                    {promo.usageLimit && promo.usedCount !== undefined && (
                      <span className="text-xs text-gray-400">
                        Used: {promo.usedCount || 0}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => router.push(`/admin/promos/${promo._id}`)}
                      className="text-yellow-500 hover:text-yellow-400 p-2 hover:bg-gray-700 rounded transition-colors"
                      title="View details"
                    >
                      <FiEye />
                    </button>
                    <button 
                      onClick={() => router.push(`/admin/promos/edit/${promo._id}`)}
                      className="text-blue-500 hover:text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"
                      title="Edit promo"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDuplicate(promo)}
                      className="text-purple-500 hover:text-purple-400 p-2 hover:bg-gray-700 rounded transition-colors"
                      title="Duplicate promo"
                    >
                      <FiCopy />
                    </button>
                    <button 
                      onClick={() => handleDelete(promo._id, promo.code)}
                      disabled={deleteLoading === promo._id}
                      className="text-red-500 hover:text-red-400 p-2 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        
        {/* Footer with summary */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-400">
            Showing {promos.length} promotion{promos.length !== 1 ? 's' : ''} • 
            <span className="text-green-400 ml-2">Active: {promoStats.active}</span> • 
            <span className="text-yellow-400 ml-2">Expiring Soon: {promoStats.expiringSoon}</span> • 
            <span className="text-red-400 ml-2">Expired: {promoStats.expired}</span>
          </div>
        </div>
      </div>
    </div>
  );
}