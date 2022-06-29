import { configureStore } from "@reduxjs/toolkit";

import appReducer from './app'
import shareholderReducer from "./shareholder";
import accumulatorReducer from "./accumulator";
import trickleReducer from "./trickle";

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    app: appReducer,
    accumulator: accumulatorReducer,
    shareholder: shareholderReducer,
    trickle: trickleReducer,
  },
});

export default store;
