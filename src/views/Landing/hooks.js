import { useCallback } from "react";
import { useShareVaultContract } from "src/hooks/useContract";

const useShareVault = (performanceFee, emergencyWithdraw = false) => {
  const vaultContract = useShareVaultContract();

  const handleDeposit = useCallback(
    async (amount) => {
      const tx = await vaultContract.deposit(amount, { value: performanceFee });
      const receipt = await tx.wait(2);
      return receipt.status;
    },
    [vaultContract, performanceFee]
  );

  const handleWithdraw = useCallback(
    async (amount) => {
      let tx;
      if (emergencyWithdraw) {
        tx = await vaultContract.emergencyWithdraw();
      } else {
        tx = await vaultContract.withdraw(amount, { value: performanceFee });
      }

      const receipt = await tx.wait(2);
      return receipt.status;
    },
    [vaultContract, performanceFee, emergencyWithdraw]
  );

  const handleHarvest = useCallback(async () => {
    const tx = await vaultContract.harvest({ value: performanceFee });
    const receipt = await tx.wait(2);
    return receipt.status;
  }, [vaultContract, performanceFee]);

  return {
    onStake: handleDeposit,
    onWithdraw: handleWithdraw,
    onHarvest: handleHarvest,
  };
};

export default useShareVault;
