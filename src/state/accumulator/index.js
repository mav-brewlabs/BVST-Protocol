import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: {},
  dataLoading: true,
};

export const accumulatorSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.data = action.payload;
    }
  },
});

export const { setInfo } = accumulatorSlice.actions;

export default accumulatorSlice.reducer;