const cache = new Map();

// Default configuration
const DEFAULT_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000,
  cache: false,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  showToast: true,
  validateStatus: (status) => status >= 200 && status < 300,
};

/**
 * Enhanced fetch hook with performance optimizations and flexibility
 * @param {string} url - API endpoint
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string|null} options.token - Authorization token
 * @param {Object|FormData|string} options.data - Request body data
 * @param {Object} options.headers - Additional headers
 * @param {Object} options.config - Additional configuration
 * @returns {Promise<Object>} Response data or error
 */
export default async function fetchHook(url, options = {}) {
  const {
    method = "GET",
    token = null,
    data = null,
    headers = {},
    config = {},
  } = options;

  // Merge configurati
  //console
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const {
    timeout,
    retries,
    retryDelay,
    cache: useCache,
    cacheTime,
    validateStatus,
  } = finalConfig;

  // Build cache key
  const cacheKey = useCache ? `${method}:${url}:${JSON.stringify(data)}` : null;

  // Check cache for GET requests
  if (useCache && method === "GET" && cacheKey && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < cacheTime) {
      return { success: true, data: cached.data, cached: true };
    }
    cache.delete(cacheKey);
  }

  // Build headers
  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Handle different data types
  let body = null;
  if (data) {
    if (data instanceof FormData) {
      delete requestHeaders["Content-Type"]; // Let browser set boundary for FormData
      body = data;
    } else if (typeof data === "string") {
      body = data;
    } else {
      body = JSON.stringify(data);
    }
  }

  // Build fetch options
  const fetchOptions = {
    method: method.toUpperCase(),
    headers: requestHeaders,
    ...(body && { body }),
  };

  // Timeout implementation
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeout);
  fetchOptions.signal = timeoutController.signal;

  // Retry logic with exponential backoff
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        fetchOptions
      );

      clearTimeout(timeoutId);

      // Check if response status is considered valid
      if (!validateStatus(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response based on content type
      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else if (contentType?.includes("text/")) {
        responseData = await response.text();
      } else if (contentType?.includes("application/octet-stream")) {
        responseData = await response.blob();
      } else {
        responseData = await response.text();
      }

      // Cache successful GET requests
      if (useCache && method === "GET" && cacheKey) {
        cache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });
      }

      // Success toast
      // if (showToast && method !== "GET") {
      //   toast.success(`${method} request successful`);
      // }

      return {
        success: true,
        data: responseData,
        status: response.status,
        // headers: Object.fromEntries(response.headers.entries()),
        // cached: false,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // Don't retry on certain errors
      if (
        error.name === "AbortError" ||
        (error.message.includes("HTTP 4") &&
          !error.message.includes("HTTP 429"))
      ) {
        break;
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );
      }
    }
  }

  // // Handle final error
  // const errorMessage =
  //   lastError?.message === "AbortError"
  //     ? "Request timeout"
  //     : lastError?.message || "Network error occurred";

  // if (showToast) {
  //   toast.error(errorMessage);
  // }

  return {
    success: false,
    error: lastError.message,
    originalError: lastError,
  };
}

// Utility functions for common operations

// GET request wrapper
export const get = async (url, options = {}) =>
  fetchHook(url, { ...options, method: "GET" });

//  POST request wrapper
export const post = async (url, data, options = {}) =>
  fetchHook(url, { ...options, method: "POST", data });

// PUT request wrapper
export const put = async (url, data, options = {}) =>
  fetchHook(url, { ...options, method: "PUT", data });

// DELETE request wrapper
export const del = async (url, options = {}) =>
  fetchHook(url, { ...options, method: "DELETE" });

// PATCH request wrapper
export const patch = async (url, data, options = {}) =>
  fetchHook(url, { ...options, method: "PATCH", data });

// Clear cache
export const clearCache = async (pattern) => {
  if (pattern) {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

// Batch requests
export const batchRequests = async (requests) => {
  const promises = requests.map((req) =>
    fetchHook(req.url, req.options).catch((error) => ({
      ...error,
      _failed: true,
    }))
  );

  return Promise.all(promises);
};