import BigNumber from "bignumber.js"
import { useState } from "react"
import { getTokenContract } from "src/utils/contractHelpers"
import useRefresh from "./useRefresh"
import { useWeb3Context } from "./web3Context"

const useTokenBalance = (tokenAddress) => {
  const { address: account } = useWeb3Context()
  const { fastRefresh } = useRefresh()

  const [balance, setBalance] = useState(BIG_ZERO)

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getTokenContract(tokenAddress)
      try {
        const res = await contract.balanceOf(account)
        setBalance(new BigNumber(res.toString()))
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetchBalance()
    } else {
      setBalance(BIG_ZERO)
    }
  }, [account, tokenAddress, fastRefresh])

  return balance
}

export default useTokenBalance