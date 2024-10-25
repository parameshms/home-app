import { createSlice } from "@reduxjs/toolkit";
const miniBitesSlice = createSlice({
  name: "miniBites",
  initialState: {
    miniBitesOrderData: [],
    miniBitesData: [],
  },
  reducers: {
    setMiniBitesOrderData: (state, action) => {
      state.miniBitesOrderData = action.payload;
    },
    setMiniBitesMenuData: (state, action) => {
      state.miniBitesData = action.payload;
    },
  },
});

export const { setMiniBitesOrderData, setMiniBitesMenuData } =
  miniBitesSlice.actions;

export default miniBitesSlice.reducer;
