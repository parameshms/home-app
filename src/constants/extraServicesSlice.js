import { createSlice } from "@reduxjs/toolkit";
const extraServicesSlice = createSlice({
  name: "extraSevices",
  initialState: {
    serviceType: [],
  },
  reducers: {
    setExtraServiceData: (state, action) => {
      state.serviceType = action.payload;
    }
  },
});

export const { setExtraServiceData } = extraServicesSlice.actions;

export default extraServicesSlice.reducer;