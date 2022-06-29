import { ethers } from "ethers";

export const DefaultChainID = parseInt(process.env.REACT_APP_CHAINID, 10);

export const ChainList = {
    56: 'BSC mainnet',
    97: 'BSC Testnet',
    4: 'Rinkeby Testnet',
};

export const ExplorerUrls = {
    56: 'https://bscscan.com/',
    97: 'https://testnet.bscscan.com/',
    4: 'https://rinkeby.etherscan.io/',
};

export const Currencies = {
    56: [
        {
            id: 'binancecoin',
            name: 'BNB',
            address: ethers.constants.AddressZero,
            symbol: 'BNB',
            chainId: 56,
            decimals: 18,
            icon: '',
        },
    ],
    97: [
        {
            id: 'binancecoin',
            name: 'BNB',
            address: ethers.constants.AddressZero,
            symbol: 'BNB',
            chainId: 97,
            decimals: 18,
            icon: '',
        },
    ],
};
