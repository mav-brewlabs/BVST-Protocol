import React, { useState, ReactElement, useContext, useEffect, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider, WebSocketProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { EnvHelper } from "../helpers/Environment";
import { NodeHelper } from "../helpers/NodeHelper";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

/**
 * kept as function to mimic `getMainnetURI()`
 * @returns string
 */
function getTestnetURI() {
  return EnvHelper.alchemyTestnetURI;
}

/**
 * "intelligently" loadbalances production API Keys
 * @returns string
 */
function getMainnetURI(): string {
  // Shuffles the URIs for "intelligent" loadbalancing
  return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
}

/*
  Types
*/
type onChainProvider = {
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  // NOTE (appleseed): if you are testing on rinkeby you need to set chainId === 4 as the default for non-connected wallet testing...
  // ... you also need to set getTestnetURI() as the default uri state below
  const [chainID, setChainID] = useState(1);
  // const [chainID, setChainID] = useState(1);
  const [address, setAddress] = useState("");

  const [uri, setUri] = useState(getMainnetURI());

  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));
  // const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider("https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/bsc/testnet"));

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
    new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
            },
            chainID: 1
          },
        },
        coinbasewallet: {
          package: CoinbaseWalletSDK, // Required
          options: {
            appName: "My Awesome App", // Required
            infuraId: "a4d2b749205d4d4197dd52f4f0e17df2", // Required
            rpc: "https://mainnet.infura.io/v3/a4d2b749205d4d4197dd52f4f0e17df2", // Optional if `infuraId` is provided; otherwise it's required
            chainId: 1, // Optional. It defaults to 1 if not provided
            darkMode: true // Optional. Use dark theme, defaults to false
          }
        },
        "custom-binancechainwallet": {
          display: {
            logo: "/images/binance.png",
            name: "Binance Chain Wallet",
            description: "Connect to your Binance Chain Wallet"
          },
          package: true,
          connector: async () => {
            let provider = null;
            if (typeof window.BinanceChain !== 'undefined') {
              provider = window.BinanceChain;
              try {
                await provider.request({ method: 'eth_requestAccounts' })
              } catch (error) {
                return { type: 'error', title: 'Error', detail: 'User Rejected' }
              }
            } else {
              return { type: 'error', title: 'Error', detail: 'No Binance Chain Wallet found' }
            }
            return provider;
          }
        }
      },
    }),
  );

  const hasCachedProvider = (): Boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts: string[]) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain: number) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  /**
   * throws an error if networkID is not 1 (mainnet) or 4 (rinkeby)
   */
  const _checkNetwork = (otherChainID: number): Boolean => {
    console.log(
      "You are switching networks",
      EnvHelper.getOtherChainID(),
      otherChainID === EnvHelper.getOtherChainID() || otherChainID === 4,
    );
    if (chainID !== otherChainID) {
      console.warn("You are switching networks", EnvHelper.getOtherChainID());
      if (otherChainID === EnvHelper.getOtherChainID() || otherChainID === 4) {
        setChainID(otherChainID);
        otherChainID === EnvHelper.getOtherChainID() ? setUri(getMainnetURI()) : setUri(getTestnetURI());
        return true;
      }
      return false;
    }
    return true;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    try {
      const rawProvider = await web3Modal.connect();
      if (rawProvider.type === 'error') {
        const clear = await web3Modal.clearCachedProvider();
        window.localStorage.clear();
        console.log("disconnected");

        setConnected(false);
        setAddress('');
        return rawProvider;
      }
      await web3Modal.toggleModal();
      // new _initListeners implementation matches Web3Modal Docs
      // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
      _initListeners(rawProvider);
      const connectedProvider = new Web3Provider(rawProvider, "any");

      const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
      const connectedAddress = await connectedProvider.getSigner().getAddress();
      const validNetwork = _checkNetwork(chainId);
      if (!validNetwork) {
        const clear = await web3Modal.clearCachedProvider();
        window.localStorage.clear();
        console.log("disconnected");

        setConnected(false);
        setAddress('');
        return { type: 'error', title: 'Error', detail: 'Wrong network, please switch to Ethereum mainnet' }
      }
      // Save everything after we've validated the right network.
      // Eventually we'll be fine without doing network validations.
      setAddress(connectedAddress);
      setProvider(connectedProvider);

      // Keep this at the bottom of the method, to ensure any repaints have the data we need
      setConnected(true);

      return connectedProvider;
    }
    catch (error) {
      console.log(error);
      return '';
    }
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {

    const clear = await web3Modal.clearCachedProvider();
    window.localStorage.clear();
    console.log("disconnected");

    setConnected(false);
    setAddress('');
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal],
  );

  useEffect(() => {
    // logs non-functioning nodes && returns an array of working mainnet nodes, could be used to optimize connection
    // NodeHelper.checkAllNodesStatus();
  }, []);

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
