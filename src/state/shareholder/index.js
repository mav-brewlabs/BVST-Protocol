import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  dataLoading: true,
};

export const shareholderSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.data = action.payload;
    }
  },
});

export const { setInfo } = shareholderSlice.actions;

export default shareholderSlice.reducer;