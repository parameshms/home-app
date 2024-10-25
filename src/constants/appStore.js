import { configureStore } from "@reduxjs/toolkit";
import orderDataSlice from "./orderDataSlice";
import miniBitesSlice from "./miniBitesSlice";
import requestDataSlice from "./requestDataSlice";
import extraServicesSlice from "./extraServicesSlice";

const persistedStateJSON = localStorage.getItem("reduxState");
let persistedState = {};
if (persistedStateJSON) {
  persistedState = JSON.parse(persistedStateJSON);
}

const appStore = configureStore({
  reducer: {
    orderItems: orderDataSlice,
    miniBitesItems: miniBitesSlice,
    requestItems: requestDataSlice,
    extraServiceItems: extraServicesSlice
  },
  preloadedState: persistedState,
});

appStore.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(appStore.getState()));
});

export default appStore;
