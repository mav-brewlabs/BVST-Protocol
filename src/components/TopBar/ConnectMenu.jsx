import { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import styled from 'styled-components'

function ConnectMenu({ theme, bigType = false, setNotification }) {

  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const address = useAddress();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  let ellipsis = address
    ? address.slice(0, 4) +
    "..." +
    address.substring(address.length - 4, address.length)
    : "Connect Wallet";

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  function onConnect() {
    connect().then(msg => {
      if (msg.type === 'error') {
        setNotification(msg)
      }
    });
  }

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <ConnectButton bigType={bigType}
      variant="contained"
      color="secondary"
      size="large"
      onClick={() => isConnected ? disconnect() : onConnect()}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      key={1}
    >
      {ellipsis}
    </ConnectButton>
  );
}

const ConnectButton = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 233px;
    height: 64px;

    background: linear-gradient(178.95deg, #00E9C8 0.9%, rgba(0, 233, 200, 0) 152.8%);
    border-radius: 9px;

    font-size : 24px;
    cursor : pointer;
    color : white;

    :hover{
      background: linear-gradient(178.95deg, rgba(0, 233, 200, 0.5) 0.9%, #00E9C8 152.8%);
    }

    @media screen and (max-width : 750px){
      width : 114px;
      height : 29px;
      font-size : 13px;
    }
`;

export default ConnectMenu;
