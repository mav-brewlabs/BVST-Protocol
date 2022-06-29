
import { ethers } from 'ethers'
import { zeroAddress } from '../config/constants'
import { getMarketplaceAddress } from '../utils/addressHelpers'
import { getTokenContract } from '../utils/contractHelpers'

export const isTokenApproval = async (token, amount, account, provider) => {
  if(token === zeroAddress) return true

  const tokenContract = getTokenContract(token, provider)
  const res = await tokenContract.allowance(account, getMarketplaceAddress())
  return res.gt(amount)
}

export const approveToken = async (token, provider) => {
  const tokenContract = getTokenContract(token, provider)
  const tx = await tokenContract.approve(getMarketplaceAddress(), ethers.constants.MaxUint256)
  const receipt = await tx.wait(2)

  return receipt.status
}
