import { useMemo } from "react";
import ShareVaultAbi from "../config/abi/sharedholder.json";
import AccumVaultAbi from "../config/abi/accumulator.json";
import Erc20Abi from "../config/abi/erc20.json";
import {
  getAccumultorVaultAddress,
  getSharedHoldersVaultAddress,
} from "../utils/addressHelpers";
import { getContract } from "../utils/contractHelpers";
import { useWeb3Context } from "./web3Context";

// returns null on errors
function useContract(address, ABI) {
  const { provider, address: account } = useWeb3Context();

  return useMemo(() => {
    if (!address || !ABI || !provider) return null;
    try {
      return getContract(address, ABI, provider.getSigner());
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, provider, account]);
}

export function useShareVaultContract() {
  return useContract(getSharedHoldersVaultAddress(), ShareVaultAbi);
}

export function useAccumulatorVaultContract() {
  return useContract(getAccumultorVaultAddress(), AccumVaultAbi);
}

export function useTokenContract(tokenAddress) {
  return useContract(tokenAddress, Erc20Abi);
}
