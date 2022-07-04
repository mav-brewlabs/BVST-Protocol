import BigNumber from "bignumber.js";
import ShareVaultAbi from "src/config/abi/sharedholder.json";
import { getSharedHoldersVaultAddress } from "src/utils/addressHelpers";
import multicall from "src/utils/multicall";

export const fetchShareVaultPublicData = async () => {
  const shareVault = getSharedHoldersVaultAddress();

  const calls = [
    "totalStaked",
    "prevPeriodAccToken",
    "lockDuration",
    "performanceFee",
    "allTimeRewards",
    "availableRewardTokens",
  ].map((entry) => ({
    address: shareVault,
    name: entry,
  }));

  const [
    totalStaked,
    prevPeriodAccToken,
    lockDuration,
    performanceFee,
    allTimeRewards,
    availableRewardTokens,
  ] = await multicall(ShareVaultAbi, calls);

  return {
    totalStaked: new BigNumber(totalStaked).toJSON(),
    prevPeriodAccToken: new BigNumber(prevPeriodAccToken).toJSON(),
    lockDuration: new BigNumber(lockDuration).toNumber(),
    performanceFee: new BigNumber(performanceFee).toJSON(),
    allTimeRewards: new BigNumber(allTimeRewards).toJSON(),
    availableRewards: new BigNumber(availableRewardTokens).toJSON(),
  };
};

export const fetchShareVaultUserData = async (account) => {
  const shareVault = getSharedHoldersVaultAddress();
  const calls = [
    {
      address: shareVault,
      name: "pendingRewards",
      params: [account],
    },
    {
      address: shareVault,
      name: "userInfo",
      params: [account],
    },
  ];
  
  const [pendingRewards, userInfo] = await multicall(ShareVaultAbi, calls);
  return {
    staked: new BigNumber(userInfo.amount._hex).toJSON(),
    usdStakedAmount: new BigNumber(userInfo.usdAmount._hex).toJSON(),
    totalEarned: new BigNumber(userInfo.totalEarned._hex).toJSON(),
    rewards: new BigNumber(pendingRewards).toJSON(),
    lastDepositedTime: new BigNumber(userInfo.lastDepositTime._hex).toNumber(),
  }
};
