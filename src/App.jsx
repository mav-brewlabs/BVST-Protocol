import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useAddress } from "./hooks/web3Context";

import { Landing, Farm, Pool } from "./views";
import { Box } from "@material-ui/core";
import TopBar from "./components/TopBar/TopBar.jsx";

import "./style.scss";
import { useState, useEffect } from 'react'

import Notification from "./components/Notification";
import axios from 'axios';
import { ethers } from 'ethers'
import { useWeb3Context } from './hooks/web3Context'
import styled from 'styled-components'

function App() {

  const account = useAddress();

  const [notification, setNotification] = useState(null);

  const { connect, hasCachedProvider } = useWeb3Context();

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(msg => {
        if (msg.type === 'error') {
          setNotification(msg)
        }
      });

    } else {
      // then user DOES NOT have a wallet
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
  }, []);

  return (
    <Router>
      <StyledContainer>
        <TopBar setNotification={setNotification} />
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
        </Switch>
      </StyledContainer>
      <Notification data={notification} />
    </Router>
  );
}



const StyledContainer = styled(Box)`
  background-image : url('/images/back.png');
  min-height : 100vh;
  background-position : top center;
  background-size : unset calc(100% - 80px);
`;

export default App;
