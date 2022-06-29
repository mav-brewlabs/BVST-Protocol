import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  prices: {},
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPrices: (state, action) => {
      state.prices = action.payload;
    },
  },
});

export const { setPrices } = appSlice.actions;

export default appSlice.reducer;