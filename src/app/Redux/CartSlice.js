import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // If item exists, update quantity
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        // If item doesn't exist, add new item
        state.items.push(item);
      }

      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    },
    
    setCart: (state, action) => {
      state.items = action.payload;
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      
      if (item) {
        item.quantity = quantity;
        
        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
      }
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