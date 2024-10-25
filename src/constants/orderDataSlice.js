import { createSlice } from "@reduxjs/toolkit";
const orderDataSlice = createSlice({
  name: "foodOrder",
  initialState: {
    orderData: [],
    menuData: [],
  },
  reducers: {
    setOrderData: (state, action) => {
      state.orderData = action.payload;
    },
    setMenuData: (state, action) => {
      state.menuData = action.payload;
    },
  },
});

export const { setOrderData, setMenuData } = orderDataSlice.actions;

export default orderDataSlice.reducer;
