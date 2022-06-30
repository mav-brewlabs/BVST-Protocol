import { useSelector } from "react-redux";

export const useShareVault = () => useSelector((state) => state.shareholder.data);
export const useAccumulatorVault = () => useSelector((state) => state.accumulator.data);
export const useTrickleVault = () => useSelector((state) => state.trickle.data);