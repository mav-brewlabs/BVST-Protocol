import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "src/hooks/useRefresh";
import { useWeb3Context } from "src/hooks/web3Context";
import {
  fetchShareVaultPublicDataAsync,
  fetchShareVaultUserDataAsync,
  resetUserInfo as resetShareVaultUserInfo,
} from ".";

const usePollShareVault = () => {
  const dispatch = useDispatch();
  const { address: account } = useWeb3Context();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    dispatch(fetchShareVaultPublicDataAsync());

    if (account) {
      dispatch(fetchShareVaultUserDataAsync(account));
    } else {
      dispatch(resetShareVaultUserInfo());
    }
  }, [slowRefresh, account]);
};

export default usePollShareVault;
