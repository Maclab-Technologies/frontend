// Redux/CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [] // ✅ This should match the local state structure
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        state.cartItems[existingItemIndex].quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // ✅ Sync with localStorage
    },

    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // ✅ Sync with localStorage
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);

      if (item) {
        item.quantity = quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // ✅ Sync with localStorage
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    }
  }
});

export const { 
  addToCart, 
  setCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
