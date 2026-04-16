import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalPrice = state.items.reduce((total, item) => {
        // Price can be a string from API, parse it carefully
        const price = item.Product?.price ? parseFloat(item.Product.price) : 0;
        return total + (price * item.quantity);
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    }
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
