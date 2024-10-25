import { createSlice } from "@reduxjs/toolkit";
const requestDataSlice = createSlice({
  name: "requests",
  initialState: {
    requestData: [],
  },
  reducers: {
    setRequestData: (state, action) => {
      state.requestData = action.payload;
    }
  },
});

export const { setRequestData } = requestDataSlice.actions;

export default requestDataSlice.reducer;