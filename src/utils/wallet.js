// Set of helper functions to facilitate wallet setup

import { ExplorerUrls } from '../config/constants';
import { nodes } from './getRpcUrl';

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
    const provider = window.ethereum;
    if (provider) {
        const chainId = parseInt(process.env.REACT_APP_NETWORK_ID, 10);
        try {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: `0x${chainId.toString(16)}`,
                        chainName: 'Binance Smart Chain Mainnet',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'bnb',
                            decimals: 18,
                        },
                        rpcUrls: nodes,
                        blockExplorerUrls: [ExplorerUrls[chainId]],
                    },
                ],
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    } else {
        console.error(
            "Can't setup the BSC network on metamask because window.ethereum is undefined"
        );
        return false;
    }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
    tokenAddress,
    tokenSymbol,
    tokenDecimals,
    tokenImage
) => {
    const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                image: tokenImage,
            },
        },
    });

    return tokenAdded;
};

export const addChain = async (chainId) => {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') return false;

    try {
        await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: 'Binance Smart Chain Mainnet',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'bnb',
                        decimals: 18,
                    },
                    rpcUrls: nodes,
                    blockExplorerUrls: [ExplorerUrls[chainId]],
                },
            ],
        });
        return true;
    } catch (error) {
        console.error(`Error adding chain ${chainId}: ${error.message}`);
    }
    return false;
};

export const switchChain = async (chainId) => {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') return false;

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
        });
        return true;
    } catch (error) {
        // const ERROR_CODE_UNKNOWN_CHAIN = 4902
        const ERROR_CODE_USER_REJECTED = 4001;
        if (error.code !== ERROR_CODE_USER_REJECTED) {
            const res = await addChain(chainId);
            return res;
        }
    }
    return false;
};

// Check if the metamask is installed
export const _isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    let { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};
