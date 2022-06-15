import { Box } from "@material-ui/core";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from 'styled-components'
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from 'react-icons/gi'

import "./topbar.scss";

function TopBar({ theme, setNotification }) {

  const [hamburgeropen, setHamburgerOpen] = useState(false);

  const dialog = useRef();

  useEffect(() => {

    document.addEventListener('mouseup', function (event) {
      if (dialog.current && !dialog.current.contains(event.target)) {
        setHamburgerOpen(false);
      }
    });
  }, []);

  return (

    <StyledContainer>
      <NavBar>
        <Box >
          <img src={'/logo.png'} alt={'logo'} />
        </Box>

        <ConnectMenu theme={theme} setNotification={setNotification} />
      </NavBar>

    </StyledContainer>
  );
}

const NavBar = styled(Box)`
  display: flex;
    justify-content: space-between;
    align-items: center;
  width : 100%;
  max-width : 1400px;
  margin : 0 auto;
  padding : 30px 20px 20px 20px;
  
  @media screen and (max-width : 750px){
    >div>img{
      width : 110px;
      height : 105px;
    }
  padding : 10px 20px 10px 20px;
  }
`;
const StyledContainer = styled(Box)`
    width: 100%;
`;

export default TopBar;
