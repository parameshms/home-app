import { configureStore } from "@reduxjs/toolkit";



const persistedStateJSON = localStorage.getItem("reduxState");
let persistedState = {};
if (persistedStateJSON) {
  persistedState = JSON.parse(persistedStateJSON);
}

const appStore = configureStore({
  reducer: {
   
  },
  preloadedState: persistedState,
});

appStore.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(appStore.getState()));
});

export default appStore;
