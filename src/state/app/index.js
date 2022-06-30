import { createSlice } from '@reduxjs/toolkit';
import fetchPrices from './fetchPrices';

const initialState = {
  prices: {},
};

export const fetchPricesAsync = (chainId) => async (dispatch, getState) => {
  const prices = fetchPrices(chainId)
  dispatch(setPrices(prices))
}

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