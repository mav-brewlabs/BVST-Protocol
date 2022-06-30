import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "src/hooks/useRefresh";
import { useWeb3Context } from "src/hooks/web3Context";
import { fetchPricesAsync } from "..";

const usePollPrices = () => {
  const dispatch = useDispatch();
  const { chainId } = useWeb3Context();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    dispatch(fetchPricesAsync(chainId));
  }, [slowRefresh, chainId]);
};

export default usePollPrices;