// app/_services/promoService.js - REFACTORED VERSION
import { get, post, put, del } from '@/app/_hooks/fetch-hook';

// Cache configuration
const CACHE_CONFIG = {
  promosList: {
    key: 'promos_list',
    ttl: 5 * 60 * 1000, // 5 minutes
  },
  promoDetails: {
    key: 'promo_details',
    ttl: 10 * 60 * 1000, // 10 minutes
  }
};

class PromoService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map(); // For request deduplication
  }

  // Request deduplication helper
  async deduplicatedRequest(key, requestFn) {
    // If request is already in progress, return the promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const requestPromise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  // Cache helper with TTL
  getCached(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  setCached(key, data, ttl) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  // Clear specific cache
  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
    } else {
      Array.from(this.cache.keys()).forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    }
  }

  // GET - List all promos with caching
  getAllPromos = async (token, forceRefresh = false) => {
    const cacheKey = `${CACHE_CONFIG.promosList.key}_${token || 'no-token'}`;
    
    // Return cached data if not forcing refresh
    if (!forceRefresh) {
      const cached = this.getCached(cacheKey);
      if (cached) {
        console.log("[Cache Hit] Promos list");
        return cached;
      }
    }

    return this.deduplicatedRequest(`getAllPromos_${token}`, async () => {
      try {
        console.log("[API] Fetching promos from endpoint: /promos");
        const response = await get('/promos', { token });
        
        // Validate response structure
        let promosData = this.extractPromosData(response);
        
        // Cache the successful response
        this.setCached(cacheKey, response, CACHE_CONFIG.promosList.ttl);
        
        console.log("[API] Promos fetched successfully:", promosData.length, "items");
        return response;
      } catch (error) {
        console.error("[API Error] getAllPromos:", error);
        
        // Return stale cache on error if available
        const staleCache = this.getCached(cacheKey);
        if (staleCache) {
          console.warn("[Cache] Returning stale data due to API error");
          return staleCache;
        }
        
        throw this.normalizeError(error);
      }
    });
  };

  // GET - Get single promo by ID with caching
  getPromoById = async (id, token) => {
    const cacheKey = `${CACHE_CONFIG.promoDetails.key}_${id}`;
    const cached = this.getCached(cacheKey);
    
    if (cached) {
      console.log("[Cache Hit] Promo details:", id);
      return cached;
    }

    return this.deduplicatedRequest(`getPromoById_${id}`, async () => {
      try {
        const response = await get(`/promos/${id}`, { token });
        
        if (response) {
          this.setCached(cacheKey, response, CACHE_CONFIG.promoDetails.ttl);
        }
        
        return response;
      } catch (error) {
        console.error("[API Error] getPromoById:", error);
        throw this.normalizeError(error);
      }
    });
  };

  // POST - Create new promo with optimistic updates support
  createPromo = async (promoData, token, optimisticId = null) => {
    console.log("[API] Creating promo with data:", promoData);
    
    try {
      const response = await post('/promos/create', promoData, { token });
      console.log("[API] Create promo response:", response);
      
      // Clear relevant caches
      this.clearCache('promos_list');
      
      return response;
    } catch (error) {
      console.error("[API Error] createPromo:", error);
      throw this.normalizeError(error);
    }
  };

  // PUT - Update promo
  updatePromo = async (id, promoData, token) => {
    return this.deduplicatedRequest(`updatePromo_${id}`, async () => {
      try {
        const response = await put(`/promos/${id}`, promoData, { token });
        
        // Clear caches for this promo
        this.cache.delete(`${CACHE_CONFIG.promoDetails.key}_${id}`);
        this.clearCache('promos_list');
        
        return response;
      } catch (error) {
        console.error("[API Error] updatePromo:", error);
        throw this.normalizeError(error);
      }
    });
  };

  // DELETE - Delete promo with retry logic
  deletePromo = async (id, token, retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      console.log(`[API] Deleting promo with ID: ${id}`);
      
      // Clear cache immediately for optimistic UI
      this.cache.delete(`${CACHE_CONFIG.promoDetails.key}_${id}`);
      this.clearCache('promos_list');
      
      const response = await del(`/promos/${id}`, { token });
      console.log("[API] Delete response:", response);
      
      // Handle different response structures
      if (response && (response.success === true || response.message || response.data)) {
        return {
          success: true,
          message: response.message || "Promo deleted successfully",
          data: response.data || null
        };
      }
      
      // If response doesn't have expected structure, check HTTP status
      throw new Error("Unexpected response format");
      
    } catch (error) {
      console.error("[API Error] deletePromo:", error);
      
      // Retry logic for network errors
      if (retryCount < maxRetries && this.isRetryableError(error)) {
        console.log(`[Retry] Attempt ${retryCount + 1} for promo ${id}`);
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.deletePromo(id, token, retryCount + 1);
      }
      
      throw this.normalizeDeleteError(error, id);
    }
  };

  // POST - Validate promo code
  validatePromoCode = async (promoCode, token) => {
    return this.deduplicatedRequest(`validate_${promoCode}`, async () => {
      try {
        const response = await post('/promos/validate', { promoCode }, { token });
        return response;
      } catch (error) {
        console.error("[API Error] validatePromoCode:", error);
        throw this.normalizeError(error);
      }
    });
  };

  // Helper methods
  extractPromosData(response) {
    if (!response) return [];
    
    if (Array.isArray(response)) {
      return response;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  }

  normalizeError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data?.message || "Invalid request data");
        case 401:
          return new Error("Authentication failed. Please login again.");
        case 403:
          return new Error("You don't have permission to perform this action.");
        case 404:
          return new Error("Resource not found.");
        case 409:
          return new Error("Conflict: Resource already exists.");
        case 429:
          return new Error("Too many requests. Please try again later.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error(data?.message || `Server error: ${status}`);
      }
    } else if (error.request) {
      return new Error("Network error. Please check your connection.");
    }
    
    return error;
  }

  normalizeDeleteError(error, id) {
    const normalized = this.normalizeError(error);
    
    // Special handling for delete errors
    if (normalized.message.includes("not found")) {
      return new Error("Promo not found or already deleted");
    }
    
    return normalized;
  }

  isRetryableError(error) {
    // Network errors or 5xx server errors are retryable
    if (!error.response) return true;
    
    const status = error.response.status;
    return status >= 500 || status === 408 || status === 429;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const promoService = new PromoService();