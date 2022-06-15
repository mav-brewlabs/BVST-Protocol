import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
} from "@material-ui/core";
import { GROVE_ADDR } from '../../abis/address'
import GroveTokenABI from '../../abis/GroveToken.json'
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks/web3Context";
import ShareHolder from './ShareHolder'
import Accumulator from './Accumulator';
import Trickle from "./Trickle";
import Footer from "../../components/Footer/Footer";
import { useMediaQuery } from '@material-ui/core'

const Landing = ({ account }) => {
    const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();
    const [curpage, setCurPage] = useState(0);
    const sm = useMediaQuery("(max-width: 1440px)");
    const xs = useMediaQuery("(max-width: 750px)");

    return (
        <StyledContainer>
            <Box>
                <Box pt={xs ? '28px' : '47px'} />
                <ShareHolder curpage={curpage} setCurPage={setCurPage} />
                <Box pt={sm ? '30px' : '70px'} />
                <Accumulator curpage={curpage} setCurPage={setCurPage} />
                <Box pt={sm ? '30px' : '70px'} />
                <Trickle curpage={curpage} setCurPage={setCurPage} />
            </Box>
            <Footer />
        </StyledContainer>
    );
};


const StyledContainer = styled(Box)`
    background: conic-gradient(from 91.9deg at 38.87% 20.52%, rgba(0, 201, 202, 0.53) -67.18deg, rgba(14, 70, 120, 0.38) 76.02deg, rgba(18, 37, 99, 0.850441) 124.96deg, rgba(21, 9, 81, 0.85) 166.87deg, rgba(0, 201, 202, 0.53) 292.82deg, rgba(14, 70, 120, 0.38) 436.02deg);
    >div:nth-child(1){
        width : 100%;
        max-width : 1400px;
        margin : 0 auto;
        color : white;
        padding-bottom : 125px;
        min-height : 100vh;
        height : 100%;
    }
    @media screen and (max-width : 750px){
        background-size : 1000px 100%;
        background-position : -200px 0;
    }
`;
export default Landing;
