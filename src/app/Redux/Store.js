import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Disable serializable check for localStorage
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;