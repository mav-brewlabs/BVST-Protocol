import BigNumber from "bignumber.js";

import tokens from "src/config/constants/tokens";
import MulticallAbi from "src/config/abi/Multicall.json";
import { getOracleAddress } from "src/utils/addressHelpers";
import { getBalanceNumber } from "src/utils/formatBalance";
import multicall from "src/utils/multicall";

const fetchPrices = async (chainId) => {
  const calls = tokens[chainId].map((token) => ({
    address: getOracleAddress(),
    name: "getTokenPrice",
    params: [token.address],
  }));

  const prices = await multicall(MulticallAbi, calls);

  return tokens[chainId].reduce((accum, token, index) => {
    accum[token.address] = getBalanceNumber(
      new BigNumber(prices[index]).toJSON()
    );
    return accum;
  });
};

export default fetchPrices;
