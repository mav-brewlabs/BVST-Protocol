/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";


import App from "./App";
import store from "./state";

import { RefreshContextProvider } from "./contexts/RefreshContext";
import { TokenPriceContextProvider } from "./contexts/TokenPriceContext";
import { Web3ContextProvider } from "./hooks/web3Context";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ContextProvider>
        <Provider store={store}>
          <RefreshContextProvider>
            <TokenPriceContextProvider>
              <BrowserRouter basename={"/"}>
                <App />
                <ToastContainer />
              </BrowserRouter>
            </TokenPriceContextProvider>
          </RefreshContextProvider>
        </Provider>
      </Web3ContextProvider>
    );
  }
}
