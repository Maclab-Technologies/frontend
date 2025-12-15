// app/_services/promoService.js - UPDATED VERSION
import { get, post, put, del } from '@/app/_hooks/fetch-hook';

export const promoService = {
  // GET - List all promos
  getAllPromos: async (token) => {
    console.log("Fetching promos from endpoint: /promos");
    try {
      const response = await get('/promos', { token });
      console.log("Promos API response:", response);
      return response;
    } catch (error) {
      console.error("Error in getAllPromos:", error);
      throw error;
    }
  },

  // GET - Get single promo by ID
  getPromoById: async (id, token) => {
    return await get(`/promos/${id}`, { token });
  },

  // POST - Create new promo
  createPromo: async (promoData, token) => {
    console.log("Creating promo with data:", promoData);
    try {
      const response = await post('/promos/create', promoData, { token });
      console.log("Create promo response:", response);
      return response;
    } catch (error) {
      console.error("Error in createPromo:", error);
      throw error;
    }
  },

  // PUT - Update promo
  updatePromo: async (id, promoData, token) => {
    return await put(`/promos/${id}`, promoData, { token });
  },

  // DELETE - Delete promo
  deletePromo: async (id, token) => {
    try {
      console.log(`Deleting promo with ID: ${id}`);
      const response = await del(`/promos/${id}`, { token });
      console.log("Delete response:", response);
      
      // Return success even if response structure is different
      if (response && (response.success === true || response.message)) {
        return response;
      }
      
      // If response doesn't have expected structure, create a success response
      return { success: true, message: "Promo deleted successfully" };
    } catch (error) {
      console.error("Error in deletePromo:", error);
      
      // Check if it's a 404 error (promo not found)
      if (error.response && error.response.status === 404) {
        throw new Error("Promo not found or already deleted");
      }
      
      // Check for authentication errors
      if (error.response && error.response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }
      
      // Re-throw the error with a user-friendly message
      throw new Error(error.message || "Failed to delete promo");
    }
  },

  // POST - Validate promo code
  validatePromoCode: async (promoCode, token) => {
    return await post('/promos/validate', { promoCode }, { token });
  }
};