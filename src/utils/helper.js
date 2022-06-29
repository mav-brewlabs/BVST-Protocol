import { ethers } from 'ethers';
import { Currencies, DefaultChainID, ExplorerUrls } from '../config/constants';

export const _objToArray = (obj) => {
    const tempArr = [];
    Object.keys(obj).map((key) => {
        tempArr.push(obj[key]);
    });
    return tempArr;
};
export function shortenHex(hex, length = 4) {
    if (!hex) return '';
    return `${hex.substring(0, length + 2)}…${hex.substring(
        hex.length - length
    )}`;
}

/**
 * @name parseBalance
 *
 * @param {import("@ethersproject/bignumber").BigNumberish} balance
 * @param {number} decimals
 * @param {number} decimalsToDisplay
 *
 * @returns {string}
 */
export const parseBalance = (balance, decimals = 18, decimalsToDisplay = 3) =>
    Number(ethers.utils.formatUnits(balance, decimals)).toFixed(
        decimalsToDisplay
    );

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const nFormatter = (num, digits) => {
    var si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const shuffle = (array) => {
    let shuffled = array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffled;
};

export function toWei(ether) {
    return ethers.utils.parseEther(String(ether));
}

export function toEth(ether) {
    return ethers.utils.formatEther(ether);
}

export function getBigNumber(value) {
    return ethers.BigNumber.from(String(value));
}

export function getCurrencyFromAddressOrId(idOrAddress) {
    const currencies = Currencies[DefaultChainID];
    if (currencies && idOrAddress) {
        const currency = currencies.find(
            (item) =>
                item.id === idOrAddress ||
                item.address.toLowerCase() === idOrAddress.toLowerCase() ||
                item.name.toLowerCase() === idOrAddress.toLowerCase()
        );
        return currency;
    }
    return null;
}

export function getSymbolFromAddressOrId(idOrAddress) {
    const currencyObj = getCurrencyFromAddressOrId(idOrAddress);
    if (currencyObj) {
        return currencyObj.name;
    }
    return '';
}

export function getBSCScanLink(data, type) {
    const prefix = ExplorerUrls[DefaultChainID];

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`;
        }
        case 'token': {
            return `${prefix}/token/${data}`;
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`;
        }
    }
}
