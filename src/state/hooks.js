import { useSelector } from "react-redux";

export const useShareVaultData = () => useSelector((state) => state.shareholder.data);
export const useAccumulatorVaultData = () => useSelector((state) => state.accumulator.data);
export const useTrickleVaultData = () => useSelector((state) => state.trickle.data);