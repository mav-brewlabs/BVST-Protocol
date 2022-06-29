import { useContext } from 'react'
import { TokenPriceContext } from '../contexts/TokenPriceContext'
import { getCurrencyFromAddressOrId } from '../utils/helper'

const useTokenPrice = (id) => {
  const { prices } = useContext(TokenPriceContext)
  const currencyObj = getCurrencyFromAddressOrId(id)

  if(id && currencyObj) {
      return {
        ...currencyObj,
        usdPrice: prices[id]?.usd || 0
      }
  }

  return prices
}

export default useTokenPrice
