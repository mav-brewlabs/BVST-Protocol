import { ethers, Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const estimateGas = async (contract, methodName, methodArgs = []) => {
    if (!contract[methodName]) {
        throw new Error(
            `Method ${methodName} doesn't exist on ${contract.address}`
        );
    }
    const rawGasEstimation = await contract.estimateGas[methodName](
        ...methodArgs
    );
    // By convention, ethers.BigNumber values are multiplied by 1000 to avoid dealing with real numbers
    const gasEstimation = rawGasEstimation
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
        .div(ethers.BigNumber.from(10000));
    return gasEstimation;
};

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithEstimateGas = async (
    contract,
    methodName,
    methodArgs = []
) => {
    const gasEstimation = estimateGas(contract, methodName, methodArgs);
    const tx = await contract[methodName](...methodArgs, {
        gasLimit: gasEstimation,
    });
    return tx;
};

// add 10%
export function calculateGasMargin(value) {
    return value.mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000))).div(ethers.BigNumber.from(10000))
}