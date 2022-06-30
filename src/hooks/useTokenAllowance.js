import BigNumber from "bignumber.js";
import ethers from "ethers";
import { useCallback, useState } from "react";
import { getTokenContract } from "src/utils/contractHelpers";
import { useWeb3Context } from "./web3Context";

const useTokenAllowance = (tokenAddress, spender) => {
  const { address: account, provider } = useWeb3Context();
  const { fastRefresh } = useRefresh();

  const [allowance, setAllowance] = useState(BIG_ZERO);

  useEffect(() => {
    const fetchAllowance = async () => {
      const contract = getTokenContract(tokenAddress);
      try {
        const res = await contract.allowance(account, spender);
        setAllowance(new BigNumber(res.toString()));
      } catch (e) {
        console.error(e);
      }
    };

    if (account) {
      fetchAllowance();
    } else {
      setAllowance(BIG_ZERO);
    }
  }, [account, tokenAddress, spender, fastRefresh]);

  const handleApprove = useCallback(async () => {
    const contract = getTokenContract(tokenAddress, provider);
    const tx = await contract.approve(spender, ethers.constants.MaxUint256);
    const receipt = await tx.wait(2);

    return receipt.status;
  }, [tokenAddress, spender]);

  return { allowance, onApprove: handleApprove };
};

export default useTokenAllowance;
