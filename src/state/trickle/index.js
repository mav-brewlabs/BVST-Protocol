import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: {},
  dataLoading: true,
};

export const trickleSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.data = action.payload;
    }
  },
});

export const { setInfo } = trickleSlice.actions;

export default trickleSlice.reducer;