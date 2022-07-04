import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DefaultChainID } from "src/config/constants";
import tokens from "src/config/constants/tokens";
import {
  fetchShareVaultPublicData,
  fetchShareVaultUserData,
} from "./fetchShareVault";

const initialState = {
  data: {
    token: tokens[DefaultChainID].bvst,
    rewardToken: tokens[DefaultChainID].busd,
    totalStaked: "0",
    prevTotal: "0",
    allTimeRewards: "0",
    availableRewards: "0",
    lockDuration: 60,
    performanceFee: "0",
    emergencyWithdraw: false,
    userData: {
      staked: "0",
      rewards: "0",
      totalEarned: '0',
      usdStakedAmount: "0",
      lastDepositedTime: "0",
    },
  },
  dataLoading: true,
};

export const fetchShareVaultPublicDataAsync =
  () => async (dispatch, getState) => {
    const data = await fetchShareVaultPublicData();
    dispatch(setPublicInfo(data));
  };

export const fetchShareVaultUserDataAsync =
  (account) => async (dispatch, getState) => {
    const data = await fetchShareVaultUserData(account);
    dispatch(setUserInfo(data));
  };

export const shareholderSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPublicInfo: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    setUserInfo: (state, action) => {
      state.data.userData = { ...action.payload };
    },
    resetUserInfo: (state) => {
      state.data.userData = { ...initialState.data.userData };
    },
  },
});

export const { setPublicInfo, setUserInfo, resetUserInfo } =
  shareholderSlice.actions;

export default shareholderSlice.reducer;
