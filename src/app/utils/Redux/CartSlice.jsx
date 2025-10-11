// Redux/CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [] // This should match the local state structure
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = { ...action.payload, quantity: action.payload.quantity || 1 }; // Ensure existence of quantity
      const existingItemIndex = state.cartItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        state.cartItems[existingItemIndex].quantity += item.quantity; // Add to quantity
      } else {
        state.cartItems.push(item); // Add new item
      }
    },

    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity); // Ensure quantity does not go below 1
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
    }
  }
});

// Action and reducer exports
export const { 
  addToCart, 
  setCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;