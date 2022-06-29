import addresses from '../config/constants/contracts';

export const getAddress = (address) => {
    const chainId = process.env.REACT_APP_NETWORK_ID;
    return address[chainId] ? address[chainId] : address[4];
};

export const getMulticallAddress = () => {
    return getAddress(addresses.multiCall);
};

export const getSharedHoldersVaultAddress = () => {
    return getAddress(addresses.shareVault);
};

export const getAccumultorVaultAddress = () => {
    return getAddress(addresses.accumulatorVault);
};

export const getTrickleVaultAddress = () => {
    return getAddress(addresses.trickleVault);
};